<!-- app/components/DynamicForm.vue -->
<template>
  <form
    id="dynamic-schema-form"
    @submit.prevent="handleSubmit"
    class="w-full space-y-4"
  >
    <h2
      v-if="schema.title"
      class="text-xl font-bold text-gray-800"
    >
      {{ schema.title }}
    </h2>
    <hr class="my-2">
    <fieldset
      v-for="(fieldset, fsIndex) in schema.fieldSets"
      :key="fsIndex"
      class="border border-gray-200 rounded-lg p-6 bg-white shadow-md"
    >
      <legend
        v-if="fieldset.legend"
        class="sr-only"
      >
        {{ fieldset.legend }}
      </legend>

      <h3
        v-if="fieldset.legend"
        class="text-md font-semibold text-gray-700"
      >
        {{ fieldset.legend }}
      </h3>

      <hr class="my-2">
      <div class="grid grid-cols-12 gap-2">
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
            <label
              :for="field.name"
              class="text-sm font-medium text-gray-600"
            >
              {{ field.label }}
            </label>

            <!-- View-only private fields stay masked unless explicitly revealed. -->
            <div
              v-if="isFieldViewOnly(field) && field.viewType === 'private'"
              class="relative"
            >
              <input
                :id="field.name"
                :type="visiblePrivateFields[field.name] ? 'text' : 'password'"
                :value="formData[field.name] ?? ''"
                readonly
                tabindex="-1"
                class="w-full pointer-events-none px-2 py-1 pr-14 bg-gray-200 border border-gray-300 rounded-md text-gray-700 text-xs font-medium"
              />
              <button
                type="button"
                :aria-label="visiblePrivateFields[field.name] ? `Hide ${field.label}` : `Show ${field.label}`"
                class="absolute inset-y-0 right-3 text-sm font-medium text-gray-600 hover:text-gray-900"
                @click="togglePrivateField(field.name)"
              >
                {{ visiblePrivateFields[field.name] ? "Hide" : "Show" }}
              </button>
            </div>

            <!-- View Only Layout -->
            <div
              v-else-if="isFieldViewOnly(field)"
              class="px-2 py-1 bg-gray-200 border border-gray-300 rounded-md text-gray-700 text-xs font-medium"
            >
              {{ getSelectedLabel(field) || "..." }}
            </div>

            <!-- Select Option Layout -->
            <select
              v-else-if="field.type === 'select'"
              :id="field.name"
              v-model="formData[field.name]"
              class="px-2 py-1 border border-gray-300 rounded-md text-xs bg-white outline-none transition duration-200 focus:border-blue-400 focus:ring-3 focus:ring-blue-400/15"
            >
              <option
                value=""
                disabled
              >
                Sila pilih...
              </option>
              <option
                v-for="opt in field.options"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>

            <!-- Standard Inputs (text, email, password, etc) -->
            <div
              v-else-if="field.viewType === 'private'"
              class="relative"
            >
              <input
                :id="field.name"
                :type="visiblePrivateFields[field.name] ? 'text' : 'password'"
                :inputmode="['number', 'currency'].includes(field.type) ? 'decimal' : undefined"
                v-model="formData[field.name]"
                @input="sanitizeNumericInput($event, field)"
                @blur="formatCurrencyInput($event, field)"
                class="w-full px-2 py-1 pr-14 border border-gray-300 rounded-md text-xs outline-none transition duration-200 focus:border-blue-400 focus:ring-3 focus:ring-blue-400/15"
              />
              <button
                type="button"
                :aria-label="visiblePrivateFields[field.name] ? `Hide ${field.label}` : `Show ${field.label}`"
                class="absolute inset-y-0 right-3 text-sm font-medium text-gray-600 hover:text-gray-900"
                @click="togglePrivateField(field.name)"
              >
                {{ visiblePrivateFields[field.name] ? "Hide" : "Show" }}
              </button>
            </div>
            <div
              v-else-if="field.type === 'date'"
              class="relative w-full rounded-md focus-within:ring-3 focus-within:ring-blue-400/15"
            >
              <span class="flex items-center justify-between px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700">
                <span>{{ formatDateDisplay(formData[field.name]) }}</span>
                <svg
                  aria-hidden="true"
                  class="w-3 h-3 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                  />
                  <path d="M16 3v4M8 3v4M3 11h18" />
                </svg>
              </span>
              <input
                :id="field.name"
                :aria-label="field.label"
                type="date"
                :value="normalizeDateValue(formData[field.name])"
                @input="formData[field.name] = $event.target.value"
                @click="openDatePicker"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <input
              v-else-if="field.type === 'number' || field.type === 'currency'"
              :id="field.name"
              type="text"
              inputmode="decimal"
              :value="formData[field.name] ?? ''"
              @input="sanitizeNumericInput($event, field)"
              @blur="formatCurrencyInput($event, field)"
              class="px-2 py-1 border border-gray-300 rounded-md text-xs outline-none transition duration-200 focus:border-blue-400 focus:ring-3 focus:ring-blue-400/15"
            />
            <input
              v-else
              :id="field.name"
              :type="field.type"
              v-model="formData[field.name]"
              class="px-2 py-1 border border-gray-300 rounded-md text-xs outline-none transition duration-200 focus:border-blue-400 focus:ring-3 focus:ring-blue-400/15"
            />
          </div>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  schema: { type: Object, required: true },
  rawData: { type: Object, default: () => null },
  viewMode: { type: String, default: "" },
});

