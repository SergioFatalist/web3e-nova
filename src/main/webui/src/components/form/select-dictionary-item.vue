<template>
  <q-select
    :model-value="modelValue"
    :label="label"
    :options="options"
    :multiple="multiple"
    :disable="disabled"
    :error="error"
    option-label="name"
    option-value="value"
    emit-value
    map-options
    dense
    outlined
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { DictionaryItem } from "@/types";

defineProps<{
  modelValue: string | string[];
  options: DictionaryItem[];
  label?: string;
  error?: boolean;
  disabled?: boolean;
  multiple?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();
</script>
