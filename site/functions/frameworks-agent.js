/**
 * AiGovOps Frameworks Agent — Cloudflare Worker proxy (hardened)
 *
 * Keeps the Anthropic API key server-side. The browser POSTs user context
 * here; this Worker calls the Anthropic API and returns the framework analysis.
 *
 * ── SECURITY (hardened 2026-07) ────────────────────────────────────────────
 * This Worker holds a paid Anthropic API key, so it must never be an open,
 * unlimited proxy (a scripted caller could otherwise run up the bill). It now
 * enforces, in order:
 *   1. Strict Origin allowlist — a request whose Origin is not on the allowlist
 *      gets 403 and never reaches Anthropic (the old code set a CORS header but
 *      still processed every request, including non-browser callers).
 *   2. Request-body cap — bodies over MAX_BODY_BYTES are rejected (413), and
 *      userContext is truncated to MAX_CONTEXT_CHARS before it reaches the model.
 *   3. Per-IP rate limiting via a REQUIRED Cloudflare KV binding (RATE_LIMIT).
 *      If that binding is absent the Worker FAILS CLOSED (503) rather than
 *      serving unlimited LLM calls — so it cannot be deployed as an open proxy
 *      by accident. Provision the namespace before deploying (see wrangler.toml).
 * Note: an Origin header is trivially spoofable by a non-browser client, so the
 * real cost-control here is the IP rate limit; the Origin check just turns away
 * casual cross-origin use. For strict limits, migrate the counter to a Durable
 * Object (KV is eventually consistent, so a burst can briefly exceed the cap).
 *
 * Deploy:
 *   1. cd functions && wrangler deploy
 *   2. wrangler secret put ANTHROPIC_API_KEY
 *   3. Create + bind the KV namespace (see wrangler.toml) — REQUIRED, or the
 *      Worker returns 503 on every request.
 *   4. Set PROXY_URL in js/chat.js to the deployed worker URL.
 */

const ALLOWED_ORIGINS = [
  'https://www.aigovops-foundation.com',
  'https://aigovops-foundation.com',
];

const MAX_BODY_BYTES = 4096;    // whole request body
const MAX_CONTEXT_CHARS = 2000; // userContext handed to the model
const RATE_LIMIT_MAX = 15;      // requests per IP...
const RATE_LIMIT_WINDOW_S = 60; // ...per this many seconds

const SYSTEM_PROMPT = `You are the AiGovOps Foundation governance framework assistant.
Given a user's context (region, industry, AI use cases), identify the top 3-5 most applicable
AI governance frameworks from: EU AI Act, NIST AI RMF, ISO/IEC 42001, GDPR, HIPAA, UK AI Act,
CCPA, Colorado AI Act, Korea AI Basic Act, OVERT 1.0, UNESCO AI Ethics, WCAG 2.2.
For each framework: name, why it applies in ONE sentence, risk level (High/Medium/Low).
Format as compact HTML using <strong> for names. End with one sentence pointing to Lantern to map into code.
Be direct and technical. Max 250 words. No preamble.`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const originAllowed = ALLOWED_ORIGINS.includes(origin);
    const corsHeaders = {
      // Only ever reflect an allowed origin; never echo an arbitrary one.
      'Access-Control-Allow-Origin': originAllowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return json({ error: 'method-not-allowed' }, 405);
    }

    // 1) Origin allowlist — turn away anything not from the Foundation site.
    if (!originAllowed) {
      return json({ error: 'forbidden-origin' }, 403);
    }

    // 2) Body cap — refuse oversized payloads before reading/parsing them fully.
    const declaredLen = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (declaredLen && declaredLen > MAX_BODY_BYTES) {
      return json({ error: 'payload-too-large' }, 413);
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: 'payload-too-large' }, 413);
    }
    let userContext;
    try {
      ({ userContext } = JSON.parse(raw));
    } catch {
      return json({ error: 'invalid-json' }, 400);
    }
    if (!userContext || typeof userContext !== 'string') {
      return json({ error: 'userContext required' }, 400);
    }
    userContext = userContext.slice(0, MAX_CONTEXT_CHARS);

    // 3) Per-IP rate limit — REQUIRED. Fail closed if the KV binding is missing,
    //    so this can never run as an unlimited open proxy.
    if (!env.RATE_LIMIT || typeof env.RATE_LIMIT.get !== 'function') {
      return json({ error: 'rate-limiter-unconfigured' }, 503);
    }
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rlKey = `rl:${ip}`;
    const used = parseInt((await env.RATE_LIMIT.get(rlKey)) || '0', 10);
    if (used >= RATE_LIMIT_MAX) {
      return json({ error: 'rate-limited', retryAfterSeconds: RATE_LIMIT_WINDOW_S }, 429);
    }
    // Fixed-window increment with TTL. Eventually consistent — coarse by design.
    await env.RATE_LIMIT.put(rlKey, String(used + 1), { expirationTtl: RATE_LIMIT_WINDOW_S });

    // Upstream key must be configured too.
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'upstream-unconfigured' }, 503);
    }

    try {
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userContext }],
        }),
      });

      if (!anthropicRes.ok) {
        throw new Error(`Anthropic API error: ${anthropicRes.status}`);
      }

      const data = await anthropicRes.json();
      const reply = (data.content || [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      return json({ reply });

    } catch (err) {
      // Don't leak upstream error detail to the caller.
      return json({ error: 'upstream-error' }, 502);
    }
  },
};
