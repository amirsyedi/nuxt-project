<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";
import { useAuth } from "../services/auth.js";

const session = useState("auth_session", () => null);
const { logout } = useAuth();
const idleTimeoutMs = 10 * 60 * 1000;
let idleTimer;

const endIdleSession = async () => {
  if (!session.value) return;

  clearTimeout(idleTimer);
  try {
    await logout();
  } catch (error) {
    console.error("Idle logout failed:", error);
  } finally {
    session.value = null;
    await navigateTo("/login");
  }
};

const resetIdleTimer = () => {
  if (!session.value) return;

  clearTimeout(idleTimer);
  idleTimer = setTimeout(endIdleSession, idleTimeoutMs);
};

const activityEvents = ["pointerdown", "keydown", "scroll", "touchstart"];

onMounted(() => {
  activityEvents.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }));
  watch(session, resetIdleTimer, { immediate: true });
});

onBeforeUnmount(() => {
  clearTimeout(idleTimer);
  activityEvents.forEach((event) => window.removeEventListener(event, resetIdleTimer));
});
</script>
