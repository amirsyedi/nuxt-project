<!-- app/pages/misc/history.vue -->
<template>
  <MainSpinner
    fullScreen
    :is-loading="isLoading"
    size="53px"
    color="#3498db"
    thickness="6px"
  />
  <MainModal
    v-model="isModalOpen"
    title="User Details"
    subtitle=""
    size="2xl"
  >
    <UserData
      :prop-id-user="userId"
      :view-mode="viewMode"
      :refresh-users="refresh"
    />
  </MainModal>

  <div class="space-y-6">
    <section>
      <MainCard>
        <MainBreadcrumb />
        <DynamicList
          title="Users Record"
          :schema="myTableSchema"
          :data="myTableData"
          :actions="listActions"
          :per-page="10"
          :badge="false"
          @refresh="refresh"
          class="mt-6"
        />
      </MainCard>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import UserData from "./user-data.vue";
import { useApi } from "../../../services/users.js";

const { getUsers, deleteUser } = useApi();
const isModalOpen = ref(false);
const userId = ref(null);
const viewMode = ref("");
const myTableData = ref([]);
const isLoading = ref(false);

const getList = async () => {
  const users = await getUsers();
  myTableData.value = Array.isArray(users) ? users : users ? [users] : [];
};

const refresh = () => getList();

onMounted(getList);

const deleteData = async (id) => {
  isLoading.value = true;
  try {
    await deleteUser(id).then((res) => {
      console.log("deleteUser", res);
      isLoading.value = false;
      refresh();
    });
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};

const myTableSchema = ref([
  // { key: "id", label: "ID", isMono: true, isBold: true },
  {
    key: "ic_number",
    label: "ID",
    isMono: true,
  },
  {
    key: "full_name",
    label: "Name",
    isMono: true,
  },
  {
    key: "email",
    label: "Email",
    isMono: true,
  },
  {
    key: "department",
    label: "Department",
    isMono: true,
  },
  {
    key: "kategori_pekerja",
    label: "Category",
    isMono: true,
  },
  {
    key: "role",
    label: "Role",
    // type: "badge",
    // color: "success",
    isMono: true,
  },
]);

const listActions = [
  {
    name: "view",
    label: "Details",
    variant: "primary",
    icon: "view",
    iconOnly: true,
    handler: (row) => {
      userId.value = row.id;
      viewMode.value = "view";
      isModalOpen.value = true;
    },
  },
  {
    name: "edit",
    label: "Edit",
    variant: "success",
    icon: "edit",
    iconOnly: true,
    handler: (row) => {
      userId.value = row.id;
      viewMode.value = "";
      isModalOpen.value = true;
    },
  },
  {
    name: "delete",
    label: "Drop",
    variant: "danger",
    icon: "delete",
    iconOnly: true,
    handler: async (rowItem) => {
      // if (confirm(`Are you sure to delete data?`)) {
      await deleteData(rowItem.id);
      // }
    },
  },
];
</script>
