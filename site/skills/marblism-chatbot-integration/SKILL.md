---
name: marblism-chatbot-integration
description: >
  How to connect an external backend (e.g. the Marblism backend) to the AiGovOps
  Foundation homepage AI chatbot safely. Use when wiring the chatbot to a live API,
  adding a new chatbot intent that calls a backend, changing how the frameworks agent
  talks to its proxy, or reviewing chatbot integration security. Encodes the existing
  architecture in js/chat.js and functions/frameworks-agent.js: the PROXY_URL pattern,
  keyword intent classifier, Cloudflare Worker proxy, CORS guard, voice layer, and the
  rule that API keys never live in client JS. Trigger on "connect Marblism", "wire the
  backend to the chatbot", "add a chatbot intent", "the agent on my main page".
---

# Marblism / Backend ↔ Chatbot Integration

This skill encodes how the homepage chatbot is built so any new backend connection
follows the same security model instead of taking a shortcut that leaks a credential.

## Existing architecture (js/chat.js)

The chatbot is **vanilla JS, no framework**. Its parts:

1. **Keyword intent classifier** — `classify(text)` matches user input against an
   ordered `INTENT_RULES` array (first match wins). ~10 intents: frameworks, meeting,
   newsletter, event, ken, bob, opensource, beacon, umbrella, support.
2. **Resource map** — `RESOURCES[intent]` holds `{url, label, cta}` for link-style
   responses. Most intents just return a link; they do NOT call a backend.
3. **The one agent that calls an LLM** — `runFrameworkAgent(userContext)` is the only
   intent that hits an API. It uses the `PROXY_URL` pattern (below).
4. **Voice layer** — Web Speech API: `SpeechRecognition` for input (auto-submits on
   end), `speechSynthesis` for TTS readback. Chrome/Edge only; hidden otherwise.
5. **i18n** — chip labels and responses switch with `document.documentElement.lang`.

## THE security pattern — never break this

**API keys never appear in client-side JS.** The browser must never hold a secret.
The pattern in `runFrameworkAgent`:

```javascript
const PROXY_URL = '';  // set to the deployed Cloudflare Worker URL
if (PROXY_URL) {
  // PREFERRED: browser → Worker (no key) → Anthropic (key server-side)
  const res = await fetch(PROXY_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userContext }) });
} else {
  // FALLBACK ONLY: direct browser→API. Acceptable for community/demo use,
  // but the key is NOT protected in this mode. Do not ship a real key this way.
}
```

The Worker (`functions/frameworks-agent.js`) holds the key as a Wrangler secret,
enforces a **CORS allowlist** (only `aigovops-foundation.com` origins), and proxies
the call. This is the template for ANY backend integration.

## Connecting the Marblism backend — the right way

The Marblism backend must be reached through the **same proxy pattern**, not a direct
browser call with a key. Concretely:

### Option A — Marblism backend is already a safe public endpoint (no secret needed)
If Marblism exposes an endpoint that needs no API key (or uses a public/scoped token
that's safe to expose), the browser can call it directly:
```javascript
async function runMarblismAgent(userInput) {
  const res = await fetch(MARBLISM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput, /* …shape per Marblism contract… */ }),
  });
  const data = await res.json();
  addMsg('bot', formatMarblismResponse(data));  // map response → HTML
}
```

### Option B — Marblism requires a secret key (the common case)
Route through a Cloudflare Worker exactly like the frameworks agent:
1. Add a Worker (copy `functions/frameworks-agent.js` as a template).
2. Store the Marblism key: `wrangler secret put MARBLISM_API_KEY`.
3. Keep the CORS allowlist (`aigovops-foundation.com` origins only).
4. Set `MARBLISM_PROXY_URL` in chat.js to the deployed Worker URL.
5. Browser → Worker → Marblism. Key never touches the client.

### Wiring it into the chatbot
- Add a new intent to `INTENT_RULES` (place it correctly — order matters, first match
  wins; generic intents go after specific ones).
- Route that intent to `runMarblismAgent()` in the intent handler.
- Responses go through `addMsg('bot', html)` — which also triggers TTS if voice is
  active (`window.VOICE_SPEAK`). Strip/escape any HTML from the backend before
  injecting it, to avoid XSS from backend content.

## What you MUST get from the Marblism side before coding
You cannot guess these — confirm the contract first:
- **Endpoint URL** (the POST target)
- **Auth method** — none / bearer token / API key header. If a secret is involved → Option B.
- **Request shape** — exact JSON body the endpoint expects.
- **Response shape** — JSON structure to map into chat HTML.
- **Rate limits / CORS** — does Marblism allow browser-origin calls, or must it be proxied?

## Guardrails
- Never put a Marblism secret in `js/chat.js` or any committed file.
- Always escape/sanitize backend-returned content before `innerHTML` injection.
- Keep the CORS allowlist tight on any Worker.
- Test the new intent through Cloud-Mary (`cloud-mary-testing` skill) — add unit
  assertions for the new intent classification and that no secret string ships in chat.js.
- Ship via the `aigovops-deploy-workflow` skill.
