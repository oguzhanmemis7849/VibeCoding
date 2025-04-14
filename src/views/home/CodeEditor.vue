<script setup>
import { ref } from "vue";
import MonacoEditor from "@/components/MonacoEditor.vue";

const editorContent = ref(
  // Başlangıç kodu...
  `function hello() {
  console.log("Merhaba, Dünya!");
}`
);
</script>

<template>
  <div class="editor-view">
    <MonacoEditor v-model="editorContent" />
    <section class="output">
      <pre>{{ editorContent }}</pre>
    </section>
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
