<!-- app/pages/profile.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- <MainSpinner fullScreen v-if='isLoading'/> -->

    <MainSpinner
      fullScreen
      :is-loading="isLoading"
      size="53px"
      color="#3498db"
      thickness="6px"
    />
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

      <!-- <div
        v-if="isSaved"
        class="bg-emerald-300 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium mb-4"
      >
        Profil berjaya dikemaskini!
      </div>

      <div
        v-if="errorMessage"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {{ errorMessage }}
      </div> -->

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
          class="bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition shadow-sm mx-1 cursor-pointer"
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
        <!-- <button
          type="button"
          @click="backToList"
          class="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition shadow-sm mx-1 cursor-pointer"
        >
          Kembali
        </button> -->
      </div>
    </MainCard>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useApi } from "../../services/users.js";

const { $swal } = useNuxtApp();
const { 
  getUserById, 
  createUser, 
  updateUser 
} = useApi();
const isSaved = ref(false);
const isModalOpen = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

// FIXED: Added 'const' to define the arrow function, and used '.value' to mutate the ref
const openModal = () => {
  isModalOpen.value = true;
};

const profileData = ref({
  id: null,
  username: null,
  role: null,
  full_name: null,
  email: null,
  department: null,
  gajiPekerja: 0
});

const loadProfile = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  await getUserById(1).then(user => {
    isLoading.value = false;
    if (user) {
      Object.assign(profileData.value, user);
    }
  }).catch(error => {
    errorMessage.value = error.data?.statusMessage || error.message || "Gagal memuatkan profil.";
    isLoading.value = false;
  })
};

const saveProfile = async () => {
  if (await $swal.confirm("Adakah anda pasti ingin menyimpan profil ini?", "Sahkan")) {
    isLoading.value = true;
    await updateUser(profileData.value.id, profileData.value).then((response) => {
      isLoading.value = false;
      Object.assign(profileData.value, response);
      console.log("response",response);
      nextTick(() => {
        $swal.success("Profil berjaya dikemaskini!", "Berjaya");  
      }); 
    }).catch(error => {
      isLoading.value = false;
      $swal.danger(error.data?.statusMessage || error.message || "Gagal menyimpan profil.", "Gagal menyimpan");
    });
  }
 
  
  // try {
  //   const savedUser = profileData.value.id ? await updateUser(profileData.value.id, profileData.value) : await createUser(profileData.value);

  //   if (savedUser && typeof savedUser === "object") {
  //     Object.assign(profileData.value, savedUser);
  //   }
  //   isSaved.value = true;
  //   await $swal.success("Profil berjaya dikemaskini!", "Berjaya");
  //   setTimeout(() => {
  //     isSaved.value = false;
  //   }, 3000);
  // } catch (error) {
  //   errorMessage.value = error.data?.statusMessage || error.message || "Gagal menyimpan profil.";
  //   await $swal.danger(errorMessage.value, "Gagal menyimpan");
  //   setTimeout(() => {
  //     errorMessage.value = "";
  //   }, 3000);
  // } finally {
  //   isLoading.value = false;
  // }
};



