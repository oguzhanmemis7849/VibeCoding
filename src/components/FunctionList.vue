<script setup>
import { ref, computed } from "vue";
import { useFunctionStore } from "@/stores";
import { useTheme } from "@/composables/useTheme";
import CodePreview from "@/components/CodePreview.vue";

const props = defineProps({
  onFunctionSelect: {
    type: Function,
    default: () => {},
  },
});

// Function store
const functionStore = useFunctionStore();

// UI State
const searchTerm = ref("");
const selectedFunction = ref(null);

// Dialog durumları
const showPreviewDialog = ref(false);
const showDeleteDialog = ref(false);
const functionToDelete = ref(null);

// Tema bilgisi
const { isDark } = useTheme();

// Filtreleme işlevi
const filteredFunctions = computed(() => {
  if (!searchTerm.value) {
    return functionStore.functions;
  }

  const term = searchTerm.value.toLowerCase();
  return functionStore.functions.filter((func) =>
    func.name.toLowerCase().includes(term)
  );
});

// Fonksiyon seçme işlemi
const selectFunction = (func) => {
  selectedFunction.value = func;
  props.onFunctionSelect(func);
};

// Fonksiyon ekleme işlemi - Code Editor içine fonksiyonu ekler
const insertFunction = (func) => {
  // Fonksiyon verisini editöre eklemek için eventi emit ediyoruz
  props.onFunctionSelect(func);
};

// Fonksiyon önizleme
const previewFunction = (func, event) => {
  event.stopPropagation(); // Seçim işlemi tetiklenmesin
  selectedFunction.value = func;
  showPreviewDialog.value = true;
};

// Fonksiyon silme dialogu
const confirmDeleteFunction = (func, event) => {
  event.stopPropagation(); // Seçim işlemi tetiklenmesin
  functionToDelete.value = func;
  showDeleteDialog.value = true;
};

// Fonksiyon silme işlemi
const deleteFunction = () => {
  if (functionToDelete.value) {
    functionStore.removeFunction(functionToDelete.value);
    showDeleteDialog.value = false;
    functionToDelete.value = null;

    // Eğer silinen fonksiyon seçili ise, seçimi kaldır
    if (selectedFunction.value === functionToDelete.value) {
      selectedFunction.value = null;
    }
  }
};

// Önizleme dialogunu kapat
const closePreviewDialog = () => {
  showPreviewDialog.value = false;
};

// Fonksiyon yok ise gösterilecek içerik
const noFunctionsMessage = computed(() => {
  if (functionStore.functions.length === 0) {
    return "Henüz kaydedilmiş fonksiyon bulunmuyor.";
  }

  if (filteredFunctions.value.length === 0) {
    return "Arama kriterine uygun fonksiyon bulunamadı.";
  }

  return null;
});

// Fonksiyon oluşturulma tarihini formatla
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="function-list" :class="{ 'function-list--dark': isDark }">
    <div class="function-list__header">
      <h3 class="function-list__title">Fonksiyonlar</h3>
      <InputText
        v-model="searchTerm"
        type="text"
        placeholder="Fonksiyon ara..."
      />
    </div>

    <div class="function-list__content">
      <div v-if="noFunctionsMessage" class="function-list__empty">
        {{ noFunctionsMessage }}
      </div>

      <ul v-else class="function-list__items">
        <li
          v-for="func in filteredFunctions"
          :key="func.name"
          class="function-list__item"
          :class="{
            'function-list__item--selected': selectedFunction === func,
          }"
          @click="selectFunction(func)"
        >
          <div class="function-list__item-name">
            <span class="function-list__item-symbol">@</span>
            {{ func.name }}
          </div>
          <div class="function-list__item-actions">
            <button
              class="function-list__item-button"
              title="Önizle"
              @click.stop="previewFunction(func, $event)"
            >
              <i class="pi pi-eye"></i>
            </button>
            <button
              class="function-list__item-button"
              title="Sil"
              @click.stop="confirmDeleteFunction(func, $event)"
            >
              <i class="pi pi-trash"></i>
            </button>
            <button
              class="function-list__item-button"
              title="Ekle"
              @click.stop="insertFunction(func)"
            >
              <i class="pi pi-plus"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- Fonksiyon Önizleme Dialog -->
  <Dialog
    v-model:visible="showPreviewDialog"
    modal
    :header="selectedFunction?.name"
    :style="{ width: '40rem' }"
    :dismissable-mask="true"
  >
    <template #header> </template>
    <div v-if="selectedFunction" class="function-preview">
      <div class="function-preview__header">
        <div class="function-preview__meta">
          <span class="function-preview__meta-item">
            <i class="pi pi-calendar"></i>
            {{ formatDate(selectedFunction.createdAt) }}
          </span>
        </div>
      </div>
      <div v-if="selectedFunction?.code" class="function-preview__content">
        <CodePreview :code="selectedFunction.code" />
      </div>
    </div>
    <template #footer>
      <Button
        label="Ekle"
        severity="success"
        @click="
          insertFunction(selectedFunction);
          closePreviewDialog();
        "
      />
    </template>
  </Dialog>

  <!-- Silme Onay Dialog -->
  <Dialog
    v-model:visible="showDeleteDialog"
    modal
    header="Fonksiyonu Sil"
    :style="{ width: '30rem' }"
    :dismissable-mask="true"
  >
    <div class="delete-confirm">
      <p class="delete-confirm__message">
        <strong>{{ functionToDelete?.name }}</strong> fonksiyonunu silmek
        istediğinize emin misiniz? Bu işlem geri alınamaz.
      </p>
    </div>
    <template #footer>
      <Button label="Sil" severity="danger" @click="deleteFunction" />
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.function-list {
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  height: 100%;
  overflow: hidden;
  transition: all 0.3s ease;

  &--dark {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;

    .function-list__item {
      border-color: #4a5568;

      &:hover {
        background-color: #3a4860;
      }

      &--selected {
        background-color: #3a4860;
      }
    }

    .function-list__item-symbol {
      color: #fc8eac; // Pembe renk (dark mode)
    }

    .function-list__item-button {
      color: #e2e8f0;

      &:hover {
        background-color: #4a5568;
      }
    }

    .function-list__empty {
      color: #a0aec0;
    }
  }

  &__header {
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: inherit;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  &__items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid #e9ecef;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f1f3f5;
    }

    &--selected {
      background-color: #e9f2fe;
    }

    &-name {
      font-size: 14px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-symbol {
      color: #ec4899; // Pembe renk (light mode)
      font-weight: bold;
      margin-right: 4px;
    }

    &-actions {
      display: flex;
      gap: 8px;
    }

    &-button {
      background: transparent;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      transition: all 0.2s;

      &:hover {
        background-color: #e9ecef;
      }
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 24px 16px;
    text-align: center;
    color: #6b7280;
    font-size: 14px;
  }
}

.function-preview {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  &__meta {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #6b7280;

    &-item {
      display: flex;
      align-items: center;
      gap: 4px;

      i {
        font-size: 14px;
      }
    }
  }
}

.delete-confirm {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;

  &__icon {
    font-size: 32px;
    color: #e74c3c;
  }

  &__message {
    margin: 0;
    line-height: 1.5;
  }
}
</style>
