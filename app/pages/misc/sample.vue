<!-- app/pages/misc/history.vue -->
<template>
  <div class="space-y-8 max-w-7xl mx-auto p-4 lg:p-6">
    <MainCard>
      <MainBreadcrumb />
      <!-- 1. Custom Reusable Cards Component -->
      <DynamicCard :config="schemaCard" />

      <!-- 2. Custom Reusable Table List Component -->
      <DynamicList
        title="Record"
        :schema="myTableSchema"
        :data="myTableData"
        @action="onTableActionTriggered"
        class="mt-6"
      />
    </MainCard>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  middleware: "auth",
});

const counter = ref(10);

const schemaCard = computed(() => [
  [
    {
      title: "Card A124",
      value: "1,240",
      // theme: "dark",
      description: "test"
      // badge: { text: "Active", style: "success" },
    },
    {
      title: "Card 1245",
      value: "$4,500",
      description: "Monthly recurring revenue",
    },
  ],
  [
    {
      title: "TEST",
      value: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
      description: "test"
      // badge: { text: "Active", style: "success" },
    },
  ]
]);

const myCardsJson = computed(() => [
  { title: "Anual Leave", value: "356 Days", badge: { text: "Ok", style: "success" } },
  { title: "System Engine", value: "Active", theme: "light", badge: { text: "Online", style: "success" } },
  { title: "System Engine", value: "Active", theme: "light", badge: { text: "Online", style: "success" } },
  { title: "Pulse Packets", value: () => `${counter.value} items`, theme: "light", action: { label: "Add", type: "link", handler: () => counter.value++ } },
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
