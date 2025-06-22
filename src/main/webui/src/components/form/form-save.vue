<template>
  <q-btn
    :disable="props.disabled"
    flat
    type="submit"
    icon="mdi-check"
    color="positive"
    :label="$t('action.save')"
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
