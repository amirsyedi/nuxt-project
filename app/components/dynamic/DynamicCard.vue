<!-- components/DynamicCards.vue -->
<template>
  <div 
    class="grid grid-cols-1 gap-6 w-full"
    :class="{
      'md:grid-cols-2 lg:grid-cols-4': config.length >= 4,
      'md:grid-cols-3': config.length === 3,
      'md:grid-cols-2': config.length === 2
    }"
  >
    <div
      v-for="(card, index) in config"
      :key="index"
      :class="[
        'rounded-2xl p-6 flex flex-col justify-between shadow-xs border transition duration-200',
        card.theme === 'dark' 
          ? 'bg-slate-900 text-white border-transparent' 
          : 'bg-white text-slate-700 border-gray-200'
      ]"
    >
      <!-- Card Header -->
      <div class="flex items-center justify-between w-full">
        <span 
          :class="[
            'text-xs uppercase tracking-widest font-bold',
            card.theme === 'dark' ? 'text-blue-400' : 'text-slate-900'
          ]"
        >
          {{ card.title }}
        </span>
        
        <!-- Optional Status Badge -->
        <span 
          v-if="card.badge"
          :class="[
            'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide',
            card.badge.style === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          ]"
        >
          {{ typeof card.badge.text === 'function' ? card.badge.text() : card.badge.text }}
        </span>
      </div>

      <!-- Core Value Metric Display -->
      <div 
        :class="[
          'my-4 font-mono text-3xl font-bold tracking-tight text-slate-900',
          card.theme === 'dark' ? 'text-white' : '',
          card.centerText ? 'text-center w-full' : 'text-left'
        ]"
      >
        {{ typeof card.value === 'function' ? card.value() : card.value }}
      </div>

      <!-- Card Footer Actions/Description Layout -->
      <div class="w-full flex items-center justify-between mt-auto pt-2">
        <p v-if="card.description" class="text-xs text-gray-400 leading-relaxed max-w-[80%]">
          {{ typeof card.description === 'function' ? card.description() : card.description }}
        </p>
        
        <button 
          v-if="card.action"
          @click="card.action.handler"
          :disabled="card.action.disabled && card.action.disabled()"
          :class="[
            card.action.type === 'link'
              ? 'text-xs font-bold text-blue-600 hover:text-blue-800 underline text-left cursor-pointer focus:outline-hidden'
              : 'w-full py-2 px-4 rounded-xl text-xs font-bold transition duration-200 text-center cursor-pointer shadow-xs',
            card.action.type === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : '',
            card.action.type === 'secondary' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : '',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          ]"
        >
          {{ card.action.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  config: {
    type: Array,
    required: true
  }
})
</script>