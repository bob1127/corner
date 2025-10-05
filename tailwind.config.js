const { nextui } = require("@nextui-org/react");
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  images: {
    domains: ['images.unsplash.com'], // Update the domain
  },
  darkMode: ['class'],
  content: [
     "./pages/**/*.{js,ts,jsx,tsx}",
    
    './pages/**/*.{js,ts,jsx,tsx}', // Update paths as needed
    './components/**/*.{js,ts,jsx,tsx}', // Keep components path
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}', // NextUI styles
  ],
  theme: {
    extend: {
      clipPath: {
        slide: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
        'slide-1': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        'text-clip': 'polygon(0 0, 100% 0, 100% 30px, 0 30px)',
      },
      height: {
        '500vh': '500vh',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
        rainbow: 'rainbow var(--speed, 2s) infinite linear',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        },
        rainbow: {
          '0%': { 'background-position': '0%' },
          '100%': { 'background-position': '200%' },
        },
      },
      colors: {
         brand: '#4badf4',
        't-color-1': '#bfbfbf',
        't-color-2': '#d9d9d9',
        't-color-3': '#FDF3C6',
        't-color-4': '#CADFB8',
        't-color-5': '#A8D4D5',
        't-color-6': '#2E90D1',
        't-color-7': '#D0ADAA',
        NavBlue: {
          '100': '#F0F1F7',
          '500': '#3b92d5',
          '600': '#2794B6',
        },
        yellow: '#f6f5f8',
        DBlue: '#526c96',
        LBlue: '#7787a5',
        indexCard: '#f6f6f6',
        FluorescentGreen: '#DFFC21',
        TitleText: {
          '500': '#be605a',
        },
        orange: {
          '500': '#F78C26',
        },
        gray: {
          '100': '#FBFBFB',
          '200': '#EAEAEA',
          '300': '#DFDFDF',
          '400': '#999999',
          '500': '#7F7F7F',
          '600': '#666666',
          '700': '#4C4C4C',
          '800': '#333333',
          '900': '#191919',
        },
        blue: {
          '100': '#E6F0FD',
          '200': '#CCE2FC',
          '300': '#99C5FA',
          '400': '#66A9F7',
          '500': '#338CF5',
          '600': '#0070F4',
          '700': '#0064DA',
          '800': '#0059C2',
          '900': '#004391',
        },
        teal: {
          '100': '#E6FFFA',
          '200': '#B2F5EA',
          '300': '#81E6D9',
          '400': '#4FD1C5',
          '500': '#3ABAB4',
          '600': '#319795',
          '700': '#2C7A7B',
          '800': '#285E61',
          '900': '#234E52',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        'color-1': 'hsl(var(--color-1))',
        'color-2': 'hsl(var(--color-2))',
        'color-3': 'hsl(var(--color-3))',
        'color-4': 'hsl(var(--color-4))',
        'color-5': 'hsl(var(--color-5))',
      },
      boxShadow: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.16)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.16)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        none: 'none',
      },
      fontFamily: {
        custom: ['DF-01', 'sans-serif'],
      },
      zIndex: {
        '-1': '-1',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    addVariablesForColors,
    require('@tailwindcss/forms'), // Forms plugin
    nextui(), // NextUI plugin
    require("tailwindcss-animate"), // Animation plugin
  ],
};

// This plugin adds each Tailwind color as a global CSS variable
function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
