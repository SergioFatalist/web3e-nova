<template>
  <q-btn
    :disable="props.disabled"
    :size="props.size"
    :icon="props.bool ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
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
  bool: {
    type: Boolean,
    required: true,
  },
  size: {
    type: String,
    required: false,
    default: () => "sm",
  },
});
defineEmits(["click"]);
</script>
