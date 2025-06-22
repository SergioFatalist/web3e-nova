<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-domain q-mr-sm" />
        {{ $t(edit ? "domains.edit" : "domains.create") }}
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
              <q-checkbox v-model="$store.item.isEnabled" :label="$t('item.isEnabled')" />
            </div>
          </div>
        </q-card-section>
        <q-expansion-item expand-separator icon="mdi-code-brackets" :label="$t('params.label')">
          <OrderedNameValueListTable
            :items="$store.item.params"
            @add="$store.addParam"
            @del="$store.delParam"
            @step="$store.stepParam"
            @move="$store.moveParam"
          />
        </q-expansion-item>
        <q-expansion-item expand-separator icon="mdi-code-braces" :label="$t('variables.label')">
          <OrderedNameValueListTable
            :items="$store.item.variables"
            @add="$store.addVariable"
            @del="$store.delVariable"
            @step="$store.stepVariable"
            @move="$store.moveVariable"
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
import { useDomainStore } from "@/stores/domain";
import { computed, onMounted } from "vue";
import { NIL } from "uuid";

const $store = useDomainStore();
const id = useQueryParam("id") ?? NIL;
const edit = computed<boolean>(() => useQueryParam("action") == "edit");

onMounted(async () => {
  if (edit.value) {
    await $store.get(id);
  }
});
</script>
