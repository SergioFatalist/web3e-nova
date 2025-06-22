<template>
  <q-btn
    :disable="props.disabled"
    flat
    icon="mdi-close"
    color="primary"
    :label="$t('action.cancel')"
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
});
defineEmits(["click"]);
</script>
