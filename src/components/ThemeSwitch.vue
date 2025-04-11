<script setup>
import { useTheme } from "@/composables/useTheme";
import {
  PRIMARY_COLORS,
  TERTIARY_COLORS,
  COMPONENT_DARK_COLORS,
} from "@/constants";

const { isDark } = useTheme();

const toggleSwitchTokens = {
  colorScheme: {
    dark: {
      root: {
        background: COMPONENT_DARK_COLORS.SURFACE_950,
        hoverBackground: COMPONENT_DARK_COLORS.SURFACE_700,
        checkedBackground: COMPONENT_DARK_COLORS.PRIMARY.COLOR,
        checkedHoverBackground: COMPONENT_DARK_COLORS.PRIMARY.HOVER_COLOR,
      },
    },
  },
};
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <label for="theme-mode">Tema Seçimi:</label>
    <ToggleSwitch
      v-model="isDark"
      inputId="theme-mode"
      :dt="toggleSwitchTokens"
    >
      <template #handle="{ checked }">
        <Icon
          :icon="
            checked
              ? 'material-symbols-light:dark-mode'
              : 'material-symbols:light-mode'
          "
          width="1rem"
          height="1rem"
          :color="TERTIARY_COLORS.SOMPO_MEDIUM_ORANGE"
          :darkColor="PRIMARY_COLORS.SOMPO_WHITE"
        />
      </template>
    </ToggleSwitch>
  </div>
</template>
