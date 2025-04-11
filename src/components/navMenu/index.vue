<script setup>
import MenuItem from "./MenuItem.vue";
import ThemeSwitch from "@/components/ThemeSwitch.vue";
import HeaderLogo from "@/components//HeaderLogo.vue";
import { menuList } from "@/helpers/menuList";
import { ROUTE_NAME, LAYOUT } from "@/constants";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useScroll } from "@vueuse/core";

const { y } = useScroll(window);
const menuItems = ref(menuList);

/**
 * NavMenu top padding update
 * @return {void}
 */
const handleScroll = () => {
  const scrollPosition = y.value;

  if (scrollPosition < LAYOUT.NAV_MENU_MAX_SCROLL_POSITION) {
    document.querySelector(".nav-layout").classList.remove("menu-padding-top");
  } else {
    document.querySelector(".nav-layout").classList.add("menu-padding-top");
  }
};

/**
 * Dynamic logo height
 * @return {string}
 * @description Calculate logo height based on scroll distance
 * @description Minimum logo height: LAYOUT.HEADER_MIN_HEIGHT, Maximum logo height: LAYOUT.HEADER_MAX_HEIGHT
 */
const dynamicLogoHeight = computed(() => {
  const minLogoHeight = LAYOUT.HEADER_MIN_HEIGHT;
  const maxLogoHeight = LAYOUT.HEADER_MAX_HEIGHT;
  const threshold = LAYOUT.THRESHOLD;

  return `${Math.max(
    minLogoHeight,
    maxLogoHeight - (y.value / threshold) * (maxLogoHeight - minLogoHeight)
  )}rem`;
});

const dynamicPadding = computed(() => {
  const minPadding = 0.5;
  const maxPadding = 0.75;
  const threshold = LAYOUT.THRESHOLD;

  return `${Math.max(
    minPadding,
    maxPadding - (y.value / threshold) * (maxPadding - minPadding)
  )}rem`;
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="nav-layout">
    <router-link class="nav-layout__header" :to="{ name: ROUTE_NAME.HOME }">
      <HeaderLogo
        class="nav-layout__header__logo"
        :style="{ height: dynamicLogoHeight, padding: dynamicPadding }"
      />
      <hr class="nav-layout__divider" />
    </router-link>

    <div class="nav-layout__content">
      <div class="nav-layout__menu">
        <template v-if="menuItems.length > 0">
          <div
            v-for="(menu, index) in menuItems"
            :key="index"
            class="nav-layout__menu__item"
          >
            <MenuItem
              :id="index"
              :children="menu.children"
              :icon="menu.icon"
              :name="menu.name"
              :to="menu.path"
            />
          </div>
        </template>
        <div v-else class="nav-layout__menu__not-found">
          <span>Aradığınız menü bulunamadı.</span>
        </div>
      </div>
    </div>

    <div class="nav-layout__theme-switch">
      <ThemeSwitch />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $padding-xs $padding-sm;
  gap: $gap-sm;
  color: #000;
  transition: all 0.3s ease-in-out;

  &.menu-padding-top {
    padding: 0 $padding-sm $padding-xs $padding-sm;
  }

  &__header {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;

    &__logo {
      display: flex;
      align-items: center;
    }
  }

  &__divider {
    border-color: #dedede;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $gap-sm;
    overflow: hidden;
    padding: $padding-xs 0;
  }

  &__menu {
    flex: 1;
    overflow-y: auto;

    &__item {
      padding: 0 $padding-xs;
      margin-bottom: $margin-xs;
    }

    &__not-found {
      padding: 0 $padding-xs;
      text-align: center;
    }
  }

  &__theme-switch {
    padding: $padding-xs;
  }
}

.theme-dark {
  .nav-layout {
    color: $sompo-white;

    &__divider {
      border-color: #52525b;
    }
  }
}
</style>
