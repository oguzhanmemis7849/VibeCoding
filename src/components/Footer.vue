<script setup>
import { useTheme } from "@/composables/useTheme";

const { isDark } = useTheme();
</script>

<template>
  <div class="h-full flex items-center justify-between pr-xs pl-">
    <div class="w-28">
      <img
        v-if="isDark"
        src="@/assets/images/Sompo-Logo-Dark.svg"
        alt="Sompo-Logo-Dark"
      />
      <img
        v-else
        src="@/assets/images/Sompo-Logo-Light.svg"
        alt="Sompo-Logo-Light"
      />
    </div>
    <span class="text-xs">© 2025 Sompo Sigorta. Tüm hakları saklıdır.</span>
  </div>
</template>
