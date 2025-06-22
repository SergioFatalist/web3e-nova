<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-security-network q-mr-sm" />
        {{ $t(edit ? "acls.edit" : "acls.create") }}
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
              <q-select
                v-model="$store.item.action"
                :label="$t('acl-action.label')"
                :option-label="(i) => (i ? $t(`enums.acl-type.${i}`) : '')"
                :option-value="(i) => i"
                :options="actions"
                :error="!!$store.validationErrors.action"
                :error-message="$store.validationErrors.action"
                map-options
                emit-value
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-checkbox v-model="$store.item.isEnabled" :label="$t('item.isEnabled')" />
            </div>
          </div>
        </q-card-section>
        <q-table
          :rows="$store.item.entries"
          :columns="columns"
          :rows-per-page-options="[0]"
          :pagination="{
            rowsPerPage: 0,
            sortBy: 'order',
            descending: false,
          }"
          binary-state-sort
          hide-pagination
          disable-sort
          flat
          dense
        >
          <template #header-cell-actions>
            <q-th auto-width class="text-center">
              {{ $t("actions.label") }}
              <q-btn class="q-ml-md" icon="add" size="sm" dense outline @click="$store.addEntry" />
            </q-th>
          </template>
          <template #body="{ row }">
            <q-tr>
              <q-td key="action" auto-width>
                <q-select
                  v-model="row.action"
                  :option-label="(i) => (i ? $t(`enums.acl-type.${i}`) : '')"
                  :option-value="(i) => i"
                  :options="actions"
                  map-options
                  emit-value
                  dense
                  outlined
                />
              </q-td>
              <q-td key="target" auto-width>
                <q-select
                  v-model="row.target"
                  :options="targets"
                  map-options
                  emit-value
                  dense
                  outlined
                />
              </q-td>
              <q-td key="value">
                {{ row.value }}
                <q-popup-edit v-slot="scope" v-model="row.value" fit auto-save>
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    @close="scope.set"
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="description">
                {{ row.description }}
                <q-popup-edit v-slot="scope" v-model="row.description" fit auto-save>
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    @close="scope.set"
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </q-td>

              <q-td key="isEnabled" class="text-center" auto-width>
                <TableToggleBool
                  :bool="!!row.isEnabled"
                  size="md"
                  @click="row.isEnabled = !row.isEnabled"
                />
              </q-td>
              <q-td key="actions" class="text-right no-wrap" auto-width>
                <q-btn
                  icon="delete"
                  color="negative"
                  class="q-ml-md"
                  flat
                  dense
                  @click="$store.delEntry(row)"
                >
                  <q-tooltip class="bg-negative">
                    {{ $t("Delete") }}
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
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
import { computed, onMounted, ref } from "vue";
import { useACLStore } from "@/stores/acl";
import type { QTable } from "quasar";
import { useI18n } from "vue-i18n";
import TableToggleBool from "@/components/table/table-toggle-bool.vue";

const { t } = useI18n();
const $store = useACLStore();
const id = useQueryParam("id") ?? "list";
const edit = computed<boolean>(() => useQueryParam("action") == "edit");
const actions = ref<string[]>(["allow", "deny"]);
const targets = ref<string[]>(["cidr", "domain"]);

onMounted(async () => {
  if (edit.value) {
    await $store.get(id);
  }
});

const columns = computed<QTable["columns"]>(() => [
  {
    name: "action",
    field: "action",
    label: t("acl-action.label"),
    align: "left",
  },
  {
    name: "target",
    field: "target",
    label: t("acl-target.label"),
    align: "left",
  },
  {
    name: "value",
    field: "value",
    label: t("item.value"),
    align: "left",
  },
  {
    name: "description",
    field: "description",
    label: t("item.description"),
    align: "left",
  },
  {
    name: "isEnabled",
    field: "isEnabled",
    label: t("item.isEnabled"),
    align: "center",
  },
  {
    name: "actions",
    field: "actions",
    label: t("actions.label"),
    align: "right",
  },
]);
</script>
