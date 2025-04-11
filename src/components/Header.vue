<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

defineProps({
  contentDirection: {
    type: String,
    default: "col",
  },
});

const route = useRoute();

const breadcrumb = computed(() => {
  return route.meta.breadcrumb;
});

const pageTitle = computed(() => {
  return route.meta.pageTitle;
});
</script>

<template>
  <div
    :class="[
      { 'flex flex-row gap-4': contentDirection === 'row' },
      { 'flex flex-col': contentDirection === 'col' },
    ]"
  >
    <span
      class="font-bold"
      :class="[
        {
          'md:text-2xl sm:text-xl text-md': contentDirection === 'row',
        },
        { 'text-2xl': contentDirection === 'col' },
      ]"
      >{{ pageTitle }}</span
    >

    <div
      v-if="contentDirection === 'row'"
      class="h-auto border-r-2 border-[#dedede] dark:border-[#52525b]"
    ></div>

    <Breadcrumb class="flex" :model="breadcrumb">
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
        >
          <a :href="href" v-bind="props.action" @click="navigate">
            <span class="max-w-24 sm:max-w-full truncate">{{
              item.label
            }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span>{{ item.label }}</span>
        </a>
      </template>
      <template #separator><span>/</span></template>
    </Breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.p-breadcrumb {
  background: transparent;
  padding: 0;

  &-item-link {
    color: #000;

    &:hover {
      color: #2f2f30;
    }
  }
}

.theme-dark {
  .p-breadcrumb {
    &-item-link {
      color: $sompo-white;

      &:hover {
        color: $sompo-light-platinum;
      }
    }
  }
}
</style>
