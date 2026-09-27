<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="flex items-center gap-6 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <NuxtLink to="/" class="text-xl font-bold text-blue-600">MyApp</NuxtLink>
      <NuxtLink to="/" class="text-sm font-medium text-gray-700">Dashboard</NuxtLink>
      <NuxtLink to="/profile" class="text-sm font-medium text-gray-700">Profile</NuxtLink>
      <NuxtLink to="/attendance" class="text-sm font-medium text-gray-700">Attendance</NuxtLink>
    </nav>
    <main class="mx-auto max-w-7xl p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>