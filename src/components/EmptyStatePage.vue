<script setup>
import { useRouter } from "vue-router";
import { ROUTE_NAME } from "@/constants";

defineProps({
  statusCode: {
    type: Number,
    required: true,
  },
  messageTitle: {
    type: String,
    required: true,
  },
  messageDescription: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const redirectToHome = () => {
  router.push({ name: ROUTE_NAME.HOME });
};
</script>

<template>
  <div class="empty-container">
    <div class="empty-container__status-code-container">
      <img src="@/assets/images/Planet.png" alt="planet" />
      <span class="empty-container__status-code-container__code">{{
        statusCode
      }}</span>
    </div>
    <div class="empty-container__message-container">
      <div class="empty-container__message-container__message-title">
        {{ messageTitle }}
      </div>
      <div class="empty-container__message-container__message-description">
        {{ messageDescription }}
      </div>
    </div>
    <Button label="Ana Sayfaya Dön" class="w-2/3" @click="redirectToHome" />
  </div>
</template>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: $gap-md;
  margin: auto;

  &__status-code-container {
    display: flex;
    flex-direction: column;
    &__code {
      font-size: $text-9xl;
      font-weight: $font-weight-bold;
      color: $sompo-dark-platinum;
      position: relative;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 40px;
        background-color: $content-background;
        clip-path: ellipse(60% 100% at 40% 100%);
      }
    }
  }

  &__message-container {
    display: flex;
    flex-direction: column;
    gap: $gap-xs;

    &__message-title {
      font-size: $text-3xl;
    }
  }
}

.theme-dark {
  .empty-container {
    &__status-code-container {
      &__code {
        &::after {
          background-color: $content-background-dark;
        }
      }
    }
  }
}
</style>
