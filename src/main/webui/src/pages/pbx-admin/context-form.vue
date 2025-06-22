<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-application-braces-outline q-mr-sm" />
        {{ $t(edit ? "contexts.edit" : "contexts.create") }}
      </q-toolbar-title>
    </q-toolbar>
    <q-form @submit.prevent="$store.set">
      <q-card flat class="q-dark_bg">
        <q-card-section>
          <div class="q-gutter-md q-pt-none row">
            <div class="col">
              <q-input
                v-model="$store.item.name"
                :label="$t('item.name')"
                :error="!!$store.validationErrors.name"
                :error-message="$store.validationErrors.name"
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-input
                v-model="$store.item.description"
                :label="$t('label.description')"
                dense
                outlined
              />
            </div>
          </div>
          <div class="q-gutter-md q-pt-none row">
            <div class="col">
              <q-checkbox v-model="$store.item.isEnabled" :label="$t('label.enabled')" />
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
import { useContextStore } from "@/stores/context";
import { NIL } from "uuid";
import { computed, onMounted } from "vue";
import useQueryParam from "@/composables/useQueryParam";

const $store = useContextStore();
const id = useQueryParam("id") ?? NIL;
const edit = computed<boolean>(() => useQueryParam("action") == "edit");

onMounted(async () => {
  if (edit.value) {
    await $store.get(id);
  }
});
</script>
