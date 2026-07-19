<!-- app/components/main/Card.vue -->
<template>
  <div 
    :class="[
      'bg-white border text-slate-600 transition-all duration-200 overflow-hidden',
      flat ? 'border-gray-100 shadow-none' : 'border-gray-200/80 shadow-xs',
      hover ? 'hover:shadow-md hover:border-gray-300/80' : '',
      radiusClass
    ]"
  >
    <!-- Optional Media/Image Slot (Top of card, goes edge-to-edge) -->
    <div v-if="$slots.media" class="w-full block overflow-hidden">
      <slot name="media" />
    </div>

    <!-- Card Header -->
    <div 
      v-if="title || subtitle || $slots.header" 
      :class="[
        'border-b border-gray-100 flex items-center justify-between',
        paddingClass
      ]"
    >
      <slot name="header">
        <div class="space-y-0.5">
          <h3 v-if="title" class="text-sm font-bold text-slate-900 leading-none">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-xs text-gray-400 font-medium">
            {{ subtitle }}
          </p>
        </div>
      </slot>
    </div>

    <!-- Card Body Content -->
    <div :class="paddingClass">
      <slot />
    </div>

    <!-- Card Footer -->
    <div 
      v-if="$slots.footer" 
      :class="[
        'bg-gray-50/50 border-t border-gray-100 flex items-center justify-between',
        paddingClass
      ]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  // Structural variation flags
  hover: { type: Boolean, default: false }, // Lift shadow on hover
  flat: { type: Boolean, default: false },  // Flat styling border with no base shadow
  // Custom spacing variants
  density: { 
    type: String, 
    default: 'normal',
    validator: (v) => ['compact', 'normal', 'relaxed'].includes(v)
  },
  // Corner styling variants
  rounded: {
    type: String,
    default: 'xl',
    validator: (v) => ['none', 'md', 'xl', '2xl'].includes(v)
  }
})

// Compute padding size dynamically
const paddingClass = computed(() => {
  switch (props.density) {
    case 'compact': return 'px-4 py-3'
    case 'relaxed': return 'px-8 py-6'
    case 'normal':
    default: return 'px-6 py-4'
  }
})

// Compute outer radius styling smoothly
const radiusClass = computed(() => {
  switch (props.rounded) {
    case 'none': return 'rounded-none'
    case 'md': return 'rounded-xl'
    case '2xl': return 'rounded-3xl'
    case 'xl':
    default: return 'rounded-2xl'
  }
})
</script>