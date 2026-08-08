<!-- app/pages/misc/history.vue -->
<template>
  <div class="space-y-6 max-w-7xl mx-auto p-6">
    <section v-if="showList">
      <MainCard>
        <MainBreadcrumb />
        <DynamicList
          title="Paginated Local Service Logs Feed"
          :schema="myTableSchema"
          :data="myTableData"
          :actions="myTableActions"
          :per-page="5"
          :badge=false
          class="mt-6"
        />
      </MainCard>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showList = ref(true);

definePageMeta({
  middleware: "auth",
});


const myTableSchema = ref([
  { key: "id", label: "Log UUID", isMono: true, isBold: true },
  { key: "service", label: "Microservice Target Module", isMono: true },
  { key: "environment", label: "Layer Environment", type: "badge" },
]);

const myTableData = ref([
  { id: "LOG-001", service: "Authentication API Engine Controller Core", environment: "Production" },
  { id: "LOG-002", service: "Geo-Tracking Telemetry Webhook Router", environment: "Production" },
  { id: "LOG-003", service: "SQL Pool Replication Database Service Sync", environment: "Staging" },
  { id: "LOG-004", service: "CDN Cache Purge Cron Task Automation Worker", environment: "Production" },
  { id: "LOG-005", service: "SMS Validation Two-Factor Notification Gateway ", environment: "Staging" },
  { id: "LOG-006", service: "Payment Processing Microservice Webhook Engine Payment Processing Microservice Webhook Engine", environment: "Production" },
]);

const myTableActions = [
  {
    name: "view",
    label: "Details",
    variant: "primary",
    icon: 'view',
    iconOnly: true,
    handler: (row) => alert(`Selected UUID ID context reference item properties: ${row.id}`),
  },
    {
    name: "edit",
    label: "Edit",
    variant: "success",
    icon: 'edit',
    iconOnly: true,
    handler: (row) => alert(`Selected UUID ID context reference item properties: ${row.id}`),
  },
  {
    name: "delete",
    label: "Drop",
    variant: "danger",
    icon: 'delete',
    iconOnly: true,
    handler: (rowItem) => {
      if (confirm(`Drop local tracking entry record index item reference code ${rowItem.id}?`)) {
        myTableData.value = myTableData.value.filter((item) => item.id !== rowItem.id);
      }
    },
  },
];
</script>
