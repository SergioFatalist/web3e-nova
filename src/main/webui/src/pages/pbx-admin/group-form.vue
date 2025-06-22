<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-account-multiple-outline q-mr-sm" />
        {{ $t(edit ? "groups.edit" : "groups.create") }}
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
                :label="$t('item.description')"
                dense
                outlined
              />
            </div>
          </div>
          <div class="q-gutter-md q-pt-none row">
            <div class="col">
              <SelectDictionaryItem
                v-model="$store.item.domainIds"
                :options="$domains.dictionary"
                :label="$t('domains.label')"
                :error="!!$store.validationErrors.domainIds"
                multiple
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
import { useGroupStore } from "@/stores/group";
import { computed, onMounted } from "vue";
import { NIL } from "uuid";
import { useContextStore } from "@/stores/context";
import { useDomainStore } from "@/stores/domain";
import SelectDictionaryItem from "@/components/form/select-dictionary-item.vue";

const $store = useGroupStore();
const $contexts = useContextStore();
const $domains = useDomainStore();
const id = useQueryParam("id") ?? NIL;

const edit = computed(() => useQueryParam("action") == "edit");

onMounted(async () => {
  await Promise.all([
    $contexts.init(),
    $domains.init(),
    edit.value ? $store.get(id) : $store.prepare(),
  ]);
  if (edit.value) {
    await $store.get(id);
  }
});
</script>
