<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
      
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 italic font-mono">WELCOME</h2>
        <p class="mt-2 text-sm text-gray-600">Lebih baik menangis dalam kereta mewah daripada menangis di dalam pondok.</p>
      </div>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <!-- Updated Label and Placeholder to reflect "Username or Email" functionality -->
          <label for="identifier" class="block text-sm font-medium text-gray-700">Username or Email</label>
          <input
            id="identifier"
            v-model="identifier"
            type="text"
            required
            class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="admin or admin@sistem.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="password123"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-500 disabled:opacity-50"
        >
          {{ isLoading ? 'Checking...' : 'Login' }}
        </button>
      </form>
      
    </div>
  </div>
</template>

<!-- app/pages/login.vue -->
<script setup>
import { ref } from 'vue'
import { useUserSession } from '#imports'

definePageMeta({
  layout: false // This blocks the default application header layout from showing up here!
})

// Extract the 'fetch' method and rename it so it doesn't conflict with global $fetch
const { loggedIn, fetch: fetchUserSession } = useUserSession()

if (loggedIn.value) {
  navigateTo('/')
}

// Renamed state variable from 'username' to 'identifier'
const identifier = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // 1. Updated URL path and passed the 'identifier' field required by your login API route
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { 
        identifier: identifier.value, 
        password: password.value 
      }
    })

    // 2. Force the client-side to fetch the new session from the cookie
    await fetchUserSession()

    // 3. Redirect safely to your landing layout
    navigateTo('/')
  } catch (error) {
    // Falls back gracefully if your h3 instance sends custom error details back down the pipe
    errorMessage.value = error.data?.statusMessage || error.data?.message || 'Authentication failed.'
  } finally {
    isLoading.value = false
  }
}
</script>