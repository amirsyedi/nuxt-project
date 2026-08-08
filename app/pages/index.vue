<template>
  <div class="space-y-6">
    <MainCard>
      <MainBreadcrumb />
      <div class="mt-2">
        <DynamicCard :config="schemaCard" />
      </div>

      <div class="mt-2">
        <DynamicList
          title="Upcoming Event"
          :schema="myTableSchema"
          :data="myTableData"
          @action="onTableActionTriggered"
          :per-page="5"
          :p="1"
        />
      </div>
    </MainCard>
  </div>
</template>

<script setup>
import { useUserSession } from "#imports";

// Hook up the auth middleware to protect this page
definePageMeta({
  middleware: "auth",
});

const { user, clear } = useUserSession();

const handleLogout = async () => {
  await clear(); // Secure backend logout provided by nuxt-auth-utils
  navigateTo("/login"); // Redirect to login page URL
};

const schemaCard = computed(() => [
  [
    {
      title: "",
      // value: 'John Doe',
      imagePosition: "body", // Places it inside the body content with padding/rounding
      image: {
        src: "/background.jpg",
        alt: "Avatar",
        class: "w-32 h-32 rounded-md object-cover my-1",
      },
      // theme: "dark",
    },
    {
      title: "Anual Leave",
      value: "21 Days",
      // theme: "dark",
      // description: "test",
      badge: { text: "14 Days left", style: "success" },
      action: {
        type: "primary",
        label: "Anual Leave",
        // handler: "",
      },
    },
    {
      title: "Emergency Leave",
      value: "10 Days",
      badge: { text: "5 Days left", style: "warning" },
      action: {
        type: "primary",
        label: "Emergency Leave",
        // handler: "",
      },
    },
  ],
  [
    // {
    //   title: "TEST",
    //   value: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
    //   description: "test",
    //   // badge: { text: "Active", style: "success" },
    // },
  ],
]);

// Schema configuration JSON defining layout behavior mapping rules
const myTableSchema = ref([
  { key: "id", label: "Log UUID", isMono: true },
  { key: "service", label: "Service Microheader Title Name", isBold: true },
  { key: "environment", label: "Env Status Namespace", type: "badge" },
]);

// Live state data payload tracking array
const myTableData = ref([
  { id: "LOG-1002", service: "Authentication Endpoint Gateway Controller API Router", environment: "Production" },
  { id: "LOG-7740", service: "Dynamic Content Management Engine Pool Core", environment: "Staging" },
]);

// Centralized Action interceptor event catcher callback function logic
const onTableActionTriggered = (event) => {
  const { type, row } = event;
  console.log(`Action caught from child component event pipeline: [${type.toUpperCase()}] on target ID:`, row.id);

  if (type === "delete") {
    myTableData.value = myTableData.value.filter((item) => item.id !== row.id);
  } else {
    alert(`Triggered action pipeline loop execution request [${type.toUpperCase()}] for row target identifier ID reference value: ${row.id}`);
  }
};
</script>
