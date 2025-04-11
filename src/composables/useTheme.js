import { useDark } from "@vueuse/core";

export const useTheme = () => {
  const isDark = useDark({
    valueDark: "theme-dark",
    valueLight: "theme-light",
    storageKey: "themeMode",
    disableTransition: false,
  });

  return { isDark };
};
