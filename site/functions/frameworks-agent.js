/**
 * AiGovOps Frameworks Agent — Cloudflare Worker proxy
 *
 * Keeps the Anthropic API key server-side. The browser POSTs user context
 * here; this Worker calls the Anthropic API and returns the framework analysis.
 *
 * Deploy:
 *   1. wrangler deploy   (Cloudflare Workers)
 *   2. Set secret: wrangler secret put ANTHROPIC_API_KEY
 *   3. Update PROXY_URL in js/chat.js to your worker URL
 *
 * CORS: only allows requests from aigovops-foundation.com
 */

const ALLOWED_ORIGINS = [
  'https://www.aigovops-foundation.com',
  'https://aigovops-foundation.com',
];

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
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const { userContext } = await request.json();
      if (!userContext || typeof userContext !== 'string') {
        return new Response(JSON.stringify({ error: 'userContext required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

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

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
