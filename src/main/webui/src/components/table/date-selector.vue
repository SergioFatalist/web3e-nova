<template>
  <q-input v-model="props.modelValue" mask="date" dense outlined>
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="modelValue" flat minimal />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: String,
});
</script>

<style scoped></style>
