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

// Geri al ve ileri al butonlarının durumları
const canUndo = ref(false);
const canRedo = ref(false);

// Buton durumlarını güncelleme fonksiyonu
const updateButtonStates = () => {
  if (editorInstance && editorInstance.getModel()) {
    canUndo.value = editorInstance.getModel().canUndo();
    canRedo.value = editorInstance.getModel().canRedo();
  }
};

// Geri al fonksiyonu
const handleUndo = () => {
  if (editorInstance && canUndo.value) {
    editorInstance.trigger("keyboard", "undo", null);
    updateButtonStates();
  }
};

// İleri al fonksiyonu
const handleRedo = () => {
  if (editorInstance && canRedo.value) {
    editorInstance.trigger("keyboard", "redo", null);
    updateButtonStates();
  }
};

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
    // Her değişiklikten sonra buton durumlarını güncelle
    updateButtonStates();
  });
  // İlk yüklemede buton durumlarını ayarla
  updateButtonStates();
});

// Model value dışarıdan güncellendiğinde editor içeriğini güncelle
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance && newValue !== editorInstance.getValue()) {
      editorInstance.setValue(newValue);
      // Model değiştiğinde buton durumlarını güncelle
      updateButtonStates();
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
  <div class="monaco-container">
    <div class="monaco-container__action-buttons">
      <div class="monaco-container__action-buttons__undo-redo">
        <Button
          icon="pi pi-undo"
          label="Geri Al"
          :disabled="!canUndo"
          variant="outlined"
          @click="handleUndo"
        />
        <Button
          icon="pi pi-refresh"
          label="İleri Al"
          :disabled="!canRedo"
          variant="outlined"
          @click="handleRedo"
        />
      </div>
      <Button severity="success" icon="pi pi-save" label="Kaydet" />
      <Button severity="info" icon="pi pi-upload" label="Yükle" />
      <Button icon="pi pi-slack" label="AI ile Düzenle" />
    </div>
    <div ref="editorContainer" class="monaco-container__editor"></div>
  </div>
</template>

<style scoped lang="scss">
.monaco-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;

    &__undo-redo {
      display: flex;
      gap: 0.5rem;
      margin-right: auto;
    }
  }

  &__editor {
    width: 100%;
    height: 400px;
    border: 1px solid $sompo-medium-platinum;
    border-radius: $border-radius-xs;
    padding: 0.5px;
  }
}

.theme-dark {
  .monaco-container {
    border-color: $sompo-dark-platinum;
  }
}
</style>
