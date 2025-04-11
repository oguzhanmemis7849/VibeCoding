<script setup>
import EmptyStatePage from "@/components/EmptyStatePage.vue";
</script>

<template>
  <EmptyStatePage
    :statusCode="404"
    messageTitle="Ulaşmaya çalıştığınız sayfa bulunamadı!"
    messageDescription="Ulaşmaya çalıştığınız sayfa değiştirilmiş ya da silinmiş olabilir."
  />
</template>
