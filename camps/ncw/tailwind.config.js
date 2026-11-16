/** Merged from the identical inline `tailwind.config` blocks that 60 pages used to carry
*  alongside the Tailwind Play CDN. Build: `npm run build:css` → docs/assets/css/tailwind.css (committed).
 *  Tailwind v3 is fetched by npx at build time, not a devDependency: its chokidar/braces chain carries
 *  audit advisories that would fail the repo's npm-audit gate, and the compiled sheet is what ships. */
module.exports = {
  content: ["./docs/**/*.html", "./docs/assets/js/**/*.js"],
  theme: {
    extend: {
      colors: { orchard: "#2E7D4F", "orchard-dark": "#23613D", signal: "#E07A2A", "signal-dark": "#C4661C", cream: "#FAF7F0", "cream-deep": "#F1EAD8", charcoal: "#2B2B28" },
      fontFamily: { serif: ["Lora", "Georgia", "serif"], sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
};
