<script setup>
import NavMenu from "@/components/NavMenu/index.vue";
import Header from "@/components/Header.vue";
import HeaderLogo from "@/components/HeaderLogo.vue";
import Footer from "@/components/Footer.vue";
import { LAYOUT, BREAKPOINTS } from "@/constants";
import { useRoute } from "vue-router";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useScroll } from "@vueuse/core";

const route = useRoute();
const { y } = useScroll(window);
const isMenuOpen = ref(false);
const windowWidth = ref(window.innerWidth);

/**
 * NavMenu open close
 * @return {void}
 */
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

/**
 * Window width update
 * @return {void}
 */
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;

  if (windowWidth.value > BREAKPOINTS.XL) {
    isMenuOpen.value = false;
  }
};

/**
 * Header border radius update
 * @return {void}
 */
const handleScroll = () => {
  if (!route.meta.showHeader) return;
  const scrollPosition = y.value;

  if (scrollPosition > LAYOUT.MAX_SCROLL_POSITION) {
    document
      .querySelector(".layout__container__body__header")
      .classList.remove("rounded-border");
  } else {
    document
      .querySelector(".layout__container__body__header")
      .classList.add("rounded-border");
  }
};

/**
 * Dynamic header height
 * @return {string}
 * @description Calculate header height based on scroll distance
 * @description Minimum height: LAYOUT.HEADER_MIN_HEIGHT, Maximum height: LAYOUT.HEADER_MAX_HEIGHT
 */
const dynamicHeaderHeight = computed(() => {
  const minHeight = LAYOUT.HEADER_MIN_HEIGHT;
  const maxHeight = LAYOUT.HEADER_MAX_HEIGHT;
  const threshold = LAYOUT.THRESHOLD;

  return `${Math.max(
    minHeight,
    maxHeight - (y.value / threshold) * (maxHeight - minHeight)
  )}rem`;
});

/**
 * Dynamic padding
 * @return {string}
 * @description Calculate padding based on scroll distance
 * @description Minimum padding: 0.5rem, Maximum padding: 1rem
 */
const dynamicPadding = computed(() => {
  const minPadding = 0.5;
  const maxPadding = 0.75;
  const threshold = LAYOUT.THRESHOLD;

  return `${Math.max(
    minPadding,
    maxPadding - (y.value / threshold) * (maxPadding - minPadding)
  )}rem`;
});

const headerContentDirection = computed(() => {
  const headerHeight = dynamicHeaderHeight.value.split("rem")[0];
  return headerHeight <=
    (LAYOUT.HEADER_MIN_HEIGHT + LAYOUT.HEADER_MAX_HEIGHT) / 2
    ? "row"
    : "col";
});

onMounted(async () => {
  window.addEventListener("resize", updateWindowWidth);
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(async () => {
  window.removeEventListener("resize", updateWindowWidth);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="layout">
    <div class="layout__container">
      <div v-if="isMenuOpen" class="overlay" @click="toggleMenu"></div>
      <aside
        class="layout__container__nav-menu"
        :class="{ 'responsive-menu': isMenuOpen }"
      >
        <NavMenu></NavMenu>
      </aside>
      <div class="layout__container__body">
        <header
          v-if="route.meta.showHeader || windowWidth <= BREAKPOINTS.XL"
          class="layout__container__body__header"
          :style="{ height: dynamicHeaderHeight }"
        >
          <Icon
            class="menu-button"
            :class="!route.meta.showHeader ? 'mr-0' : 'mr-4'"
            icon="material-symbols:menu"
            @click="toggleMenu"
          />
          <HeaderLogo
            v-if="!route.meta.showHeader"
            :style="{ padding: dynamicPadding }"
          />
          <Header
            v-if="route.meta.showHeader"
            :contentDirection="headerContentDirection"
          />
        </header>
        <main
          class="layout__container__body__main-content"
          :class="{ 'no-header': !route.meta.showHeader }"
        >
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <footer class="layout__container__body__main-content__footer">
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  min-height: 100vh;
  transition: all 0.3 ease-in-out;

  &__container {
    display: flex;
    height: 100%;
    min-height: 100vh;
    background: $layout-background;
    padding-left: $nav-menu-width;

    @media (max-width: $xl-screen) {
      padding-left: $padding-xs;
    }

    &__nav-menu {
      position: fixed;
      left: 0;
      top: 0;
      width: $nav-menu-width;
      height: 100%;
      background: $layout-background;
      transition: transform 0.3s ease-in-out;

      @media (max-width: $xl-screen) {
        position: fixed;
        top: 0;
        left: -100%;
        z-index: 1000;
        transform: translateX(-100%);

        &.responsive-menu {
          transform: translateX(0);
          left: 0;
        }
      }
    }

    &__body {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 100vh;
      padding: $padding-xs $padding-xs $padding-xs 0;

      &__header {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        background: $header-background;
        padding: 0 $padding-md;
        color: $sompo-black;
        backdrop-filter: blur(1rem);
        z-index: 2;

        .menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;

          @media (max-width: $xl-screen) {
            display: block;
          }
        }
      }

      &__main-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: $padding-md;
        border-radius: 0 0 $border-radius-sm $border-radius-sm;
        background: $content-background;
        box-shadow: 0 0.25rem 0.35rem 0 rgba(0, 0, 0, 0.08);

        &.no-header {
          border-radius: $border-radius-sm;
        }

        &__footer {
          padding: $padding-md 0 0 0;
        }
      }

      &__download-info {
        position: fixed;
        bottom: $padding-sm;
        right: $padding-sm;
        z-index: 1;
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 999;
    }

    .rounded-border {
      border-radius: $border-radius-sm $border-radius-sm 0 0;
    }
  }
}

.theme-dark {
  .layout {
    &__container {
      background: $layout-background-dark;

      &__nav-menu {
        background: $layout-background-dark;
      }

      &__body {
        &__header {
          background: $header-background-dark;
          color: $sompo-white;
        }

        &__main-content {
          background: $content-background-dark;
        }
      }
    }
  }
}

.fade-enter-active {
  animation: fadeIn 0.2s steps(4, end);
}

.fade-leave-active {
  animation: fadeOut 0.2s steps(4, end);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.75;
  }
  50% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.25;
  }
  100% {
    opacity: 0;
  }
}
</style>
