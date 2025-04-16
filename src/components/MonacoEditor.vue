<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { createMonacoEditor } from "@/services";
import openAIService from "@/services/openaiService";
import SaveFunction from "./SaveFunction.vue";
import { useFunctionStore, useEditorStore } from "@/stores";

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

// Function store'a erişim
const functionStore = useFunctionStore();
// Editor store'a erişim
const editorStore = useEditorStore();

const editorContainer = ref(null);
let editorInstance = null;

// Geri al ve ileri al butonlarının durumları
const canUndo = ref(false);
const canRedo = ref(false);

// AI işleme durumu
const isAIProcessing = ref(false);

// Kaydetme dialog durumu
const showSaveDialog = ref(false);

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

// Kaydet butonuna tıklandığında dialog'u aç
const handleSave = () => {
  showSaveDialog.value = true;
};

// Kod kaydedildiğinde
const handleSaveFunction = (data) => {
  functionStore.addFunction(data);
};

// AI ile düzenle fonksiyonu
const handleAIFormat = async () => {
  if (editorInstance && !isAIProcessing.value) {
    try {
      isAIProcessing.value = true;

      const currentText = editorInstance.getValue();
      if (!currentText.trim()) {
        // Boş metin için işlem yapma
        return;
      }

      // OpenAI servisi ile metni formatla
      const formattedText = await openAIService.formatText(currentText);

      if (formattedText) {
        // Düzenleme geçmişini korumak için doğrudan editör değerini değiştirme.
        // Bunun yerine, bir düzenleme işlemi uygulayarak değiştir.
        const model = editorInstance.getModel();

        // Mevcut metin aralığını belirle (tüm belge)
        const fullRange = model.getFullModelRange();

        // Tek bir düzenleme işlemi içinde tüm metni değiştir (geri al için bir adım olarak kaydedilir)
        editorInstance.executeEdits("ai-format", [
          {
            range: fullRange,
            text: formattedText,
            forceMoveMarkers: true,
          },
        ]);

        // Değişikliği parent bileşene ilet
        emit("update:modelValue", formattedText);

        // Buton durumlarını güncelle
        updateButtonStates();
      }
    } catch (error) {
      console.error("AI formatlama hatası:", error);
      // Hata durumunda kullanıcıya bildirim gösterilebilir
    } finally {
      isAIProcessing.value = false;
    }
  }
};

// Chatbot'tan gelen kodu editöre uygulama fonksiyonu
const applyCodeFromChatbot = () => {
  if (editorInstance && editorStore.hasPendingCode) {
    try {
      const formattedText = editorStore.formattedCode;

      // Eğer formatlanmış kod varsa editöre uygula
      if (formattedText) {
        const model = editorInstance.getModel();
        const fullRange = model.getFullModelRange();

        // Tek bir düzenleme işlemi ile tüm metni değiştir
        editorInstance.executeEdits("chatbot-code", [
          {
            range: fullRange,
            text: formattedText,
            forceMoveMarkers: true,
          },
        ]);

        // Değişikliği parent bileşene ilet
        emit("update:modelValue", formattedText);

        // Buton durumlarını güncelle
        updateButtonStates();

        // Uygulandı olarak işaretle
        editorStore.markAsApplied(true);
      }
    } catch (error) {
      console.error("Chatbot kodu uygulama hatası:", error);
      // Hata durumuna geç
      editorStore.markAsApplied(false, error.message);
    }
  }
};

// EditorStore'da bekleyen kod değişikliğini izle
watch(
  () => editorStore.hasPendingCode,
  (hasPendingCode) => {
    if (hasPendingCode) {
      applyCodeFromChatbot();
    }
  }
);

// Component mount olduğunda function store'dan kaydedilmiş fonksiyonları yükle
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

  // Eğer başlangıçta bekleyen kod varsa uygula
  if (editorStore.hasPendingCode) {
    applyCodeFromChatbot();
  }
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
      <Button
        severity="success"
        icon="pi pi-save"
        label="Kaydet"
        @click="handleSave"
      />
      <Button
        icon="pi pi-slack"
        label="AI ile Düzenle"
        :loading="isAIProcessing"
        :disabled="isAIProcessing"
        @click="handleAIFormat"
      />
    </div>
    <div ref="editorContainer" class="monaco-container__editor"></div>

    <!-- Kaydetme Dialog Bileşeni -->
    <SaveFunction
      v-model:showDialog="showSaveDialog"
      :code="editorInstance ? editorInstance.getValue() : ''"
      @save="handleSaveFunction"
    />

    <!-- EditorStore'dan kod başarıyla uygulandığında gösterilecek bildirim -->
    <div
      v-if="editorStore.isApplied"
      class="monaco-container__notification monaco-container__notification--success"
    >
      Kod başarıyla uygulandı!
    </div>

    <!-- EditorStore'dan kod uygulanırken hata oluştuğunda gösterilecek bildirim -->
    <div
      v-if="editorStore.error"
      class="monaco-container__notification monaco-container__notification--error"
    >
      Hata: {{ editorStore.error }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.monaco-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

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
    height: calc($code-editor-height - 5rem);
    border: 1px solid $sompo-medium-platinum;
    border-radius: $border-radius-xs;
    padding: 0.5px;
  }

  &__notification {
    position: absolute;
    top: 3rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 10;
    animation: fadeIn 0.3s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &--success {
      background-color: rgba(0, 200, 83, 0.9);
      color: white;
    }

    &--error {
      background-color: rgba(255, 0, 0, 0.9);
      color: white;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-dark {
  .monaco-container {
    border-color: $sompo-dark-platinum;
  }
}
</style>
