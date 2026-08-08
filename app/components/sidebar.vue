<template>
  <div>
    <!-- Mobile toggle button -->
    <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700" @click="isOpen = true">
        <span class="sr-only">Open sidebar</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
    </div>

    <!-- Mobile Sidebar overlay -->
    <div v-show="isOpen" class="relative z-50 lg:hidden">
      <!-- Backdrop -->
      <transition enter-active-class="transition-opacity ease-linear duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity ease-linear duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-show="isOpen" class="fixed inset-0 bg-gray-900/80" @click="isOpen = false"></div>
      </transition>

      <transition enter-active-class="transition ease-in-out duration-300 transform" enter-from-class="-translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition ease-in-out duration-300 transform" leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
        <div v-show="isOpen" class="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-blue-600 px-6 pb-4 pt-5">
          <div class="flex items-center justify-between mb-6">
            <NuxtLink to="/" class="flex items-center">
              <!-- <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> -->
            </NuxtLink>
            <button type="button" class="-m-2.5 p-2.5 text-gray-700" @click="isOpen = false">
              <span class="sr-only">Close sidebar</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Mobile Nav -->
          <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="-mx-2 space-y-1">
                  <li v-for="item in navigation" :key="item.name">
                    <NuxtLink 
                      :to="item.href" 
                      class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      :class="[route.path === item.href ? 'bg-gray-50 text-indigo-600' : 'text-gray-200 hover:text-indigo-600 hover:bg-gray-50']"
                      @click="isOpen = false"
                    >
                      <!-- You can bind actual SVG paths here or use a library like nuxt-icon -->
                      <!-- <span class="h-6 w-6 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600" :class="{ 'border-indigo-600 text-indigo-600': route.path === item.href }">
                        {{ item.name.charAt(0) }}
                      </span> -->
                      {{ item.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </transition>
    </div>

    <!-- Desktop Sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-blue-600 px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <!-- <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> -->
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <NuxtLink 
                    :to="item.href" 
                    class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                    :class="[route.path === item.href ? 'bg-gray-50 text-indigo-600' : 'text-gray-200 hover:text-indigo-600 hover:bg-gray-50']"
                  >
                    <!-- <span class="h-6 w-6 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors" :class="{ 'border-indigo-600 text-indigo-600': route.path === item.href }">
                      {{ item.name.charAt(0) }}
                    </span> -->
                    {{ item.name }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
            <!-- Bottom Profile Section -->
            <li class="-mx-6 mt-auto">
              <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                <img class="h-8 w-8 rounded-full bg-gray-50" src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" />
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">Tom Cook</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Team', href: '/attendance' },
  { name: 'Projects', href: '/projects' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Reports', href: '/reports' },
]
</script>