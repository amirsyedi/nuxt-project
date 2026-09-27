<!-- app/pages/profile.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- <MainSpinner fullScreen v-if='isLoading'/> -->

    <MainSpinner fullScreen :is-loading="isLoading" size="53px" color="#3498db" thickness="6px" />
    <!-- FIXED: Repaired modal markup syntax, tied v-model correctly, and added fallback content -->
    <MainModal
      v-model="isModalOpen"
      title="Detailed Telemetry Breakdown"
      subtitle="Detailed hardware coordinates audit mapping"
      size="2xl"
    >
      <DynamicForm
        :schema="schemaForm"
        :form-raw-data="profileData"
        v-model="profileData"
      >
      </DynamicForm>
    </MainModal>

    <!-- Main Card Content Framing Grid -->
    <MainCard>
      <!-- FIXED: Changed to your customized folder structure naming convention component -->
      <MainBreadcrumb />

      <div
        v-if="isSaved"
        class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium mb-4"
      >
        Profil berjaya dikemaskini!
      </div>

      <div
        v-if="errorMessage"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {{ errorMessage }}
      </div>

      <!-- Your Dynamic Form Component integrates here -->
      <DynamicForm
        :schema="schemaForm"
        :form-raw-data="profileData"
        v-model="profileData"
        @form-submit="saveProfile"
      />

      <div class="flex justify-end mt-4">
        <button
          type="button"
          @click="saveProfile"
          class="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition shadow-sm mx-1 cursor-pointer"
        >
          Simpan Profil
        </button>
        <button
          type="button"
          @click="openModal"
          class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-6 rounded-lg text-sm transition shadow-sm mx-1 cursor-pointer"
        >
          Modal
        </button>
        <button
          type="button"
          @click="testSpinner"
          class="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition shadow-sm mx-1 cursor-pointer"
        >
          Spinner
        </button>
      </div>
    </MainCard>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useApi } from "../../services/users.js";

const { getUsers, createUser, updateUser } = useApi();
const isSaved = ref(false);
const isModalOpen = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

// FIXED: Added 'const' to define the arrow function, and used '.value' to mutate the ref
const openModal = () => {
  isModalOpen.value = true;
};

const testSpinner = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 10000);
};

// 1. Map out your custom input schema configuration block
const schemaForm = {
  title: "Maklumat Profil Pengguna",
  fieldSets: [
    {
      legend: "Sistem Akaun (View-Only)",
      colGroups: [
        {
          colwidth: 6,
          fields: [{ name: "username", label: "Nama Pengguna (Username)", type: "text", viewOnly: true }],
        },
        {
          colwidth: 6,
          fields: [{ name: "role", label: "Peranan Akses (Role)", type: "text", viewOnly: true }],
        },
      ],
    },
    {
      legend: "Butiran Peribadi",
      colGroups: [
        {
          colwidth: 12,
          fields: [{ name: "full_name", label: "Nama Penuh", type: "text", viewOnly: false }],
        },
        {
          colwidth: 6,
          fields: [{ name: "email", label: "Alamat Emel", type: "email", viewOnly: false }],
        },
        {
          colwidth: 6,
          fields: [
            {
              name: "department",
              label: "Bahagian / Jabatan",
              type: "select",
              viewOnly: false,
              options: [
                { value: "IT", label: "Teknologi Maklumat (IT)" },
                { value: "hr", label: "Sumber Manusia (HR)" },
                { value: "finance", label: "Kewangan" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const profileData = ref({
  id: null,
  username: "Guest",
  role: "User",
  full_name: "",
  email: "",
  department: "",
});

const loadProfile = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const users = await getUsers();
    const user = Array.isArray(users) ? users[0] : users;
    console.log('Loaded user:', user);
    if (user) {
      Object.assign(profileData.value, user);
    }
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || error.message || "Gagal memuatkan profil.";
  } finally {
    isLoading.value = false;
  }
};

const saveProfile = async () => {
  isSaved.value = false;
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const savedUser = profileData.value.id
      ? await updateUser(profileData.value.id, profileData.value)
      : await createUser(profileData.value);

    if (savedUser && typeof savedUser === "object") {
      Object.assign(profileData.value, savedUser);
    }
    isSaved.value = true;
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || error.message || "Gagal menyimpan profil.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadProfile);
</script>
