<template>
  <div>
    <!-- Mobile toggle button -->
    <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
      <button
        type="button"
        class="-m-2.5 p-2.5 text-gray-700"
        @click="isOpen = true"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
    </div>

    <!-- Mobile Sidebar overlay -->
    <div
      v-show="isOpen"
      class="relative z-50 lg:hidden"
    >
      <!-- Backdrop -->
      <transition
        enter-active-class="transition-opacity ease-linear duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="isOpen"
          class="fixed inset-0 bg-gray-900/80"
          @click="isOpen = false"
        ></div>
      </transition>

      <transition
        enter-active-class="transition ease-in-out duration-300 transform"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in-out duration-300 transform"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div
          v-show="isOpen"
          class="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-blue-600 px-6 pb-4 pt-5"
        >
          <div class="flex items-center justify-between mb-6">
            <NuxtLink
              to="/"
              class="flex items-center"
            >
              <!-- <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> -->
            </NuxtLink>
            <button
              type="button"
              class="-m-2.5 p-2.5 text-gray-700"
              @click="isOpen = false"
            >
              <span class="sr-only">Close sidebar</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <!-- Mobile Nav -->
          <nav class="flex flex-1 flex-col">
            <ul
              role="list"
              class="flex flex-1 flex-col gap-y-7"
            >
              <li>
                <ul
                  role="list"
                  class="-mx-2 space-y-1"
                >
                  <li
                    v-for="item in navigation"
                    :key="item.name"
                  >
                    <NuxtLink
                      :to="item.href"
                      class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      :class="[route.path === item.href ? 'bg-gray-50 text-zinc-900' : 'text-gray-200 hover:text-zinc-900 hover:bg-gray-50']"
                      @click="isOpen = false"
                    >
                      <!-- You can bind actual SVG paths here or use a library like nuxt-icon -->
                      <!-- <span class="h-6 w-6 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-zinc-900" :class="{ 'border-indigo-600 text-zinc-900': route.path === item.href }">
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
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-zinc-900 px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <span class="text-gray-200 max-w-[250px] truncate inline-block align-bottom"> Welcome, {{ user?.fullName }} </span>
          <!-- <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> -->
        </div>
        <nav class="flex flex-1 flex-col">
          <ul
            role="list"
            class="flex flex-1 flex-col gap-y-7"
          >
            <li>
              <ul
                role="list"
                class="-mx-2 space-y-1"
              >
                <li
                  v-for="item in navigation"
                  :key="item.name"
                >
                  <NuxtLink
                    :to="item.href"
                    class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                    :class="[route.path === item.href ? 'bg-gray-50 text-zinc-900' : 'text-gray-200 hover:text-zinc-900 hover:bg-gray-50']"
                  >
                    <!-- <span class="h-6 w-6 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-zinc-900 transition-colors" :class="{ 'border-indigo-600 text-zinc-900': route.path === item.href }">
                      {{ item.name.charAt(0) }}
                    </span> -->
                    {{ item.name }}
                  </NuxtLink>
                </li>
              </ul>
            </li>

            <!-- Bottom Profile Section -->
            <li class="mt-auto relative">
              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-show="isProfileOpen"
                  class="absolute bottom-full left-0 z-10 w-full mb-2"
                >
                  <div class="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div class="py-1">
                      <NuxtLink
                        to="/profile"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-zinc-900 transition-colors"
                        @click="isProfileOpen = false"
                      >
                        Profile
                      </NuxtLink>
                      <button
                        @click="handleLogout"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-zinc-900 transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- Profile Toggle Button (Now styled like the dropdown) -->
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="group flex w-full items-center gap-x-4 px-4 py-3 text-sm font-semibold leading-6 text-indigo-500 bg-zinc-900 rounded-md shadow-sm ring-1 ring-black ring-opacity-5 hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <!-- <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 text-white font-bold text-xs"> US </span> -->
                <span class="sr-only">Your profile</span>
                <span
                  aria-hidden="true"
                  class="text-gray-200 font-bold uppercase tracking-wide group-hover:text-zinc-900 transition-colors"
                  >Dev Admin</span
                >
                <!-- Chevron Icon to indicate dropdown -->
                <svg
                  class="ml-auto h-4 w-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isProfileOpen }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUserSession } from "#imports";

const { user, clear } = useUserSession();

const route = useRoute();
const isOpen = ref(false);

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Attendance", href: "/attendance" },
  { name: "SAMPLE", href: "/misc/sample2" },
  // { name: "Calendar", href: "/calendar" },
  // { name: "Reports", href: "/reports" },
];

// Add this under your existing refs
const isProfileOpen = ref(false);

const handleLogout = async () => {
  await clear();
  navigateTo("/login");
  isProfileOpen.value = false;
};
</script>
