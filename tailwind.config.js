/* ============================================================
   TAILWIND BUILD CONFIG — Sanman Yojana
   ------------------------------------------------------------
   The theme below is the exact same object that assets/js/tw-config.js
   handed to the Play CDN; it is kept here so the built stylesheet and the
   old CDN produce identical utilities.

   To rebuild assets/css/tailwind.css after editing any markup:

     npx tailwindcss@3 -c tailwind.config.js -i assets/css/tailwind.src.css \
                       -o assets/css/tailwind.css --minify

   The `content` globs must keep including assets/js — main.js builds the
   enquiry-form result banner by assigning a className string, and those
   utilities exist nowhere in the HTML. Dropping that glob would purge them
   and the banner would render unstyled.
   ============================================================ */
module.exports = {
  content: [
    "./*.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink:       "#0c1826",
          navy:      "#14293f",
          navyMid:   "#1f405f",
          navySoft:  "#eef3f8",
          gold:      "#b8912a",
          goldLight: "#d9b449",
          goldSoft:  "#fbf4de",
          ivory:     "#faf8f4",
          line:      "#e6e0d4",
          muted:     "#5b6976"
        }
      },
      fontFamily: {
        head: ["Fraunces", "Noto Serif Devanagari", "Georgia", "serif"],
        body: ["Inter", "Noto Sans Devanagari", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12,24,38,.04), 0 8px 24px -10px rgba(12,24,38,.14)",
        card: "0 2px 4px rgba(12,24,38,.05), 0 18px 40px -18px rgba(12,24,38,.22)",
        lift: "0 8px 16px rgba(12,24,38,.07), 0 32px 64px -24px rgba(12,24,38,.30)"
      },
      keyframes: {
        floaty:  { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        ripple:  { "0%": { transform: "scale(1)", opacity: ".55" }, "100%": { transform: "scale(2.2)", opacity: "0" } }
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        ripple: "ripple 2s ease-out infinite"
      },
      maxWidth: { content: "78rem" }
    }
  }
};
