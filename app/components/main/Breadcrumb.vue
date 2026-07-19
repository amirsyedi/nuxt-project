<!-- app/components/main/Breadcrumb.vue -->
<template>
  <nav aria-label="Breadcrumb" class="flex mb-4">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 text-xs font-medium text-gray-500">
      
      <!-- Home Root Link -->
      <li class="inline-flex items-center">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150"
        >
          <svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
          </svg>
          Home
        </NuxtLink>
      </li>

      <!-- Dynamic Segments Loop -->
      <li v-for="(crumb, index) in crumbs" :key="crumb.path" class="flex items-center">
        <svg class="w-3 h-3 text-gray-400 mx-1 md:mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>

        <!-- Condition 1: Intermediary dropdown wrapper folder paths (DISABLED) -->
        <span 
          v-if="crumb.isDisabled && index < crumbs.length - 1"
          class="text-gray-400 cursor-not-allowed select-none capitalize"
          title="Group Category"
        >
          {{ crumb.label }}
        </span>

        <!-- Condition 2: Standard clickable history trail link -->
        <NuxtLink 
          v-else-if="index < crumbs.length - 1"
          :to="crumb.path" 
          class="text-gray-700 hover:text-blue-600 transition-colors duration-150 capitalize"
        >
          {{ crumb.label }}
        </NuxtLink>

        <!-- Condition 3: Current active leaf page view -->
        <span 
          v-else 
          class="text-gray-400 font-semibold capitalize truncate max-w-[160px] sm:max-w-xs"
          aria-current="page"
        >
          {{ crumb.label }}
        </span>
      </li>

    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'

const route = useRoute()

// Add directory slug names here that act solely as dropdown categories with no real index page file
const DISABLED_PARENT_SLUGS = ['misc', 'settings', 'reports', 'dropdown']

const crumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p)
  
  return pathArray.map((path, idx) => {
    const fullPath = '/' + pathArray.slice(0, idx + 1).join('/')
    const formattedLabel = path.replace(/-/g, ' ').replace(/_/g, ' ')
    
    // Check if this path segment belongs to a pure grouping placeholder layout folder
    const isDisabled = DISABLED_PARENT_SLUGS.includes(path.toLowerCase())

    return {
      label: formattedLabel,
      path: fullPath,
      isDisabled: isDisabled
    }
  })
})
</script>