// Upgraded Vue 3.4+ Bidirectional Binding (Replaces old modelValue layout)
const formData = defineModel({ type: Object, required: true });
const visiblePrivateFields = reactive({});

const isFieldViewOnly = (field) => props.viewMode === "view" || field.viewOnly;

const togglePrivateField = (fieldName) => {
  visiblePrivateFields[fieldName] = !visiblePrivateFields[fieldName];
};

const sanitizeNumericInput = (event, field) => {
  if (!["number", "currency"].includes(field.type)) return;

  const maxDecimalPlaces = field.type === "currency" ? 2 : undefined;
  let value = event.target.value.replace(/[^\d.-]/g, "");
  const isNegative = value.startsWith("-");
  value = value.replace(/-/g, "");

  const decimalIndex = value.indexOf(".");
  if (decimalIndex !== -1) {
    value = `${value.slice(0, decimalIndex + 1)}${value.slice(decimalIndex + 1).replace(/\./g, "")}`;
    if (maxDecimalPlaces !== undefined) {
      value = `${value.slice(0, decimalIndex + 1)}${value.slice(decimalIndex + 1, decimalIndex + 1 + maxDecimalPlaces)}`;
    }
  }

  event.target.value = `${isNegative ? "-" : ""}${value}`;
  formData.value[field.name] = event.target.value;
};

const formatCurrencyInput = (event, field) => {
  if (field.type !== "currency" || event.target.value === "") return;

  const value = Number(event.target.value);
  if (!Number.isFinite(value)) return;

  event.target.value = value.toFixed(2);
  formData.value[field.name] = event.target.value;
};

const emit = defineEmits(["form-submit"]);
const handleSubmit = () => emit("form-submit");

const normalizeDateValue = (value) => {
  if (typeof value !== "string" || !value) return value ?? "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (value) => {
  const dateValue = normalizeDateValue(value);
  if (!dateValue) return "";
  return `${dateValue.slice(8, 10)}/${dateValue.slice(5, 7)}/${dateValue.slice(0, 4)}`;
};

const openDatePicker = (event) => {
  const input = event.currentTarget;
  if (typeof input.showPicker === "function") input.showPicker();
};

// Dynamic Auto-Mapping Watcher Engine with SSR safety guard check
watch(
  () => props.rawData,
  (newDbData) => {
    if (!newDbData) return;

    const mappedResult = { ...formData.value };

    // Global property fallback safety rule
    if (newDbData.role) mappedResult.role = newDbData.role;

    props.schema.fieldSets.forEach((fieldset) => {
      fieldset.colGroups.forEach((group) => {
        group.fields.forEach((field) => {
          if (newDbData[field.name] !== undefined) {
            mappedResult[field.name] = newDbData[field.name];
          }
        });
      });
    });

    formData.value = mappedResult;
  },
  { immediate: true, deep: true },
);

const getColWidthClass = (width) => {
  const spans = { 6: "col-span-12 md:col-span-6", 12: "col-span-12" };
  return spans[width] || "col-span-12";
};

const getSelectedLabel = (field) => {
  const value = formData.value[field.name];
  if (field.type === "select" && field.options) {
    const matchingOption = field.options.find((opt) => opt.value === value);
    return matchingOption ? matchingOption.label : value;
  }
  if (field.type === "currency" && value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))) {
    return new Intl.NumberFormat("ms-MY", {
      style: "currency",
      currency: field.currency || "MYR",
    }).format(Number(value));
  }
  if (field.type === "date") return formatDateDisplay(value) || value;
  return value;
};
</script>
