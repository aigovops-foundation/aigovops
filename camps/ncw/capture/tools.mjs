// Capture-rig tool registry — which sessions exist, where they live in
// 1Password, and how to tell a login worked.
//
// One session document per *account*, not per product: Gemini and NotebookLM
// share the google session. Item naming follows the estate credential
// convention (op://AiGovOps/<slug>) — these are 1Password DOCUMENTS holding
// Playwright storageState JSON, so the credentials agent can audit their
// presence and expiry like any other secret.

export const VAULT = "AiGovOps";

export const TOOLS = {
  chatgpt: {
    label: "ChatGPT (OpenAI)",
    opItem: "ncw-capture-session-chatgpt",
    loginUrl: "https://chatgpt.com/",
    origins: ["https://chatgpt.com"],
    loggedInHint: '[data-testid="profile-button"], img[alt*="profile" i]',
  },
  claude: {
    label: "Claude (Anthropic)",
    opItem: "ncw-capture-session-claude",
    loginUrl: "https://claude.ai/",
    origins: ["https://claude.ai"],
    loggedInHint: '[data-testid="user-menu-button"], [aria-label*="profile" i]',
  },
  google: {
    label: "Google (Gemini + NotebookLM + Sites/Forms/Calendar)",
    opItem: "ncw-capture-session-google",
    loginUrl: "https://gemini.google.com/",
    origins: [
      "https://gemini.google.com",
      "https://notebooklm.google.com",
      "https://accounts.google.com",
    ],
    loggedInHint: 'a[aria-label*="Google Account" i]',
  },
  copilot: {
    label: "Microsoft Copilot",
    opItem: "ncw-capture-session-copilot",
    loginUrl: "https://copilot.microsoft.com/",
    origins: ["https://copilot.microsoft.com", "https://login.live.com"],
    loggedInHint: '[data-testid="user-avatar"], img[alt*="account" i]',
  },
};

export const SESSIONS_DIR = new URL("../.capture-sessions/", import.meta.url)
  .pathname;
export const CAPTURES_DIR = new URL("../docs/assets/captures/", import.meta.url)
  .pathname;
