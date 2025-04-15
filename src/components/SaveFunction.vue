<script setup>
import { ref } from "vue";
import { useFunctionStore } from "@/stores";
import CodePreview from "@/components/CodePreview.vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:showDialog", "save"]);

const functionStore = useFunctionStore();

const codeName = ref("");
const errorMessage = ref("");

const validateAndSave = () => {
  // Basit doğrulama
  if (!codeName.value.trim()) {
    errorMessage.value = "Lütfen kodunuza bir isim verin.";
    return;
  }

  if (functionStore.functions.find((f) => f.name === codeName.value.trim())) {
    errorMessage.value =
      "Bu isimde bir kod zaten mevcut. Farklı bir isim deneyin.";
    return;
  }

  // Hata mesajını temizle
  errorMessage.value = "";

  // Kaydetme işlemi (şimdilik console)
  console.log(`"${codeName.value}" isimli kod kaydediliyor:`, props.code);

  // Kaydetme olayını üst bileşene gönder
  emit("save", {
    name: codeName.value,
    code: props.code,
    createdAt: new Date(),
  });

  // Dialog'u kapat
  emit("update:showDialog", false);

  // Form alanını temizle
  codeName.value = "";
};

const handleCancel = () => {
  // Dialog'u kapat ve formu temizle
  emit("update:showDialog", false);
  codeName.value = "";
  errorMessage.value = "";
};
</script>

<template>
  <Dialog
    :visible="showDialog"
    modal
    dismissableMask
    header="Kodu Kaydet"
    :style="{ minWidth: '40rem' }"
    @update:visible="emit('update:showDialog', $event)"
  >
    <div class="save-dialog-content">
      <div class="save-dialog-content__form-group">
        <label for="codeName">Kod İsmi:</label>
        <InputText
          id="codeName"
          v-model="codeName"
          placeholder="Kodunuza bir isim verin"
          autofocus
        />
        <small v-if="errorMessage" class="text-sompoRed">{{
          errorMessage
        }}</small>
      </div>

      <div v-if="code">
        <CodePreview :code="code" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button label="İptal" @click="handleCancel" />
        <Button
          label="Kaydet"
          autofocus
          severity="success"
          @click="validateAndSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.save-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
