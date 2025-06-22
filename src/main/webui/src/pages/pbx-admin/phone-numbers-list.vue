<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-numeric q-mr-sm" />
        {{ $t("phone-numbers.label") }}
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
import { Direction } from "@/types";
import type { QTableProps } from "quasar";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePhoneNumberStore } from "@/stores/phone-number";

const { t } = useI18n();
const $store = usePhoneNumberStore();

const directions = ref<{ name: string; value: string }[]>(
  Object.keys(Direction).map((name) => ({
    name,
    value: Direction[name as keyof typeof Direction],
  }))
);

const columns = computed<QTableProps["columns"]>(() => [
  {
    name: "direction",
    align: "center",
    label: t("phone-number.direction"),
    field: "direction",
    sortable: false,
  },
]);

onMounted($store.list);
</script>
