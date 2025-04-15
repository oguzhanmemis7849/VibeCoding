<script setup>
import CodeEditor from "./CodeEditor.vue";
import FunctionList from "@/components/FunctionList.vue";
import AIChatBot from "@/components/AIChatBot.vue";
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
  <div class="grid grid-cols-12 gap-4">
    <div class="lg:col-span-8 col-span-12">
      <CodeEditor v-model="editorContent" />
    </div>
    <div class="lg:col-span-4 md:col-span-6 col-span-12">
      <FunctionList :onFunctionSelect="insertFunctionToEditor" />
    </div>
    <div class="lg:col-span-12 md:col-span-6 col-span-12">
      <AIChatBot />
    </div>
  </div>
</template>
