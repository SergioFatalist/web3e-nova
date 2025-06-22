<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-security-network q-mr-sm" />
        {{ $t("acls.label") }}
      </q-toolbar-title>
      <ToolbarAdd @click="$store.create" />
    </q-toolbar>
    <BaseItemsListTable
      :items="$store.items"
      :loading="$store.loading"
      :pagination="$store.pagination"
      :extra-columns="columns"
      @request="$store.load"
      @refresh="$store.list"
      @edit="$store.edit"
      @toggle="$store.toggle"
      @remove="$store.remove"
    />
  </q-page>
</template>

<script setup lang="ts">
import BaseItemsListTable from "@/components/base-items-list-table.vue";
import ToolbarAdd from "@/components/toolbar/toolbar-add.vue";
import type { QTableProps } from "quasar";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useACLStore } from "@/stores/acl";

const { t } = useI18n();
const $store = useACLStore();

const columns = computed<QTableProps["columns"]>(() => [
  {
    name: "action",
    field: "action",
    label: t("acl-action"),
    align: "center",
    format: (i) => (i ? t(i) : ""),
  },
]);

onMounted($store.list);
</script>
