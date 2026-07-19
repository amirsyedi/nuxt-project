<template>
  <div class="space-y-6">
    <!-- Dashboard greeting card -->
    <div class="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-900">Application Feed Overview</h1>
      <p class="text-gray-500 mt-1">Everything is up to date. You are securely authenticated.</p>
    </div>

    <!-- Example placeholder analytics row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-white border p-5 rounded-xl shadow-xs">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Total Statuses</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">Active</p>
      </div>
      <div class="bg-white border p-5 rounded-xl shadow-xs">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">User Mode</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">Administrator</p>
      </div>
      <div class="bg-white border p-5 rounded-xl shadow-xs">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Network Sync</p>
        <p class="text-2xl font-bold text-green-600 mt-1">Healthy</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserSession } from '#imports'

// Hook up the auth middleware to protect this page
definePageMeta({
  middleware: 'auth'
})

const { user, clear } = useUserSession()

const handleLogout = async () => {
  await clear()        // Secure backend logout provided by nuxt-auth-utils
  navigateTo('/login') // Redirect to login page URL
}
</script>