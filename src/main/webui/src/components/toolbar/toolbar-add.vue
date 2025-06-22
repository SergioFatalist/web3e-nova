<template>
  <q-btn
    icon="mdi-plus"
    color="primary"
    :size="props.size"
    :disable="props.disabled"
    :label="$t('action.add')"
    :to="props.to"
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
  to: {
    type: String,
    required: false,
    default: () => "",
  },
  size: {
    type: String,
    required: false,
    default: () => "md",
  },
});
defineEmits(["click"]);
</script>
