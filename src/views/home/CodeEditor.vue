<script setup>
import { ref } from "vue";
import MonacoEditor from "@/components/MonacoEditor.vue";

const editorContent = ref(
  // Başlangıç kodu...
  `eğer (araç kilometre > 10000)
  değilse
eğer (araç modeli === 'Toyota') 
`
);
</script>

<template>
  <div class="flex flex-col gap-2">
    <MonacoEditor v-model="editorContent" />
  </div>
</template>
