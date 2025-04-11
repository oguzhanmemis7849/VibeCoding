<script setup>
import { useTheme } from "@/composables/useTheme";

const { isDark } = useTheme();
</script>

<template>
  <div class="header-logo">
    <img
      v-if="isDark"
      src="@/assets/images/Sompo-Logo-Dark.svg"
      alt="Sompix-Logo-Dark"
      class="header-logo__img"
    />
    <img
      v-else
      src="@/assets/images/Sompo-Logo-Light.svg"
      alt="Sompix-Logo-Light"
      class="header-logo__img"
    />
  </div>
</template>

<style lang="scss" scoped>
.header-logo {
  height: inherit;
  width: 100%;
  display: flex;
  justify-content: center;

  &__img {
    height: 100%;
    width: auto;
  }
}
</style>
