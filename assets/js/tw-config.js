/* ============================================================
   TAILWIND THEME  —  Sanman Yojana
   Palette: deep navy (trust) + gold (dignity) + ivory (calm)
   ============================================================ */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          ink:       "#0c1826",  /* darkest — footer, overlays       */
          navy:      "#14293f",  /* primary — headings, header, btns */
          navyMid:   "#1f405f",  /* hover / gradient stop            */
          navySoft:  "#eef3f8",  /* tinted surface                   */
          gold:      "#b8912a",  /* accent — CTAs, rules, icons      */
          goldLight: "#d9b449",  /* accent hover / gradient          */
          goldSoft:  "#fbf4de",  /* accent surface                   */
          ivory:     "#faf8f4",  /* page background                  */
          line:      "#e6e0d4",  /* hairline borders                 */
          muted:     "#5b6976"   /* secondary text                   */
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
