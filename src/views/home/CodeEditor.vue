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
  <div class="editor-container">
    <MonacoEditor
      :modelValue="props.modelValue"
      @update:modelValue="updateContent"
    />
  </div>
</template>

<style scoped lang="scss">
.editor-container {
  height: $code-editor-height;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: $sompo-light-platinum;
  border: 1px solid $sompo-medium-platinum;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