//...........................................................................................................
//....SSSSSSSSSS.......CCCCCCCCCC.....HHHH......HHHH...EEEEEEEEEEEEEE..MMMMMMM....MMMMMMM......AAAAAA........
//...SSSSSSSSSSSS.....CCCCCCCCCCCC....HHHH......HHHH...EEEEEEEEEEEEEE..MMMMMMM....MMMMMMM.....AAAAAAAA.......
//..SSSSSSSSSSSSS....CCCCCCCCCCCCCC...HHHH......HHHH...EEEEEEEEEEEEEE..MMMMMMM....MMMMMMM.....AAAAAAAA.......
//..SSSSSS.SSSSSSS..CCCCCCCCCCCCCCCC..HHHH......HHHH...EEEEE...........MMMMMMM...MMMMMMMM.....AAAAAAAAA......
//..SSSSS....SSSSS..CCCCCC....CCCCC...HHHH......HHHH...EEEEE...........MMMMMMMM..MMMMMMMM....AAAAAAAAAA......
//..SSSSSSS.........CCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMM..MMMMMMMM....AAAAAAAAAA......
//..SSSSSSSSSS.....SCCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMM.MMMMMMMMM....AAAAAAAAAAA.....
//...SSSSSSSSSSSS..SCCCC..............HHHHHHHHHHHHHH...EEEEEEEEEEEEE...MMMMMMMMMMMMMMMMMM...AAAAA..AAAAA.....
//....SSSSSSSSSSSS.SCCCC..............HHHHHHHHHHHHHH...EEEEEEEEEEEEE...MMMMMMMMMMMMMMMMMM...AAAAA..AAAAA.....
//......SSSSSSSSSS.SCCCC..............HHHHHHHHHHHHHH...EEEEEEEEEEEEE...MMMMMMMMMMMMMMMMMM...AAAAA...AAAAA....
//..........SSSSSS.SCCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMMMMMMMMMMMM..AAAAAAAAAAAAAA....
//.SSSSS......SSSSS.CCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMMMMMMMMMMMM..AAAAAAAAAAAAAAA...
//.SSSSSS....SSSSSS.CCCCCC....CCCCCC..HHHH......HHHH...EEEEE...........MMMMMMMMMMMM.MMMMM..AAAAAAAAAAAAAAA...
//..SSSSSSSSSSSSSS..CCCCCCCCCCCCCCCC..HHHH......HHHH...EEEEE...........MMMMM.MMMMMM.MMMMM.AAAAAA.....AAAAA...
//..SSSSSSSSSSSSSS...CCCCCCCCCCCCCC...HHHH......HHHH...EEEEEEEEEEEEEE..MMMMM.MMMMMM.MMMMM.AAAAA......AAAAAA..
//...SSSSSSSSSSSS.....CCCCCCCCCCCCC...HHHH......HHHH...EEEEEEEEEEEEEE..MMMMM.MMMMMM.MMMMMMAAAAA.......AAAAA..
//....SSSSSSSSSS.......CCCCCCCCCC.....HHHH......HHHH...EEEEEEEEEEEEEE..MMMM..MMMMM..MMMMMMAAAAA.......AAAAA..
//...........................................................................................................
const schemaForm = {
  title: "Maklumat Profil Pengguna",
  fieldSets: [
    {
      legend: "Butiran Akaun",
      colGroups: [
        {
          colwidth: 6,
          fields: [
            { 
              name: "username", 
              label: "Login ID", 
              type: "text",
              viewOnly: true 
            }
          ],
        },
        {
          colwidth: 6,
          fields: [
            { 
              name: "role", 
              label: "Role", 
              type: "text", 
              viewOnly: true 
            }
          ],
        },
      ],
    },
    {
      legend: "Butiran Peribadi",
      colGroups: [
        {
          colwidth: 12,
          fields: [
            { 
              name: "ic_number", 
              label: "ID Number", 
              type: "text", viewOnly: true 
            }
          ],
        },
        {
          colwidth: 12,
          fields: [
            { 
              name: "full_name", 
              label: "Name", 
              type: "text", 
              viewOnly: false 
            }
          ],
        },
        {
          colwidth: 6,
          fields: [
            { 
              name: "email", 
              label: "Email", 
              type: "email", 
              viewOnly: false 
            }
          ],
        },
        {
          colwidth: 6,
          fields: [
            {
              name: "department",
              label: "Department", 
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
    {
      legend: "Contract Details",
      colGroups: [
        {
          colwidth: 6,
          fields: [
            { 
              name: "category", 
              label: "Category", 
              type: "select",
              viewOnly: false,
              options: [
                { value: "Tetap", label: "Full Time" },
                { value: "Kontrak", label: "Contract" },
              ],
            }
          ],
        },
        {
          colwidth: 6,
          fields: [
            { 
              name: "salary", 
              label: "Salary (RM)", 
              type: "currency",
              viewType: "private",
              // viewOnly: true 
            }
          ],
        },
        {
          colwidth: 6,
          fields: [
            { 
              name: "start_date", 
              label: "Start Date", 
              type: "date", 
              viewOnly: true 
            }
          ],
        },
        {
          colwidth: 6,
          fields: [
            { 
              name: "end_date", 
              label: "End Date", 
              type: "date", 
              viewOnly: true 
            }
          ],
        },
      ],
    },
  ],
};

onMounted(loadProfile);
</script>
