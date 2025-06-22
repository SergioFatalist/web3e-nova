<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-server-outline q-mr-sm" />
        {{ $t(id === NIL ? "hosts.create" : "hosts.edit") }}
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
              <q-input
                v-model="$store.item.apiUser"
                :label="$t('host.apiUser')"
                :error="!!$store.validationErrors.apiUser"
                :error-message="$store.validationErrors.apiUser"
                dense
                outlined
              >
                <template #append>
                  <q-btn dense flat icon="mdi-lock-reset" @click="$store.item.apiUser = v4()" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                v-model="$store.item.apiPassword"
                :label="$t('host.apiPassword')"
                :error="!!$store.validationErrors.apiPassword"
                :error-message="$store.validationErrors.apiPassword"
                dense
                outlined
              >
                <template #append>
                  <q-btn dense flat icon="mdi-lock-reset" @click="$store.item.apiPassword = v4()" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="q-gutter-md q-pt-none row">
            <div class="col">
              <q-input
                v-model="$store.item.eslHost"
                :label="$t('host.eslHost')"
                :error="!!$store.validationErrors.eslHost"
                :error-message="$store.validationErrors.eslHost"
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-input
                v-model="$store.item.eslPort"
                :label="$t('host.eslPort')"
                :error="!!$store.validationErrors.eslPort"
                :error-message="$store.validationErrors.eslPort"
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-input
                v-model="$store.item.eslPassword"
                :label="$t('host.eslPassword')"
                :error="!!$store.validationErrors.eslPassword"
                :error-message="$store.validationErrors.eslPassword"
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
import { NIL, v4 } from "uuid";
import { computed, onMounted } from "vue";
import { useHostStore } from "@/stores/host";

const $store = useHostStore();

const isCreate = computed(() => useQueryParam("action") == "create");
const id = useQueryParam("id") ?? NIL;

onMounted(() => (isCreate.value ? $store.prepare() : $store.get(id)));
</script>
