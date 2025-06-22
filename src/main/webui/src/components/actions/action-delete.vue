<template>
  <q-btn
    :disable="props.disabled"
    :size="props.size"
    icon="mdi-delete-outline"
    color="negative"
    flat
    dense
    @click="$emit('click')"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  size: {
    type: String,
    required: false,
    default: () => "sm",
  },
});
defineEmits(["click"]);
</script>
