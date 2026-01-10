import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ===========================================
        // A. DEEP OCEAN BLUES - Identity / Structure
        // ===========================================
        // Navbars, hero gradients, dark mode backgrounds
        ocean: {
          950: "#043862", // Deeper than mermaid
          900: "#054672", // Mermaid Blues - dark mode main bg
          800: "#0f4e79", // Sea Paint - dark mode secondary
          700: "#145680", // Cards in dark mode
          600: "#205a82", // Oceanic Motion
          500: "#336588", // Mississippi River - body text light
          400: "#486d8a", // Crashing Waves - navbar gradient
          300: "#68748a", // Plumbeous - muted text
          200: "#8a9ba8", // Lighter variant
          100: "#c5d4df", // Very light
          50: "#e8eff4", // Near white with blue tint
        },

        // ===========================================
        // DARK MODE BASE - Near-black navy (premium)
        // ===========================================
        dark: {
          void: "#030508", // Primary background (near-true black)
          surface: "#080C12", // Card/section surfaces
          elevated: "#0C1219", // Elevated elements, inputs
          base: "#050B14", // Keep for backwards compat
        },

        // ===========================================
        // B. WARM METALS - Accent / Action
        // ===========================================
        // CTAs, highlights, active states - USE SPARINGLY
        bronze: {
          900: "#bf611b", // Dwarven Bronze - active/pressed
          800: "#c86c23", // Cajeta
          700: "#cd7931", // Polished Bronze - primary CTA light mode
          600: "#d48f4e", // Golden Nugget - borders
          500: "#e79b47", // Pumpkin Pie - primary CTA dark mode
          400: "#edae5f", // Shiny Trumpet - hover/glow
          300: "#f0bf73", // Light glow
          200: "#f5d4a0", // Very light
          100: "#fae8c8", // Near white warm
          50: "#fdf4e6", // Barely there
        },

        // ===========================================
        // GOLD ACCENT - Primary CTAs (Contrast & Drama)
        // ===========================================
        gold: {
          400: "#FFBE2E", // Highlights, glows
          500: "#F5A623", // Primary CTAs
          600: "#D4890A", // Pressed/active states
        },

        // ===========================================
        // CYAN ACCENT - Secondary highlights (Contrast & Drama)
        // ===========================================
        cyan: {
          400: "#22D3EE", // Bright highlights, hover text
          500: "#06B6D4", // Links, secondary actions
          600: "#0891B2", // Active states
        },

        // ===========================================
        // C. WARM NEUTRALS - Light Mode Surfaces
        // ===========================================
        // Supporting cast, not stars
        sand: {
          50: "#f8fbfd", // Near-white page background
          100: "#ffffff", // Cards / panels
          200: "#f4f7f9", // Slight warmth
          300: "#ead09d", // Sparkling Champagne - section bg
          400: "#e1c89d", // Fortune Cookie
          500: "#f4d390", // Instant Noodles - dark mode primary text
          600: "#f3cd86", // Macaroni
          700: "#d8a570", // Dark mode secondary text
          800: "#c49660", // Deeper
          900: "#a67d4e", // Darkest
        },

        // ===========================================
        // D. MUTED SUPPORT - Text / Borders
        // ===========================================
        // Readability without killing color
        muted: {
          300: "#8b8b8d", // Gull
          400: "#95818a", // Mighty Mauve - muted text
          500: "#bd968f", // Mutabilis
          600: "#a88a84", // Slightly darker
        },

        // ===========================================
        // SEMANTIC COLORS
        // ===========================================
        success: {
          50: "#e8f5ec",
          500: "#4a9a5a",
          600: "#3d8a4d",
        },
        warning: {
          50: "#fdf4e6",
          500: "#e79b47", // Uses bronze
          600: "#d48f4e",
        },
        error: {
          50: "#fdf0f0",
          500: "#c45a5a",
          600: "#a84a4a",
        },

        // ===========================================
        // LEGACY ALIASES - For compatibility
        // ===========================================
        primary: {
          500: "#cd7931", // bronze-700
          600: "#c86c23", // bronze-800
        },
        neutral: {
          50: "#f8fbfd", // sand-50
          100: "#ffffff", // sand-100
          200: "#e8eff4", // ocean-50
          400: "#68748a", // ocean-300
          600: "#336588", // ocean-500
          700: "#205a82", // ocean-600
          800: "#145680", // ocean-700
          900: "#054672", // ocean-900
          950: "#043862", // ocean-950
        },
        // Keep old names for gradual migration
        navy: {
          600: "#205a82",
          700: "#145680",
          800: "#0f4e79",
          900: "#054672",
        },
        amber: {
          400: "#edae5f",
          500: "#e79b47",
          600: "#d48f4e",
          700: "#cd7931",
        },
        cream: {
          50: "#f8fbfd",
          100: "#ffffff",
          200: "#ead09d",
        },
        dusty: {
          50: "#e8eff4",
          100: "#c5d4df",
          200: "#8a9ba8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        // Custom scale matching design system
        display: ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
        h1: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "1.25", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.35", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.75" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      maxWidth: {
        content: "1280px",
        prose: "65ch",
      },
      // ===========================================
      // BORDER RADIUS - Design tokens from redesign
      // ===========================================
      borderRadius: {
        card: "16px",
        button: "12px",
        pill: "999px",
      },

      // ===========================================
      // BOX SHADOWS - Refined shadows with color tinting
      // ===========================================
      boxShadow: {
        // Light mode shadows (blue-tinted for custom feel)
        "card-light": "0 10px 30px rgba(46, 98, 135, 0.12)",
        "lift-light": "0 14px 40px rgba(46, 98, 135, 0.18)",
        // Dark mode shadows
        "card-dark": "0 10px 30px rgba(0, 0, 0, 0.35)",
        "lift-dark": "0 14px 44px rgba(0, 0, 0, 0.45)",
        // CTA glow effect (bronze warmth)
        "cta-glow":
          "0 0 0 1px rgba(237, 174, 95, 0.35), 0 12px 26px rgba(191, 97, 27, 0.28)",
        "cta-glow-hover":
          "0 0 0 1px rgba(237, 174, 95, 0.5), 0 16px 32px rgba(191, 97, 27, 0.35)",
        // Inner keycap shadows for 3D buttons
        "keycap-inset":
          "inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.15)",
        "keycap-pressed": "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
        // Gold and cyan glow shadows (Contrast & Drama)
        "gold-glow": "0 0 30px rgba(245, 166, 35, 0.4)",
        "gold-glow-intense": "0 0 40px rgba(245, 166, 35, 0.5), 0 0 80px rgba(245, 166, 35, 0.2)",
        "cyan-glow": "0 0 25px rgba(6, 182, 212, 0.35)",
      },

      // ===========================================
      // ANIMATIONS - Enhanced with design tokens
      // ===========================================
      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fadeIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        lift: "lift 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        lift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-2px)" },
        },
      },
      transitionDuration: {
        "150": "150ms",
        "180": "180ms",
        "220": "220ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
