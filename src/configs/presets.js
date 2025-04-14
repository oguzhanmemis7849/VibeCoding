import { COMPONENT_LIGHT_COLORS, COMPONENT_DARK_COLORS } from "@/constants";

export const options = {
  darkModeSelector: ".theme-dark",
};

export const preset = {
  semantic: {
    colorScheme: {
      light: {
        surface: {
          50: COMPONENT_LIGHT_COLORS.SURFACE_50,
          100: COMPONENT_LIGHT_COLORS.SURFACE_100,
          200: COMPONENT_LIGHT_COLORS.SURFACE_200,
          300: COMPONENT_LIGHT_COLORS.SURFACE_300,
          400: COMPONENT_LIGHT_COLORS.SURFACE_400,
          500: COMPONENT_LIGHT_COLORS.SURFACE_500,
          600: COMPONENT_LIGHT_COLORS.SURFACE_600,
          700: COMPONENT_LIGHT_COLORS.SURFACE_700,
          800: COMPONENT_LIGHT_COLORS.SURFACE_800,
          900: COMPONENT_LIGHT_COLORS.SURFACE_900,
          950: COMPONENT_LIGHT_COLORS.SURFACE_950,
        },
        formField: {
          placeholderColor: "{surface.300}",
        },
        text: {
          color: "{surface.800}",
          hoverColor: "{surface.900}",
        },
      },
      dark: {
        surface: {
          50: COMPONENT_DARK_COLORS.SURFACE_50,
          100: COMPONENT_DARK_COLORS.SURFACE_100,
          200: COMPONENT_DARK_COLORS.SURFACE_200,
          300: COMPONENT_DARK_COLORS.SURFACE_300,
          400: COMPONENT_DARK_COLORS.SURFACE_400,
          500: COMPONENT_DARK_COLORS.SURFACE_500,
          600: COMPONENT_DARK_COLORS.SURFACE_600,
          700: COMPONENT_DARK_COLORS.SURFACE_700,
          800: COMPONENT_DARK_COLORS.SURFACE_800,
          900: COMPONENT_DARK_COLORS.SURFACE_900,
          950: COMPONENT_DARK_COLORS.SURFACE_950,
        },
        primary: {
          color: COMPONENT_DARK_COLORS.PRIMARY.COLOR,
          contrastColor: "{surface.50}",
          hoverColor: COMPONENT_DARK_COLORS.PRIMARY.HOVER_COLOR,
          activeColor: COMPONENT_DARK_COLORS.PRIMARY.ACTIVE_COLOR,
        },
        highlight: {
          background: "color-mix(in srgb, {surface.400}, transparent 64%)",
          focusBackground: "color-mix(in srgb, {surface.400}, transparent 70%)",
          color: "rgba(255,255,255,.87)",
          focusColor: "rgba(255,255,255,.87)",
        },
        mask: {
          background: "rgba(0,0,0,0.6)",
          color: "{surface.200}",
        },
        formField: {
          background: "{surface.950}",
          disabledBackground: "{surface.700}",
          filledBackground: "{surface.800}",
          filledHoverBackground: "{surface.800}",
          filledFocusBackground: "{surface.800}",
          invalidBorderColor: "{red.300}",
          color: "{surface.0}",
          disabledColor: "{surface.400}",
          invalidPlaceholderColor: "{red.400}",
          floatLabelColor: "{surface.400}",
          floatLabelFocusColor: "{primary.color}",
          floatLabelActiveColor: "{surface.400}",
          floatLabelInvalidColor: "{form.field.invalid.placeholder.color}",
          iconColor: "{surface.400}",
          shadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)",
        },
        text: {
          color: "{surface.0}",
          hoverColor: "{surface.50}",
        },
        content: {
          borderColor: "{surface.600}",
        },
      },
    },
  },
  components: {
    tabs: {
      tablist: {
        background: "transparent",
      },
      tabpanel: {
        background: "transparent",
        padding: "0.875rem 0",
      },
    },
    skeleton: {
      colorScheme: {
        light: {
          root: {
            background: "{surface.100}",
            animationBackground: "{surface.50}",
          },
        },
        dark: {
          root: {
            background: "{surface.500}",
            animationBackground: "{surface.400}",
          },
        },
      },
    },
    datepicker: {
      colorScheme: {
        dark: {
          today: {
            background: "{surface.500}",
          },
        },
      },
    },
    datatable: {
      colorScheme: {
        dark: {
          root: {
            borderColor: "{surface.600}",
          },
        },
      },
      header: {
        background: "transparent",
        padding: "0.75rem 0",
        borderWidth: "0",
      },
      row: {
        background: "transparent",
      },
      headerCell: {
        background: "transparent",
      },
      bodyCell: {
        borderColor: "transparent",
      },
    },
    paginator: {
      root: {
        background: "transparent",
      },
    },
    toast: {
      icon: {
        size: "1.5rem",
      },
      colorScheme: {
        dark: {
          blur: "10px",
          info: {
            background: "color-mix(in srgb, {blue.300}, transparent 84%)",
            borderColor: "color-mix(in srgb, {blue.400}, transparent 64%)",
            color: "{blue.400}",
          },
          success: {
            background: "color-mix(in srgb, {green.300}, transparent 84%)",
            borderColor: "color-mix(in srgb, {green.400}, transparent 64%)",
            color: "{green.400}",
          },
          warn: {
            background: "color-mix(in srgb, {yellow.300}, transparent 84%)",
            borderColor: "color-mix(in srgb, {yellow.400}, transparent 64%)",
            color: "{yellow.400}",
          },
          error: {
            background: "color-mix(in srgb, {red.400}, transparent 84%)",
            borderColor: "color-mix(in srgb, {red.400}, transparent 64%)",
            color: "{red.400}",
          },
          secondary: {
            borderColor: "{surface.600}",
          },
          contrast: {
            background: "{surface.100}",
            borderColor: "{surface.800}",
            color: "{surface.700}",
          },
        },
      },
    },
    button: {
      colorScheme: {
        dark: {
          outlined: {
            primary: {
              borderColor: COMPONENT_DARK_COLORS.PRIMARY.COLOR,
            },
          },
        },
      },
    },
  },
  directives: {
    tooltip: {
      root: {
        maxWidth: "14rem",
      },
      colorScheme: {
        dark: {
          root: {
            background: "{surface.200}",
            color: "{surface.950}",
          },
        },
      },
    },
  },
};
