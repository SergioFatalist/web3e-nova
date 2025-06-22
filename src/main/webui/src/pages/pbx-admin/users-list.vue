<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-account-outline q-mr-sm" />
        {{ $t("users.label") }}
      </q-toolbar-title>
      <q-select
        v-model="userExternalId"
        :label="$t('users.candidates')"
        :options="candidates"
        option-label="name"
        option-value="value"
        class="col-3"
        use-input
        fill-input
        map-options
        emit-value
        outlined
        dense
        @filter="filterFn"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">{{ $t("no-results") }}</q-item-section>
          </q-item>
        </template>
        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.description }}</q-item-label>
              <q-item-label caption>{{ scope.opt.name }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon
                :name="
                  scope.opt.isEnabled ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'
                "
              />
            </q-item-section>
          </q-item>
        </template>
        <template #selected>
          {{ candidates.find((i) => i.value == userExternalId)?.description }}
        </template>
      </q-select>
      <ToolbarAdd
        :disabled="!userExternalId"
        class="q-ml-md"
        @click="$store.create(userExternalId)"
      />
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
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import type { DictionaryItem } from "@/types";

const $store = useUserStore();
const userExternalId = ref("");
const candidates = ref<DictionaryItem[]>([]);

const filterFn = (val: string, update: (callback: () => void) => void) => {
  if (!val) {
    candidates.value = $store.candidates;
    update(() => {});
    return;
  }
  const needle = val.toLowerCase();
  update(() => {
    candidates.value = $store.candidates.filter((v) => v.name.toLowerCase().includes(needle));
  });
};

onMounted(async () => await Promise.all([$store.list(), $store.loadCandidates()]));
</script>
