// Stub endpoint for /api/sign — returns 200 with a thank-you.
// The landing page works even if this endpoint is absent (it stores to
// localStorage and shows the success state regardless). This handler is
// provided so a future deploy can persist signatures server-side.
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Use POST to sign the pledge." });
    return;
  }
  // In production, persist req.body here (DB, sheet, etc.).
  res.status(200).json({
    ok: true,
    message: "Thank you for signing the NCW AI Partnership Pledge."
  });
}
