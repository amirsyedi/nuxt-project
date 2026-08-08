<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Auto-imported from components/Sidebar.vue -->
    <Sidebar />
    
    <!-- 
      The lg:pl-72 class pushes the main content to the right 
      on desktop screens to make room for the 72-width sidebar 
    -->
    <main class="lg:pl-72">
      <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
        <slot />
      </div>
    </main>
  </div>
</template>