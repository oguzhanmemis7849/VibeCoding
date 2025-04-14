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
  <div class="editor-view">
    <MonacoEditor v-model="editorContent" />
  </div>
</template>

<style scoped lang="scss">
.editor-view {
  .output {
    margin-top: 20px;
    padding: 10px;
    border-radius: 4px;
  }
}
</style>
