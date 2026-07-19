<!-- app/components/main/Modal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Backdrop Overlay -->
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Modal Panel Container Box -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 translate-y-2 opacity-0"
          enter-to-class="transform scale-100 translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 translate-y-0 opacity-100"
          leave-to-class="transform scale-95 translate-y-2 opacity-0"
        >
          <div
            v-if="modelValue"
            :class="['bg-white border border-gray-200 shadow-xl rounded-2xl w-full flex flex-col overflow-hidden max-h-[90vh]', sizeClass]"
            @click.stop
            role="dialog"
            aria-modal="true"
          >
            <!-- Header Bar -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <slot name="header">
                <div>
                  <h3
                    v-if="title"
                    class="text-sm font-bold text-slate-900"
                  >
                    {{ title }}
                  </h3>
                  <p
                    v-if="subtitle"
                    class="text-xs text-gray-400 mt-0.5"
                  >
                    {{ subtitle }}
                  </p>
                </div>
              </slot>

              <!-- Close Window Icon Button Cross -->
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Scrollable Body Content -->
            <div class="px-6 py-4 overflow-y-auto text-sm text-slate-600 custom-scrollbar">
              <slot />
            </div>

            <!-- Footer Toolbar Actions Row -->
            <div
              v-if="$slots.footer"
              class="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  persistent: { type: Boolean, default: false },
  size: { type: String, default: 'md' }
})

const emit = defineEmits(['update:modelValue', 'close'])

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.persistent) closeModal()
}

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'max-w-md'
    case 'lg': return 'max-w-2xl'
    case 'xl': return 'max-w-4xl'
    case '2xl': return 'max-w-6xl'
    case 'md':
    default: return 'max-w-lg'
  }
})

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.modelValue && !props.persistent) {
    closeModal()
  }
}

// FIXED: Added "import.meta.client" checks to prevent SSR execution
watch(() => props.modelValue, (isOpen) => {
  if (!import.meta.client) return // Skip completely on server render!

  if (isOpen) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeyDown)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>