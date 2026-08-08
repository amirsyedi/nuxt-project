<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div class="flex items-center space-x-8">
        <div class="flex items-center space-x-3">
          <span class="text-xl font-bold text-blue-600 tracking-tight">MyApp</span>
        </div>

        <!-- Navigation Sub-Menu Links -->
        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="text-sm font-medium px-3 py-2 rounded-md transition"
            active-class="bg-blue-50 text-blue-700 font-semibold"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/profile"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition"
            active-class="bg-blue-50 text-blue-700 font-semibold"
          >
            Profile
          </NuxtLink>
          <NuxtLink
            to="/attendance"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition"
            active-class="bg-blue-50 text-blue-700 font-semibold"
          >
            Attendance
          </NuxtLink>

          <!-- Misc Dropdown Container -->
          <div class="relative" ref="miscDropdownRef">
            <button
              @click="isMiscOpen = !isMiscOpen"
              class="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition flex items-center space-x-1.5 focus:outline-none cursor-pointer"
              :class="{ 'bg-gray-50 text-gray-900': isMiscOpen }"
            >
              <span>Misc</span>
              <!-- Chevron Icon -->
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2.5" 
                stroke="currentColor" 
                class="w-3 h-3 transition-transform duration-200"
                :class="{ 'rotate-180': isMiscOpen }"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            <!-- Dropdown Menu items -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="isMiscOpen" 
                class="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 origin-top-left"
              >
                <NuxtLink
                  to="/misc/sample"
                  @click="isMiscOpen = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  active-class="bg-blue-50 text-blue-700 font-medium"
                >
                  Leave
                </NuxtLink>
                <NuxtLink
                  to="/misc/sample2"
                  @click="isMiscOpen = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  active-class="bg-blue-50 text-blue-700 font-medium"
                >
                  Claim
                </NuxtLink>
                <NuxtLink
                  to="/misc/support"
                  @click="isMiscOpen = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  active-class="bg-blue-50 text-blue-700 font-medium"
                >
                  Whatever
                </NuxtLink>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <span class="text-sm font-medium text-gray-700"> Hi, {{ user?.fullName || "User" }} </span>

        <button
          @click="handleLogout"
          class="bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 font-medium py-1.5 px-3.5 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserSession } from "#imports";

const { user, clear } = useUserSession();

const isMiscOpen = ref(false);
const miscDropdownRef = ref(null);

const handleLogout = async () => {
  await clear();
  navigateTo("/login");
};

// Close dropdown automatically when clicking anywhere outside it
const handleClickOutside = (event) => {
  if (miscDropdownRef.value && !miscDropdownRef.value.contains(event.target)) {
    isMiscOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});