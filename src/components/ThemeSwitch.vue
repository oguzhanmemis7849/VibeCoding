<script setup>
import { useTheme } from "@/composables/useTheme";
import {
  PRIMARY_COLORS,
  TERTIARY_COLORS,
  COMPONENT_DARK_COLORS,
} from "@/constants";
import { watch } from "vue";
import * as monaco from "monaco-editor";

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

watch(
  () => isDark.value,
  (newValue) => {
    newValue
      ? monaco.editor.setTheme("vs-dark")
      : monaco.editor.setTheme("vs-light");
  },
  { immediate: true }
);
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
