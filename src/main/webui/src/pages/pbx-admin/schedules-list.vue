<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-invoice-text-clock-outline q-mr-sm" />
        {{ $t("schedules.label") }}
      </q-toolbar-title>
      <ToolbarAdd @click="$store.create" />
    </q-toolbar>
    <BaseItemsListTable
      :items="$store.items"
      :loading="$store.loading"
      :pagination="$store.pagination"
      :extra-columns="extraColumns"
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
import { useScheduleStore } from "@/stores/schedule";
import type { QTableProps } from "quasar";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const $store = useScheduleStore();

onMounted($store.list);

const extraColumns = computed<QTableProps["columns"]>(() => [
  {
    name: "timezone",
    align: "left",
    label: t("label.timezone"),
    field: "timezone",
    sortable: false,
  },
]);
</script>
