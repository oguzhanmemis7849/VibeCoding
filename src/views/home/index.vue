<script setup>
import CodeEditor from "./CodeEditor.vue";
import FunctionList from "@/components/FunctionList.vue";
import { ref } from "vue";

// Editör içeriği
const editorContent = ref(
  // Başlangıç kodu...
  `eğer (araç kilometre > 10000)
  değilse
eğer (araç modeli === 'Toyota') 
`
);

// Fonksiyon seçildiğinde editöre @ ile ekler
const insertFunctionToEditor = (func) => {
  // Editöre @fonksiyonİsmi şeklinde ekler
  if (func && func.name) {
    // Editör içeriğinin sonuna fonksiyon adını "@" ile ekle
    editorContent.value += `\n@${func.name}`;
  }
};
</script>

<template>
  <div class="editor-container">
    <div class="editor-container__editor">
      <CodeEditor v-model="editorContent" />
    </div>
    <div class="editor-container__function-list">
      <FunctionList :onFunctionSelect="insertFunctionToEditor" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.editor-container {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 16px;

  &__editor {
    flex: 1;
    min-width: 0; // Flex sıkıştırma için gerekli
  }

  &__function-list {
    width: 300px;
    min-width: 300px;
  }
}

// Media query - küçük ekranlarda dikey düzen
@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;

    &__function-list {
      width: 100%;
      height: 300px;
    }
  }
}
</style>
