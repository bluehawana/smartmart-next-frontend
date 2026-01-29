import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Premium Color Palette - Nordic Luxe Tech
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: "#0A0A0A",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
        // Accent - Warm Gold
        accent: {
          DEFAULT: "#D4A853",
          light: "#E8C97A",
          dark: "#B8923F",
          50: "#fefce8",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#E8C97A",
          500: "#D4A853",
          600: "#B8923F",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        // Semantic colors
        success: {
          DEFAULT: "#22c55e",
          light: "#86efac",
          dark: "#16a34a",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fcd34d",
          dark: "#d97706",
        },
        error: {
          DEFAULT: "#ef4444",
          light: "#fca5a5",
          dark: "#dc2626",
        },
        // System colors (shadcn compatibility)
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      // Premium Typography
      fontFamily: {
        display: ["Clash Display", "system-ui", "sans-serif"],
        body: ["Satoshi", "DM Sans", "system-ui", "sans-serif"],
        sans: ["Satoshi", "DM Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display sizes
        "display-2xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-xs": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      // Spacing
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
      },
      // Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      // Box Shadow
      boxShadow: {
        "soft-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
        "soft-md": "0 4px 16px -4px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 8px 32px -8px rgba(0, 0, 0, 0.12)",
        "soft-xl": "0 16px 48px -12px rgba(0, 0, 0, 0.15)",
        "soft-2xl": "0 24px 64px -16px rgba(0, 0, 0, 0.2)",
        glow: "0 0 40px rgba(212, 168, 83, 0.15)",
        "glow-lg": "0 0 60px rgba(212, 168, 83, 0.2)",
        "inner-glow": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
      },
      // Animations
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "fade-in-down": "fadeInDown 0.4s ease-out forwards",
        "slide-in-left": "slideInLeft 0.4s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 168, 83, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 168, 83, 0.5)" },
        },
      },
      // Transitions
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Background Image
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": `
          radial-gradient(at 40% 20%, rgba(212, 168, 83, 0.08) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(212, 168, 83, 0.05) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(212, 168, 83, 0.05) 0px, transparent 50%)
        `,
      },
      // Max Width
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      // Z-Index
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
