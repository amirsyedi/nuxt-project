<!-- app/pages/attendance.vue -->
<template>
  <div class="space-y-6 max-w-6xl mx-auto p-4 lg:p-6">
    <MainCard>
      <MainBreadcrumb />
      <!-- Top Action Cards Matrix Grid (Using custom slots for explicit interactions) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card 1: Live Running Sync Clock System -->
        <div class="bg-blue-600 text-white rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-sm">
          <span class="text-xs uppercase tracking-widest text-white-400 font-bold">Current Time</span>
          <div class="my-4 font-mono text-4xl font-bold tracking-tight">
            {{ currentTimeString }}
          </div>
          <span class="text-sm text-slate-200">{{ currentDateString }}</span>
        </div>

        <!-- Card 2: Interactive Geolocation Tracking Diagnostics -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-slate-900">GPS Location Status</span>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase',
                geoStatus === 'verified' || geoStatus === 'outside' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
              ]"
            >
              {{ geoStatus === "checking" ? "Checking" : "Detected" }}
            </span>
          </div>
          <p class="text-xs text-gray-500 my-2 leading-relaxed">
            {{ geoMessage }}
          </p>
          <button
            @click="verifyLocation"
            class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline text-left cursor-pointer transition focus:outline-none"
          >
            Refresh GPS Location
          </button>
        </div>

        <!-- Card 3: Contextual Flow Trigger Controls -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center gap-3 shadow-sm">
          <button
            @click="handleClockAction('Clock In')"
            :disabled="isClockedIn"
            class="w-full bg-emerald-400 text-slate-900 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl text-sm font-bold transition duration-200 shadow-sm cursor-pointer"
          >
            Clock In
          </button>
          <button
            @click="handleClockAction('Clock Out')"
            :disabled="!isClockedIn"
            class="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl text-sm font-bold transition duration-200 cursor-pointer"
          >
            Clock Out
          </button>
        </div>
      </div>

      <!-- Attendance Historical Audit Log Feed (Refactored to Dynamic Reusable Table) -->
      <DynamicList
        title="Attendance Records History"
        :schema="tableSchema"
        :data="attendanceLogs"
        :per-page="5"
        class="mt-6"
      />
    </MainCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// Basic layout routing protections configuration block
definePageMeta({
  middleware: "auth",
});

const currentTimeString = ref("--:--:--");
const currentDateString = ref("Loading date...");
const isClockedIn = ref(false);

// Active local telemetry array feeding live markup views
const attendanceLogs = ref([]);

const geoStatus = ref("checking");
const geoMessage = ref("Connecting to satellite perimeter...");
let timerId = null;
let userCoordinates = { lat: 0, lng: 0 };
let currentDistanceCalculated = "—";

// Table Blueprint Structural Configurations
const tableSchema = ref([
  { key: "type", label: "Activity Type", isBold: true },
  { key: "date", label: "Log Date" },
  { key: "time", label: "Log Time" },
  { key: "coords", label: "GPS Coordinates", isMono: true },
  { key: "distance", label: "Distance From Office" },
]);

// Primary Office Geolocation: Property Management Division (BPH), Block B3, Putrajaya
const OFFICE_COORDS = { lat: 2.9366, lng: 101.6902 };
const MAX_ALLOWED_RADIUS_KM = 50;

const updateClock = () => {
  const now = new Date();
  currentTimeString.value = now.toLocaleTimeString("en-US");
  currentDateString.value = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Haversine calculation strategy layout mapping distance properties
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius constant value
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const verifyLocation = () => {
  geoStatus.value = "checking";
  geoMessage.value = "Connecting to satellite perimeter...";

  if (!navigator.geolocation) {
    geoStatus.value = "failed";
    geoMessage.value = "Geolocation is not supported by your browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userCoordinates.lat = position.coords.latitude;
      userCoordinates.lng = position.coords.longitude;
      const dist = calculateDistance(userCoordinates.lat, userCoordinates.lng, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
      currentDistanceCalculated = `${dist.toFixed(2)} km`;

      if (dist <= MAX_ALLOWED_RADIUS_KM) {
        geoStatus.value = "verified";
        geoMessage.value = `Location verified within geofence radius: Approximately ${currentDistanceCalculated} away.`;
      } else {
        geoStatus.value = "outside";
        geoMessage.value = `Location detected outside the main radius (Distance: ${currentDistanceCalculated}).`;
      }
    },
    () => {
      geoStatus.value = "failed";
      currentDistanceCalculated = "No GPS signal";
      geoMessage.value = "Failed to access device GPS. You can still record attendance without distance tracking data.";
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
};

const handleClockAction = (actionType) => {
  isClockedIn.value = actionType === "Clock In";
  const now = new Date();

  attendanceLogs.value.unshift({
    type: actionType,
    date: now.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }),
    time: now.toLocaleTimeString("en-US"),
    coords: userCoordinates.lat && userCoordinates.lng ? `${userCoordinates.lat.toFixed(4)}, ${userCoordinates.lng.toFixed(4)}` : "Coordinate Error",
    distance: currentDistanceCalculated,
  });
};

onMounted(() => {
  updateClock();
  timerId = setInterval(updateClock, 1000);
  verifyLocation();
});

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
});
</script>
