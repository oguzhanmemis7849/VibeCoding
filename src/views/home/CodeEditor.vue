<script setup>
import MonacoEditor from "@/components/MonacoEditor.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

// v-model için emit
const emit = defineEmits(["update:modelValue"]);

// İçerik değiştiğinde emit edilecek
const updateContent = (newContent) => {
  emit("update:modelValue", newContent);
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <MonacoEditor
      :modelValue="props.modelValue"
      @update:modelValue="updateContent"
    />
  </div>
</template>
