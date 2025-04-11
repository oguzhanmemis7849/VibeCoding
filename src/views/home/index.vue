<script setup>
import AIChatBot from "./AIChatBot.vue";
import CodeEditor from "./CodeEditor.vue";
</script>

<template>
  <div class="flex gap-2 items-center">
    <CodeEditor class="w-1/2 h-full" />
    <AIChatBot class="w-1/2 h-full" />
  </div>
</template>
