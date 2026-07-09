import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        border: "var(--line)",
        input: "var(--line-strong)",
        ring: "var(--coral)",
        background: "var(--bg)",
        foreground: "var(--fg)",
        primary: {
          DEFAULT: "var(--coral)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--cream-200)",
          foreground: "var(--ink-700)",
        },
        accent: {
          DEFAULT: "var(--durazno)",
          foreground: "var(--ink-900)",
        },
        muted: {
          DEFAULT: "var(--cream-200)",
          foreground: "var(--ink-500)",
        },
        destructive: {
          DEFAULT: "var(--danger)",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--fg)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--fg)",
        },
        success: "var(--salvia-d)",
        warning: "var(--mostaza-d)",
        whatsapp: {
          DEFAULT: "var(--whatsapp)",
          dark: "var(--whatsapp-d)",
        },
        cream: {
          50: "var(--cream-50)",
          100: "var(--cream-100)",
          200: "var(--cream-200)",
          300: "var(--cream-300)",
        },
        sand: {
          400: "var(--sand-400)",
        },
        ink: {
          300: "var(--ink-300)",
          500: "var(--ink-500)",
          700: "var(--ink-700)",
          900: "var(--ink-900)",
        },
        durazno: {
          DEFAULT: "var(--durazno)",
          dark: "var(--durazno-d)",
        },
        salvia: {
          DEFAULT: "var(--salvia)",
          dark: "var(--salvia-d)",
        },
        celeste: {
          DEFAULT: "var(--celeste)",
          dark: "var(--celeste-d)",
        },
        coral: {
          DEFAULT: "var(--coral)",
          dark: "var(--coral-d)",
        },
        mostaza: {
          DEFAULT: "var(--mostaza)",
          dark: "var(--mostaza-d)",
        },
        rosa: "var(--rosa)",
      },
      borderRadius: {
        lg: "var(--r-lg)",
        md: "var(--r-md)",
        sm: "var(--r-sm)",
        xl: "var(--r-xl)",
        "2xl": "var(--r-2xl)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        xs: "var(--sh-xs)",
        sm: "var(--sh-sm)",
        md: "var(--sh-md)",
        lg: "var(--sh-lg)",
        focus: "var(--sh-focus)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Outfit", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "DM Serif Display", "Georgia", "serif"],
        script: ["var(--font-script)", "Caveat", "cursive"],
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        soft: "var(--ease-soft)",
        bounce: "var(--ease-bounce)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
