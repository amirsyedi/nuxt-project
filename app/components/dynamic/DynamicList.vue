<!-- components/DynamicTable.vue -->
<template>
  <div class="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden w-full">
    
    <!-- Table Header block -->
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
      <div class="flex items-center space-x-3">
        <h3 class="text-sm font-bold text-slate-900">{{ title }}</h3>
        <span class="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">
          {{ data.length }} Total Entries
        </span>
      </div>
    </div>
    
    <!-- Responsive Table Viewport -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead class="bg-gray-50 text-xs text-gray-700 uppercase font-bold border-b border-gray-100">
          <tr>
            <th 
              v-for="col in visibleColumns" 
              :key="col.key" 
              class="px-6 py-3.5 tracking-wider"
            >
              {{ col.label }}
            </th>
            <th v-if="hasVisibleActions" class="px-6 py-3.5 text-right tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-gray-100">
          <!-- Iterate over paginated rows list subset -->
          <tr 
            v-for="(row, rowIndex) in paginatedData" 
            :key="row.id || rowIndex" 
            class="hover:bg-gray-50/70 transition duration-150"
          >
            <td 
              v-for="col in visibleColumns" 
              :key="col.key" 
              class="px-6 py-4 whitespace-nowrap"
            >
              <!-- Badge Formatter Check -->
              <span 
                v-if="col.type === 'badge'"
                :class="[
                  'px-2.5 py-1 text-xs font-black rounded-lg border',
                  row[col.key] === 'Production' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                ]"
              >
                {{ row[col.key] }}
              </span>

              <!-- Regular text styling blocks -->
              <span 
                v-else
                :class="[
                  col.isBold ? 'font-bold text-slate-900' : 'text-slate-600',
                  col.isMono ? 'font-mono text-xs text-slate-400 bg-gray-50 px-1.5 py-1 rounded border border-gray-100' : ''
                ]"
              >
                {{ row[col.key] || '—' }}
              </span>
            </td>

            <!-- Dynamic Button Rows Parsing Block -->
            <td v-if="hasVisibleActions" class="px-6 py-4 whitespace-nowrap text-xs font-bold text-right">
              <div class="flex items-center justify-end gap-4">
                <template v-for="btn in actions" :key="btn.name">
                  <button 
                    v-if="!shouldHideAction(btn, row)"
                    @click="btn.handler(row)"
                    :disabled="btn.disabled && btn.disabled(row)"
                    :class="[
                      'transition cursor-pointer focus:outline-hidden disabled:opacity-40 disabled:cursor-not-allowed',
                      btn.variant === 'danger' ? 'text-rose-600 hover:text-rose-800' : '',
                      btn.variant === 'success' ? 'text-emerald-600 hover:text-emerald-800' : '',
                      btn.variant === 'primary' || !btn.variant ? 'text-blue-600 hover:text-blue-800' : ''
                    ]"
                  >
                    {{ typeof btn.label === 'function' ? btn.label(row) : btn.label }}
                  </button>
                </template>
              </div>
            </td>
          </tr>
          
          <tr v-if="data.length === 0">
            <td :colspan="visibleColumns.length + (hasVisibleActions ? 1 : 0)" class="px-6 py-16 text-center text-gray-400 text-xs tracking-wide">
              No record.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Integrated Structural Pagination Navigation Foot Control Bar -->
    <div 
      v-if="totalPages > 1"
      class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-medium"
    >
      <div>
        Showing rows <span class="font-bold text-slate-900">{{ startIndex + 1 }}</span> to 
        <span class="font-bold text-slate-900">{{ Math.min(endIndex, data.length) }}</span> of 
        <span class="font-bold text-slate-900">{{ data.length }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition select-none"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-1">
          <button
            v-for="p in totalPages"
            :key="p"
            @click="currentPage = p"
            :class="[
              'w-7 h-7 flex items-center justify-center rounded-lg border font-bold transition select-none cursor-pointer',
              currentPage === p 
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ p }}
          </button>
        </div>

        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition select-none"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'


const props = defineProps({
  title: { type: String, default: 'System Table Log' },
  schema: { type: Array, required: true },
  data: { type: Array, required: true },
  actions: { type: Array, default: () => [] },
  perPage: { type: Number, default: 5 } // New customization setting variable metric
})

const currentPage = ref(1)

// Reset viewport page back to 1 if user slices data stack array context references externally
watch(() => props.data.length, () => {
  currentPage.value = 1
})

// Calculations indicators variables
const totalPages = computed(() => Math.ceil(props.data.length / props.perPage))
const startIndex = computed(() => (currentPage.value - 1) * props.perPage)
const endIndex = computed(() => startIndex.value + props.perPage)

// Runtime dynamic slice algorithm calculations mapping array loops
const paginatedData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value)
})

const visibleColumns = computed(() => {
  return props.schema.filter(col => typeof col.hide === 'function' ? !col.hide() : !col.hide)
})

const hasVisibleActions = computed(() => {
  if (!props.actions || props.actions.length === 0) return false
  return props.actions.some(btn => btn.hide !== true)
})

const shouldHideAction = (btn, row) => {
  if (typeof btn.hide === 'function') return btn.hide(row)
  return !!btn.hide
}
</script>