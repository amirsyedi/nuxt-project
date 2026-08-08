<template>
  <div class="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden w-full">
    
    <!-- Table Header block -->
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
      <div class="flex items-center space-x-3">
        <h3 class="text-sm font-bold text-slate-900">{{ title }}</h3>
        <span class="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full" v-if="badge">
          {{ data.length }} Total Entries
        </span>
      </div>
    </div>
    
    <!-- Responsive Table Viewport -->
    <div class="w-full overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500 table-auto">
        <thead class="bg-gray-50 text-xs text-gray-700 uppercase font-bold border-b border-gray-100">
          <tr class="bg-gray-200">
            <!-- Auto-Increment Number Column -->
            <th class="px-4 py-3.5 tracking-wider text-center w-12">
              No.
            </th>
            
            <!-- Dynamic Columns with JSON width & alignment support -->
            <th 
              v-for="col in visibleColumns" 
              :key="col.key" 
              class="px-6 py-3.5 tracking-wider whitespace-nowrap"
              :class="getAlignClass(col.align)"
              :style="col.width ? { width: col.width, minWidth: col.width } : {}"
            >
              {{ col.label }}
            </th>

            <!-- Actions Header (Centered by Default) -->
            <th v-if="hasVisibleActions" class="px-6 py-3.5 text-center tracking-wider w-36 whitespace-nowrap">
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
            <!-- Auto Increment Row Number -->
            <td class="px-4 py-4 text-center font-mono text-xs font-bold text-slate-400">
              {{ startIndex + rowIndex + 1 }}
            </td>

            <!-- Content Cells with JSON width & alignment support -->
            <td 
              v-for="col in visibleColumns" 
              :key="col.key" 
              class="px-6 py-4 break-words"
              :class="getAlignClass(col.align)"
              :style="col.width ? { width: col.width, minWidth: col.width } : {}"
            >
              <!-- Badge Formatter Check -->
              <span 
                v-if="col.type === 'badge'"
                :class="[
                  'inline-block px-2.5 py-1 text-xs font-black rounded-lg border whitespace-nowrap',
                  row[col.key] === 'Production' || row[col.key] === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  row[col.key] === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                  row[col.key] === 'danger' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                  'bg-blue-50 text-blue-700 border-blue-100'
                ]"
              >
                {{ row[col.key] }}
              </span>

              <!-- Regular text styling blocks -->
              <span 
                v-else
                :class="[
                  col.isBold ? 'font-bold text-slate-900' : 'text-slate-600',
                  col.isMono ? 'inline-block font-mono text-xs text-slate-400 bg-gray-50 px-1.5 py-1 rounded border border-gray-100' : ''
                ]"
              >
                {{ row[col.key] || '—' }}
              </span>
            </td>

            <!-- Dynamic Button Actions Cell (Centered by Default) -->
            <td v-if="hasVisibleActions" class="px-6 py-4 text-xs font-bold text-center align-middle whitespace-nowrap">
              <div class="flex items-center justify-center gap-3">
                <template v-for="btn in actions" :key="btn.name">
                  <button 
                    v-if="!shouldHideAction(btn, row)"
                    @click="btn.handler(row)"
                    :disabled="btn.disabled && btn.disabled(row)"
                    :title="typeof btn.label === 'function' ? btn.label(row) : btn.label"
                    :class="[
                      'transition cursor-pointer focus:outline-hidden disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5',
                      btn.variant === 'danger' ? 'text-rose-600 hover:text-rose-800' : '',
                      btn.variant === 'success' ? 'text-emerald-600 hover:text-emerald-800' : '',
                      btn.variant === 'primary' || !btn.variant ? 'text-blue-600 hover:text-blue-800' : ''
                    ]"
                  >
                    <!-- Icon Rendering (Built-in keywords or custom SVG string) -->
                    <span v-if="btn.icon" class="inline-block">
                      <!-- Preset: Edit / Pencil -->
                      <svg v-if="btn.icon === 'edit'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487zm0 0L19.5 7.125" />
                      </svg>
                      <!-- Preset: Delete / Trash -->
                      <svg v-else-if="btn.icon === 'delete'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      <!-- Preset: View / Eye -->
                      <svg v-else-if="btn.icon === 'view'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>

                    <!-- Label Text (Shown unless iconOnly flag is true) -->
                    <span v-if="!btn.iconOnly">
                      {{ typeof btn.label === 'function' ? btn.label(row) : btn.label }}
                    </span>
                  </button>
                </template>
              </div>
            </td>
          </tr>
          
          <tr v-if="data.length === 0">
            <td :colspan="visibleColumns.length + 1 + (hasVisibleActions ? 1 : 0)" class="px-6 py-16 text-center text-gray-400 text-xs tracking-wide">
              No record.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Integrated Structural Pagination Navigation Foot Control Bar (Always Visible) -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-medium">
      <div>
        Showing rows <span class="font-bold text-slate-900">{{ data.length > 0 ? startIndex + 1 : 0 }}</span> to 
        <span class="font-bold text-slate-900">{{ Math.min(endIndex, data.length) }}</span> of 
        <span class="font-bold text-slate-900">{{ data.length }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1 || totalPages === 0"
          class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition select-none"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-1" v-if="totalPages > 0">
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
          :disabled="currentPage === totalPages || totalPages === 0"
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
  perPage: { type: Number, default: 5 },
  badge: {type: Boolean, default: false }
})

const currentPage = ref(1)

watch(() => props.data.length, () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(props.data.length / props.perPage) || 1)

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

const startIndex = computed(() => (currentPage.value - 1) * props.perPage)
const endIndex = computed(() => startIndex.value + props.perPage)

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

const getAlignClass = (align) => {
  switch (align) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    case 'left':
    default:
      return 'text-left'
  }
}
</script>