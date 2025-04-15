<script setup>
import { ref, computed } from "vue";
import { useFunctionStore } from "@/stores";

// Store'a erişim
const functionStore = useFunctionStore();

// Kaydedilen fonksiyonları al
const functions = computed(() => functionStore.functions);

// Seçilen fonksiyon ve önizleme dialogu
const selectedFunction = ref(null);
const showPreviewDialog = ref(false);

// Fonksiyon seçildiğinde önizleme dialog'unu aç
const showFunctionPreview = (func) => {
  selectedFunction.value = func;
  showPreviewDialog.value = true;
};

// Dialog'u kapat
const closePreviewDialog = () => {
  showPreviewDialog.value = false;
  // Dialog tamamen kapandıktan sonra seçili fonksiyonu temizle
  setTimeout(() => {
    selectedFunction.value = null;
  }, 300);
};
</script>

<template>
  <div class="function-list">
    <h2 class="function-list__title">Kaydedilen Fonksiyonlar</h2>

    <div v-if="functions.length === 0" class="function-list__empty">
      Henüz kaydedilmiş fonksiyon bulunmuyor.
    </div>

    <div v-else class="function-list__items">
      <div
        v-for="func in functions"
        :key="func.id"
        class="function-list__item"
        @click="showFunctionPreview(func)"
      >
        <div class="function-list__item-name">{{ func.name }}</div>
      </div>
    </div>

    <!-- Fonksiyon Önizleme Dialog'u -->
    <Dialog
      :visible="showPreviewDialog"
      modal
      header="Fonksiyon Önizleme"
      :style="{ width: '50rem' }"
      @update:visible="closePreviewDialog"
    >
      <div v-if="selectedFunction" class="function-list__preview">
        <div class="function-list__preview-header">
          <h3>{{ selectedFunction.name }}</h3>
          <div class="function-list__preview-date">
            Oluşturulma:
            {{ new Date(selectedFunction.createdAt).toLocaleString() }}
          </div>
        </div>

        <div class="function-list__preview-content">
          <pre>{{ selectedFunction.code }}</pre>
        </div>
      </div>

      <template #footer>
        <div class="function-list__preview-footer">
          <Button
            label="Kapat"
            icon="pi pi-times"
            class="p-button-text"
            @click="closePreviewDialog"
          />
          <Button
            label="Editörde Aç"
            icon="pi pi-pencil"
            severity="primary"
            @click="
              $emit('select-function', selectedFunction);
              closePreviewDialog();
            "
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.function-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid $sompo-light-platinum;
  }

  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    font-style: italic;
    color: $sompo-medium-platinum;
    text-align: center;
    border: 1px dashed $sompo-light-platinum;
    border-radius: $border-radius-md;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    max-height: 400px;
  }

  &__item {
    padding: 0.75rem 1rem;
    background-color: white;
    border: 1px solid $sompo-light-platinum;
    border-radius: $border-radius-sm;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: $sompo-bronze;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    &-name {
      font-weight: 500;
    }
  }

  &__preview {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      h3 {
        margin: 0;
        font-size: 1.1rem;
      }
    }

    &-date {
      font-size: 0.8rem;
      color: $sompo-medium-platinum;
    }

    &-content {
      max-height: 300px;
      overflow-y: auto;
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: $border-radius-sm;
      font-family: monospace;

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    &-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  }
}

.theme-dark {
  .function-list {
    &__empty {
      border-color: $sompo-dark-platinum;
      color: $sompo-dark-platinum;
    }

    &__item {
      background-color: $sompo-black;
      border-color: $sompo-dark-platinum;

      &:hover {
        border-color: $sompo-bronze;
      }
    }

    &__preview-content {
      background-color: $sompo-black;
    }
  }
}
</style>
