<!-- app/pages/profile.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- FIXED: Repaired modal markup syntax, tied v-model correctly, and added fallback content -->
    <MainModal
      v-model="isModalOpen"
      title="Detailed Telemetry Breakdown"
      subtitle="Detailed hardware coordinates audit mapping"
      size="2xl"
    >
      <DynamicForm
        :schema="schemaForm"
        v-model="data"
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

      <!-- Your Dynamic Form Component integrates here -->
      <DynamicForm
        :schema="schemaForm"
        v-model="data"
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
      </div>
    </MainCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserSession } from "#imports";

definePageMeta({
  middleware: "auth",
});

const { user } = useUserSession();
const isSaved = ref(false);
const isModalOpen = ref(false);

// FIXED: Added 'const' to define the arrow function, and used '.value' to mutate the ref
const openModal = () => {
  isModalOpen.value = true;
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
          fields: [{ name: "fullName", label: "Nama Penuh", type: "text", viewOnly: false }],
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
                { value: "it", label: "Teknologi Maklumat (IT)" },
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

// 2. Hydrate form inputs with fallback values from your active session user object
const data = ref({
  username: user.value?.username || "admin",
  role: "Administrator",
  fullName: user.value?.fullName || "Mohamad Amr",
  email: user.value?.email || "amr@example.com",
  department: user.value?.department || "it",
});

// 3. Handle data saving trigger event actions
const saveProfile = async () => {
  isSaved.value = false;

  console.log("Saving profile payload changes:", data.value);

  // Show quick temporary save toast feedback indicator
  await new Promise((resolve) => setTimeout(resolve, 400));
  isSaved.value = true;
};
</script>
