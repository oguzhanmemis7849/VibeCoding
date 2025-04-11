const plugin = require("tailwindcss/plugin");

import {
  STATUS_COLORS_LIGHT,
  STATUS_COLORS_DARK,
  PRIMARY_COLORS,
  SECONDARY_COLORS,
  TERTIARY_COLORS,
  COMPONENT_LIGHT_COLORS,
  COMPONENT_DARK_COLORS,
  TERM_COLORS,
} from "./src/constants/colorPalette";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: ["class", ".theme-dark"],
  theme: {
    extend: {
      fontSize: {
        base: "1rem", // $font-size-base
      },
      fontWeight: {
        light: 300, // $font-weight-light
        regular: 400, // $font-weight-regular
        medium: 500, // $font-weight-medium
        bold: 700, // $font-weight-bold
      },
      spacing: {
        xs: "0.5rem", // $padding-xs
        sm: "1rem", // $padding-sm
        md: "1.5rem", // $padding-md
        lg: "2rem", // $padding-lg
        xl: "2.5rem", // $padding-xl
        "2xl": "3rem", // $padding-2xl
      },
      borderRadius: {
        xs: "0.25rem", // $border-radius-xs
        sm: "0.5rem", // $border-radius-sm
        md: "1rem", // $border-radius-md
        lg: "1.5rem", // $border-radius-lg
        xl: "2rem", // $border-radius-xl
        "2xl": "2.5rem", // $border-radius-2xl
      },
      colors: {
        successLight: STATUS_COLORS_LIGHT.SUCCESS,
        successDark: STATUS_COLORS_DARK.SUCCESS,
        dangerLight: STATUS_COLORS_LIGHT.DANGER,
        dangerDark: STATUS_COLORS_DARK.DANGER,
        sompoRed: PRIMARY_COLORS.SOMPO_RED,
        sompoLightPlatinum: PRIMARY_COLORS.SOMPO_LIGHT_PLATINUM,
        sompoLightRed: PRIMARY_COLORS.SOMPO_LIGHT_RED,
        sompoDarkRed: SECONDARY_COLORS.SOMPO_DARK_RED,
        sompoMediumRed: SECONDARY_COLORS.SOMPO_MEDIUM_RED,
        sompoMediumPlatinum: SECONDARY_COLORS.SOMPO_MEDIUM_PLATINUM,
        sompoDarkPlatinum: SECONDARY_COLORS.SOMPO_DARK_PLATINUM,
        sompoDarkPurple: TERTIARY_COLORS.SOMPO_DARK_PURPLE,
        sompoMediumPurple: TERTIARY_COLORS.SOMPO_MEDIUM_PURPLE,
        sompoLightPurple: TERTIARY_COLORS.SOMPO_LIGHT_PURPLE,
        sompoDarkOrange: TERTIARY_COLORS.SOMPO_DARK_ORANGE,
        sompoMediumOrange: TERTIARY_COLORS.SOMPO_MEDIUM_ORANGE,
        sompoLightOrange: TERTIARY_COLORS.SOMPO_LIGHT_ORANGE,
        layoutBackground: COMPONENT_LIGHT_COLORS.SURFACE_50,
        layoutBackgroundDark: COMPONENT_DARK_COLORS.SURFACE_950,
        contentBackground: PRIMARY_COLORS.SOMPO_WHITE,
        contentBackgroundDark: COMPONENT_DARK_COLORS.SURFACE_700,
        headerBackground: "#f5f6f799", // $header-background
        headerBackgroundDark: "#161f32", // $header-background-dark
        cascoColor: TERM_COLORS.CASCO,
        trafficColor: TERM_COLORS.TRAFFIC,
        offerColor: TERM_COLORS.OFFER,
        darkPrimaryButton: COMPONENT_DARK_COLORS.PRIMARY.COLOR,
        darkPrimaryHoverButton: COMPONENT_DARK_COLORS.PRIMARY.HOVER_COLOR,
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: "14px" },
      });
    }),
  ],
};
