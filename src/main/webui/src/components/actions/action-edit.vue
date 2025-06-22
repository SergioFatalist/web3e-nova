<template>
  <q-btn
    :disable="props.disabled"
    :size="props.size"
    icon="mdi-pencil-outline"
    color="primary"
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
