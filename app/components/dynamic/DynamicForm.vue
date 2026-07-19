<!-- app/components/DynamicForm.vue -->
<template>
  <form id="dynamic-schema-form" @submit.prevent="handleSubmit" class="w-full space-y-6">
    <h2 v-if="schema.title" class="text-xl font-bold text-gray-800">
      {{ schema.title }}
    </h2>

    <fieldset
      v-for="(fieldset, fsIndex) in schema.fieldSets"
      :key="fsIndex"
      class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-4"
    >
      <legend v-if="fieldset.legend" class="text-md font-semibold text-gray-700 px-2">
        {{ fieldset.legend }}
      </legend>

      <div class="grid grid-cols-12 gap-6">
        <div
          v-for="(group, gIndex) in fieldset.colGroups"
          :key="gIndex"
          :class="getColWidthClass(group.colwidth)"
          class="flex flex-col gap-4"
        >
          <div
            v-for="field in group.fields"
            :key="field.name"
            class="flex flex-col gap-1.5 w-full"
          >
            <label :for="field.name" class="text-sm font-medium text-gray-600">
              {{ field.label }}
            </label>

            <!-- View Only Layout -->
            <div
              v-if="field.viewOnly"
              class="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-base font-medium"
            >
              {{ getSelectedLabel(field) || "—" }}
            </div>

            <!-- Select Option Layout -->
            <select
              v-else-if="field.type === 'select'"
              :id="field.name"
              v-model="formData[field.name]"
              class="px-3.5 py-2.5 border border-gray-300 rounded-md text-base bg-white outline-none transition duration-200 focus:border-blue-400 focus:ring-3 focus:ring-blue-400/15"
            >
              <option value="" disabled>Sila pilih...</option>
              <option 
                v-for="opt in field.options" 
                :key="opt.value" 
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>

            <!-- Standard Inputs (text, email, password, etc) -->
            <input
              v-else
              :id="field.name"
              :type="field.type"
              v-model="formData[field.name]"
              class="px-3.5 py-2.5 border border-gray-300 rounded-md text-base outline-none transition duration-200 focus:border-blue-400 focus:ring-3 focus:ring-blue-400/15"
            />
          </div>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  schema: { type: Object, required: true },
  rawData: { type: Object, default: () => null }
});

// Upgraded Vue 3.4+ Bidirectional Binding (Replaces old modelValue layout)
const formData = defineModel({ type: Object, required: true });

const emit = defineEmits(["form-submit"]);
const handleSubmit = () => emit("form-submit");

// Dynamic Auto-Mapping Watcher Engine with SSR safety guard check
watch(() => props.rawData, (newDbData) => {
  if (!newDbData) return; 

  const mappedResult = { ...formData.value };

  // Global property fallback safety rule
  if (newDbData.role) mappedResult.role = newDbData.role;

  props.schema.fieldSets.forEach(fieldset => {
    fieldset.colGroups.forEach(group => {
      group.fields.forEach(field => {
        if (newDbData[field.name] !== undefined) {
          mappedResult[field.name] = newDbData[field.name];
        }
      });
    });
  });

  formData.value = mappedResult;
}, { immediate: true, deep: true });

const getColWidthClass = (width) => {
  const spans = { 6: "col-span-12 md:col-span-6", 12: "col-span-12" };
  return spans[width] || "col-span-12";
};

const getSelectedLabel = (field) => {
  const value = formData.value[field.name];
  if (field.type === 'select' && field.options) {
    const matchingOption = field.options.find(opt => opt.value === value);
    return matchingOption ? matchingOption.label : value;
  }
  return value;
};
</script>