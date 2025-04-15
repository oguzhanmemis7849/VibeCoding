<script setup>
defineProps({
  code: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="code-preview">
    <label for="codePreview">Önizleme:</label>
    <div class="code-preview__code">
      {{ code }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__code {
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 0.5rem;
    font-family: monospace;
    max-height: 150px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.theme-dark {
  .code-preview {
    &__code {
      background-color: #1e1e1e;
      border-color: $sompo-dark-platinum;
    }
  }
}
</style>
