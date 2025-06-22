<template>
  <q-btn
    :disable="props.disabled"
    :icon="props.bool ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
    :color="props.bool ? 'positive' : 'negative'"
    :size="props.size"
    flat
    dense
    @click="$emit('click')"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  bool: {
    type: Boolean,
    required: true,
  },
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
