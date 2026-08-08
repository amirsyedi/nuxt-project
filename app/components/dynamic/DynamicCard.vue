<!-- components/DynamicCards.vue -->
<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Row Loop -->
    <div
      v-for="(row, rowIndex) in config"
      :key="rowIndex"
      class="grid grid-cols-1 gap-6 w-full"
      :class="getRowGridClass(row.length)"
    >
      <!-- Card Loop inside each Row -->
      <div
        v-for="(card, cardIndex) in row"
        :key="cardIndex"
        :class="[
          'rounded-2xl flex flex-col justify-between shadow-xs border transition duration-200 overflow-hidden',
          card.theme === 'dark' ? 'bg-slate-900 text-white border-transparent' : 'bg-white text-slate-700 border-gray-200',
        ]"
      >
        <!-- Optional Top/Media Image (Edge-to-Edge) -->
        <div
          v-if="card.image && card.imagePosition !== 'body'"
          class="w-full"
        >
          <img
            :src="card.image.src"
            :alt="card.image.alt || ''"
            :class="card.image.class || 'w-full h-40 object-cover'"
          />
        </div>

        <!-- Card Inner Content Wrapper (handles padding when there's a top image vs normal) -->
        <div class="flex flex-col flex-1 justify-between px-6 py-2">
          <div>
            <!-- Card Header -->
            <div class="flex items-center justify-between w-full">
              <span :class="['text-xs uppercase tracking-widest font-bold', card.theme === 'dark' ? 'text-blue-400' : 'text-slate-900']">
                {{ card.title }}
              </span>

              <!-- Optional Status Badge -->
              <span
                v-if="card.badge"
                :class="[
                  'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide',
                  card.badge.style === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : card.badge.style === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : card.badge.style === 'danger'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800',
                ]"
              >
                {{ typeof card.badge.text === "function" ? card.badge.text() : card.badge.text }}
              </span>
            </div>

            <!-- Optional Inline Body Image (If position is set to 'body') -->
            <div
              v-if="card.image && card.imagePosition === 'body'"
              class="my-3"
            >
              <img
                :src="card.image.src"
                :alt="card.image.alt || ''"
                :class="card.image.class || 'w-full h-32 object-cover rounded-lg'"
              />
            </div>

            <!-- Core Value Metric Display -->
            <div
              v-if="card.value"
              :class="['my-4 text-2xl font-bold tracking-tight text-slate-900', card.theme === 'dark' ? 'text-white' : '', card.centerText ? 'text-center w-full' : 'text-left']"
            >
              {{ typeof card.value === "function" ? card.value() : card.value }}
            </div>
          </div>

          <!-- Card Footer Actions/Description Layout -->
          <div class="w-full flex items-center justify-between mt-auto pt-2">
            <p
              v-if="card.description"
              class="text-xs text-gray-400 leading-relaxed max-w-[80%]"
            >
              {{ typeof card.description === "function" ? card.description() : card.description }}
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
                'disabled:opacity-40 disabled:cursor-not-allowed',
              ]"
            >
              {{ card.action.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  config: {
    type: Array,
    required: true,
  },
});

// Automatically balance grid columns up to a max cap of 4 per row
const getRowGridClass = (cardCount) => {
  switch (cardCount) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "md:grid-cols-2";
    case 3:
      return "md:grid-cols-3";
    case 4:
    default:
      return "md:grid-cols-2 lg:grid-cols-4";
  }
};
</script>
