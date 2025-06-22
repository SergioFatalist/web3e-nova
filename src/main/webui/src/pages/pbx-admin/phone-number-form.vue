<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-numeric q-mr-sm" />
        {{ $t(edit ? "phone-numbers.edit" : "phone-numbers.create") }}
      </q-toolbar-title>
    </q-toolbar>
    <q-form @submit.prevent="$store.set">
      <q-card flat class="q-dark_bg">
        <q-card-section>
          <div class="q-gutter-md q-pt-none row">
            <div class="col">
              <q-input
                v-model="$store.item.name"
                :label="$t('phone-number.number')"
                :error="!!$store.validationErrors.name"
                :error-message="$store.validationErrors.name"
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-input
                v-model="$store.item.description"
                :label="$t('item.description')"
                dense
                outlined
              />
            </div>
          </div>
          <div class="q-gutter-md q-pt-none row">
            <div class="col">
              <SelectDictionaryItem
                v-model="$store.item.direction"
                :options="directions"
                :label="$t('phone-number.direction')"
                :error="!!$store.validationErrors.direction"
              />
            </div>
            <div class="col">
              <q-checkbox v-model="$store.item.isEnabled" :label="$t('item.isEnabled')" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space />
          <FormCancel @click="$store.cancel" />
          <FormSave />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import FormCancel from "@/components/form/form-cancel.vue";
import FormSave from "@/components/form/form-save.vue";
import useQueryParam from "@/composables/useQueryParam";
import { type DictionaryItem, Direction } from "@/types";
import { computed, onMounted, ref } from "vue";
import { usePhoneNumberStore } from "@/stores/phone-number";
import SelectDictionaryItem from "@/components/form/select-dictionary-item.vue";

const $store = usePhoneNumberStore();
const id = useQueryParam("id") ?? "list";
const edit = computed<boolean>(() => useQueryParam("action") == "edit");

const directions = ref<DictionaryItem[]>(
  Object.keys(Direction).map((name) => ({
    name,
    value: Direction[name as keyof typeof Direction],
    isEnabled: true,
  }))
);

onMounted(async () => {
  if (edit.value) {
    await $store.get(id);
  }
});
</script>
