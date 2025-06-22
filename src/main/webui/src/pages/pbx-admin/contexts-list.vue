<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-application-braces-outline q-mr-sm" />
        {{ $t("contexts.label") }}
      </q-toolbar-title>
      <ToolbarAdd @click="$store.create" />
    </q-toolbar>
    <BaseItemsListTable
      :items="$store.items"
      :loading="$store.loading"
      :pagination="$store.pagination"
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
import { onMounted } from "vue";
import { useContextStore } from "@/stores/context";

const $store = useContextStore();

onMounted($store.list);
</script>
