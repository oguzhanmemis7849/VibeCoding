<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { createMonacoEditor } from "@/services";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "expressionLanguage",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editorContainer = ref(null);
let editorInstance = null;

onMounted(() => {
  // Editor oluşturuluyor
  editorInstance = createMonacoEditor(
    editorContainer.value,
    props.modelValue,
    props.language
  );
  // Değişiklikleri dinle ve parent bileşene güncelleme gönder
  editorInstance.onDidChangeModelContent(() => {
    const value = editorInstance.getValue();
    emit("update:modelValue", value);
  });
});

// Model value dışarıdan güncellendiğinde editor içeriğini güncelle
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance && newValue !== editorInstance.getValue()) {
      editorInstance.setValue(newValue);
    }
  }
);

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose();
  }
});
</script>

<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<style scoped lang="scss">
.editor-container {
  width: 100%;
  height: 300px;
  border: 1px solid $sompo-medium-platinum;
  border-radius: $border-radius-xs;
  padding: 0.5px;
}

.theme-dark {
  .editor-container {
    border-color: $sompo-dark-platinum;
  }
}
</style>
