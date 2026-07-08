import type { Config } from "tailwindcss";

/**
 * Manual de Marca — Total Living
 * Paleta oficial y tipografías de marca.
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        "tl-beige": "#F2ECE0",
        "tl-gold": "#D6B585",
        "tl-black": "#38382E",
        "tl-olive": "#4A4E38",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
};

export default config;
