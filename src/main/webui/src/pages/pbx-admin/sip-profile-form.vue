<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-artboard q-mr-sm" />
        {{ $t(edit ? "sip-profiles.edit" : "sip-profiles.create") }}
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
              <SelectDictionaryItem
                v-model="$store.item.contextId"
                :options="$contexts.dictionary"
                :label="$t('item.context')"
                :error="!!$store.validationErrors.contextId"
              />
            </div>
            <div class="col">
              <q-checkbox v-model="$store.item.isEnabled" :label="$t('label.enabled')" />
            </div>
          </div>
        </q-card-section>
        <q-expansion-item expand-separator icon="mdi-code-braces" :label="$t('variables.label')">
          <OrderedNameValueListTable
            :items="$store.item.params"
            @add="$store.addParam"
            @del="$store.delParam"
            @step="$store.stepParam"
            @move="$store.moveParam"
          />
        </q-expansion-item>
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
import OrderedNameValueListTable from "@/components/ordered-name-value-list-table.vue";
import useQueryParam from "@/composables/useQueryParam";
import { NIL } from "uuid";
import { computed, onMounted } from "vue";
import { useSipProfileStore } from "@/stores/sip-profile";
import { useContextStore } from "@/stores/context";
import SelectDictionaryItem from "@/components/form/select-dictionary-item.vue";

const $store = useSipProfileStore();
const $contexts = useContextStore();
const id = useQueryParam("id") ?? NIL;
const edit = computed<boolean>(() => useQueryParam("action") == "edit");

onMounted(async () => {
  await Promise.all([edit.value ? $store.get(id) : $store.prepare(), $contexts.init()]);
});
</script>
