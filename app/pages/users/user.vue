<!-- app/pages/misc/history.vue -->
<template>
  <div class="space-y-6">
    <section v-if="showList">
      <MainCard>
        <MainBreadcrumb />
        <DynamicList
          title="Senarai Pekerja"
          :schema="myTableSchema"
          :data="myTableData"
          :actions="myTableActions"
          :per-page="10"
          :badge=false
          class="mt-6"
        />
      </MainCard>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useApi } from "../../../services/users.js";

const showList = ref(true);
const { getUsers } = useApi();


const myTableSchema = ref([
  // { key: "id", label: "ID", isMono: true, isBold: true },
  { 
    key: "ic_number", 
    label: "ID", 
    isMono: true
  },
  { 
    key: "full_name", 
    label: "Name" 
  },
  { 
    key: "email", 
    label: "Email" 
  },
  { 
    key: "department", 
    label: "Department" 
  },
  { 
    key: "kategori_pekerja", 
    label: "Category" 
  },
  { 
    key: "role", 
    label: "Role", 
    type: "badge" 
  },
]);

const myTableData = ref([]);

onMounted(async () => {
  const users = await getUsers();
  myTableData.value = Array.isArray(users) ? users : users ? [users] : [];
});

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
