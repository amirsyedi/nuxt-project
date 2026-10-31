<!-- app/pages/profile.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <MainSpinner
      fullScreen
      :is-loading="isLoading"
      size="53px"
      color="#3498db"
      thickness="6px"
    />
    <!-- <MainCard> -->
      <!-- <MainBreadcrumb /> -->
      <DynamicForm
        :schema="schemaForm"
        :form-raw-data="profileData"
        :view-mode="viewMode"
        v-model="profileData"
        @form-submit="saveProfile"
      />

      <div class="flex justify-end mt-4">
        <button
          v-if="viewMode != 'view'"
          type="button"
          @click="saveProfile"
          class="bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition shadow-sm mx-1 cursor-pointer"
        >
          Simpan
        </button>
      </div>
    <!-- </MainCard> -->
  </div>
</template>

<script setup>
import { 
  onMounted, 
  ref 
} from "vue";
import { useApi } from "../../../services/users.js";
const { $swal } = useNuxtApp();
const props = defineProps({
  propIdUser: { type: [String, Number], default: null },
  viewMode: { type: String },
  refreshUsers: { type: Function, default: () => Promise.resolve() },
});

const { getUserById, updateUser } = useApi();
const isSaved = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const schemaForm = {
  title: "",
  fieldSets: [
    {
      legend: "Account Details",
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
      legend: "Personal Details",
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
              // viewOnly: true 
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
              // viewOnly: true
            }
          ],
        },
      ],
    },
  ],
};

const profileData = ref({
  id: null,
  username: "",
  role: "",
  full_name: "",
  email: "",
  department: "",
  salary: 0
});

const getData = async () => {
  isLoading.value = true;
  await getUserById(props.propIdUser).then(res => {
    console.log("res", res);
    Object.assign(profileData.value, res);
    isLoading.value = false;
  }).catch(err => {
    console.log(err);
    isLoading.value = false;
  });
};

const saveProfile = async () => {
  if (await $swal.confirm("Adakah anda pasti ingin menyimpan profil ini?", "Sahkan")) {
    isLoading.value = true;
    await updateUser(profileData.value.id, profileData.value).then((response) => {
      isLoading.value = false;
      Object.assign(profileData.value, response);
      console.log("response",response);
      nextTick(() => {
        props.refreshUsers();
        $swal.success("Profil berjaya dikemaskini!", "Berjaya");  
      }); 
    }).catch(error => {
      isLoading.value = false;
      $swal.danger(error.data?.statusMessage || error.message || "Gagal menyimpan profil.", "Gagal menyimpan");
    });
  }
}

onMounted(() => {
  getData();
});
</script>
