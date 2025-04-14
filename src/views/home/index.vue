<script setup>
import AIChatBot from "./AIChatBot.vue";
import CodeEditor from "./CodeEditor.vue";
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <CodeEditor class="col-span-2" />
    <AIChatBot class="col-span-1" />
  </div>
</template>
