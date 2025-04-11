<script setup>
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useTheme } from "@/composables/useTheme";
import { PRIMARY_COLORS, COMPONENT_LIGHT_COLORS } from "@/constants";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "1.5rem",
  },
  height: {
    type: String,
    default: "1.5rem",
  },
  color: {
    type: String,
    default: COMPONENT_LIGHT_COLORS.SURFACE_800,
  },
  darkColor: {
    type: String,
    default: PRIMARY_COLORS.SOMPO_WHITE,
  },
  inline: {
    type: Boolean,
    default: false,
  },
});

const { isDark } = useTheme();

const iconColor = computed(() => {
  return isDark.value ? props.darkColor : props.color;
});
</script>

<template>
  <Icon :icon="icon" :color="iconColor" :width="width" :height="height" />
</template>
