<template>
  <div class="spinner-container" :class="{ 'is-full-screen': fullScreen }">
    <div class="spinner" :style="spinnerStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: '40px'
  },
  color: {
    type: String,
    default: '#42b883'
  },
  thickness: {
    type: String,
    default: '4px'
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
});

const spinnerStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
    borderWidth: props.thickness,
    borderStyle: 'solid',
    borderColor: `${props.color}33`, 
    borderTopColor: props.color
  };
});
</script>

<style scoped>
.spinner-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.spinner-container.is-full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  
  /* Blurry frosted glass effect */
  background-color: rgba(255, 255, 255, 0.4); /* Slight white tint */
  backdrop-filter: blur(0.5px);
  -webkit-backdrop-filter: blur(0.5px); /* Safari support */
}

/* If you want a DARK blurry background instead, use this:
.spinner-container.is-full-screen {
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
*/

.spinner {
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-sizing: border-box;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>