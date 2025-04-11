<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { PRIMARY_COLORS } from "@/constants";
import { useTheme } from "@/composables/useTheme";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    default: null,
  },
  children: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();
const { isDark } = useTheme();

const openId = ref(null);

const isActive = computed(() => route.path === props.to);
const menuIconColor = computed(() => {
  if (isDark.value) {
    return isActive.value ? PRIMARY_COLORS.SOMPO_LIGHT_RED : "";
  }
  return isActive.value ? PRIMARY_COLORS.SOMPO_RED : "";
});
const isChildActive = computed(() => {
  const checkChildrenActive = (children) => {
    return children.some((child) => {
      if (route.path.startsWith(child.path)) return true;
      if (child.children) return checkChildrenActive(child.children);
      return false;
    });
  };
  return checkChildrenActive(props.children);
});
const maxChildMenuHeight = computed(() => {
  if (openId.value !== props.id) return "0";
  const childCount = props.children.length;
  return `${childCount * 50}px`;
});

const handleToggleMenu = (id) => {
  if (openId.value === id) {
    openId.value = null;
    return;
  }
  openId.value = id;
};
</script>

<template>
  <div>
    <!-- Parent Menu -->
    <div
      v-if="!to"
      class="cursor-pointer w-full flex justify-between items-center p-2 rounded-sm"
      :class="{
        'text-sompoRed  bg-white dark:bg-[#263b6b] dark:text-sompoLightRed ':
          isActive || isChildActive,
        'hover:bg-headerBackground  dark:hover:bg-contentBackgroundDark transition-colors duration-150':
          !isChildActive,
      }"
      @click="handleToggleMenu(id)"
    >
      <div class="w-full flex items-center gap-2">
        <Icon
          v-if="icon"
          :icon="icon"
          :color="menuIconColor"
          :darkColor="menuIconColor"
        />
        <p>{{ name }}</p>
      </div>
      <Icon
        v-if="children.length > 0"
        icon="material-symbols:keyboard-arrow-down"
        :darkColor="
          isChildActive
            ? PRIMARY_COLORS.SOMPO_LIGHT_RED
            : PRIMARY_COLORS.SOMPO_WHITE
        "
        :class="{
          '-rotate-180 transition-transform duration-300': openId === id,
          'rotate-0 transition-transform duration-300': openId !== id,
        }"
      />
    </div>
    <router-link
      v-else
      :to="to"
      active-class="inline-flex w-full text-sompoRed bg-white dark:bg-[#263b6b] dark:text-sompoLightRed rounded-sm"
    >
      <div
        class="w-full flex justify-between items-center p-2 rounded-sm"
        :class="{
          'hover:bg-headerBackground  dark:hover:bg-contentBackgroundDark transition-colors duration-150':
            !isActive,
        }"
      >
        <div class="w-full flex items-center gap-2">
          <Icon
            v-if="icon"
            :icon="icon"
            :color="menuIconColor"
            :darkColor="menuIconColor"
          />
          <p>{{ name }}</p>
        </div>
        <Icon
          v-if="children.length > 0"
          icon="material-symbols:keyboard-arrow-down"
          :class="{
            '-rotate-180 transition-transform duration-300': openId === id,
            'rotate-0 transition-transform duration-300': openId !== id,
          }"
        />
      </div>
    </router-link>
    <!-- Parent Menu -->

    <!-- Child Menu (Recursive) -->
    <div
      v-if="children.length"
      class="overflow-hidden transition-[max-height] duration-300"
      :style="{ maxHeight: maxChildMenuHeight }"
    >
      <div class="flex flex-col gap-2 pl-5 mt-2">
        <MenuItem
          v-for="(child, index) in children"
          :id="id + '.' + index"
          :key="index"
          :icon="child.icon"
          :name="child.name"
          :to="child.path"
          :children="child.children"
        />
      </div>
    </div>
    <!-- Child Menu (Recursive) -->
  </div>
</template>
