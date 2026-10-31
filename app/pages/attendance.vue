<!-- app/pages/attendance.vue -->
<template>
  <div class="space-y-6">
    <!-- {{ user }} -->
    <MainCard>
      <MainBreadcrumb />
      <!-- Top Action Cards Matrix Grid -->
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
            :disabled="isClockedIn || isAttendanceLoading"
            class="w-full bg-emerald-400 text-slate-900 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl text-sm font-bold transition duration-200 shadow-sm cursor-pointer"
          >
            <MainSpinner
              :is-loading="clockActionLoading === 'in'"
              size="16px"
              color="#0f172a"
              thickness="2px"
            />
            Clock In
          </button>
          <button
            @click="handleClockAction('Clock Out')"
            :disabled="!isClockedIn"
            class="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl text-sm font-bold transition duration-200 cursor-pointer"
          >
            <MainSpinner
              :is-loading="clockActionLoading === 'out'"
              size="16px"
              color="#334155"
              thickness="2px"
            />
            Clock Out
          </button>
        </div>
      </div>

      <!-- Attendance Historical Audit Log Feed -->
      <!-- <DynamicList
        title="Attendance Records History"
        :schema="tableSchema"
        :data="attendanceLogs"
        :per-page="5"
        class="mt-6"
      /> -->
      <DynamicList
        title="Users Record"
        :schema="myTableSchema"
        :data="myTableData"
        :actions="listActions"
        :per-page="5"
        :badge="false"
        @refresh="refresh"
        class="mt-6"
      />
    </MainCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const currentTimeString = ref("--:--:--");
const currentDateString = ref("Loading date...");
const isClockedIn = ref(false);
const isAttendanceLoading = ref(true);
const clockActionLoading = ref("");
import { useApi } from "../../../services/attendance.js";

const { 
  getAttendanceByUserId,
  attendanceClockIn,
  attendanceClockOut
} = useApi();

const session = useState("auth_session", () => null);
const geoStatus = ref("checking");
const geoMessage = ref("Connecting to satellite perimeter...");
let timerId = null;
let userCoordinates = { lat: 0, lng: 0 };
let currentDistanceCalculated = "—";

// Table Blueprint Structural Configurations
const myTableSchema = ref([
  { 
    key: "activity", 
    label: "Activity", 
    isMono: true 
  },
  { 
    key: "clock_in_at", 
    label: "Clock In", 
    type: "datetime-local", 
    isMono: true 
  },
  { 
    key: "clock_out_at", 
    label: "Clock Out", 
    type: "datetime-local", 
    isMono: true 
  },
]);

const getList = async () => {
  isAttendanceLoading.value = true;
  try {
    const records = await getAttendanceByUserId(session.value?.user?.id);
    myTableData.value = Array.isArray(records) ? records : records ? [records] : [];
    isClockedIn.value = myTableData.value.some(
      (record) => record.clock_in_at && !record.clock_out_at,
    );
  } finally {
    isAttendanceLoading.value = false;
  }
};
const myTableData = ref([]);

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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
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

const handleClockAction = async (actionType) => {
  const userId = session.value?.user?.id;
  if (!userId || clockActionLoading.value) return;

  clockActionLoading.value = actionType === "Clock In" ? "in" : "out";
  try {
    const result = actionType === "Clock In"
      ? await attendanceClockIn(userId)
      : await attendanceClockOut(userId);

    if (result) {
      isClockedIn.value = actionType === "Clock In";
      await getList();
    }
  } catch (error) {
    console.error("Failed to update attendance:", error);
  }

  clockActionLoading.value = "";
};

const refresh = () => getList();

onMounted(() => {
  updateClock();
  timerId = setInterval(updateClock, 1000);
  verifyLocation();
  getList();
});

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
});
</script>