<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<template>
  <div v-if="isLoading" class="content-load">
    <div class="content__loader__area">
      <img
        src="/Sompo-Sigorta.svg"
        class="content__loader__logo"
        alt="sompo-sigorta"
      />
      <div class="content__loader__balls">
        <div class="content__loader__ball -left"></div>
        <div class="content__loader__ball -center"></div>
        <div class="content__loader__ball -right"></div>
      </div>
    </div>
  </div>
</template>

<style>
.content-load {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
}
.content__loader__area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 0 32px 0;
  overflow: hidden;
  align-items: center;
  .content__loader__logo {
    margin: 0 0 50px 0;
    width: 50px;
    height: auto;
    -webkit-animation: opacity 1s linear infinite alternate;
    animation: opacity 1s linear infinite alternate;
  }
  .content__loader__balls {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 240px;
    height: 26px;
  }
  .content__loader__ball,
  .content__loader__ball:before {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 26px;
  }
  .content__loader__ball {
    position: absolute;
    top: -100px;
    align-items: flex-end;
    height: 100px;
    transform-origin: center center;
    &:before {
      content: "";
      align-items: flex-start;
      height: 26px;
      border-radius: 50%;
      background-color: #b61539;
    }
    &.-center {
      left: 50%;
      transform: translateX(-50%);
      &:before {
        animation: center 1.5s 0.65s infinite normal;
      }
    }
    &.-left {
      left: 71px;
      animation: leftBall 1.5s ease-in-out 0s infinite normal;
      &:before {
        animation: leftBallAnim 1.5s ease 0s infinite normal;
      }
    }
    &.-right {
      right: 71px;
      animation: rightBall 1.5s ease-in-out 0s infinite normal;
      &:before {
        animation: rightBallAnim 1.5s ease 0s infinite normal;
      }
    }
  }
}
@keyframes opacity {
  0% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes center {
  0% {
    background-color: #b61539;
  }
  25% {
    background-color: #d8d8d8;
  }
  50% {
    background-color: #b61539;
  }
  75% {
    background-color: #d8d8d8;
  }
  to {
    background-color: #b61539;
  }
}

@keyframes leftBall {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(75deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes leftBallAnim {
  0% {
    background-color: #d8d8d8;
  }
  25% {
    background-color: #d8d8d8;
  }
  50% {
    background-color: #d8d8d8;
  }
  75% {
    background-color: #b61539;
  }
  to {
    background-color: #b61539;
  }
}

@keyframes rightBall {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-75deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes rightBallAnim {
  0% {
    background-color: #b61539;
  }
  25% {
    background-color: #b61539;
  }
  50% {
    background-color: #b61539;
  }
  75% {
    background-color: #d8d8d8;
  }
  to {
    background-color: #d8d8d8;
  }
}

@keyframes animatedBackground {
  0% {
    background-position: 0 0;
  }
  to {
    background-position: -100% 0;
  }
}
</style>
