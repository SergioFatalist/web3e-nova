<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-server-outline q-mr-sm" />
        {{ $t("hosts.label") }}
      </q-toolbar-title>
      <ToolbarAdd v-if="!form" @click="$store.create" />
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
    >
      <template #extra-actions="{ item }: { item: BaseItemMessage }">
        <q-btn
          icon="mdi-code-tags"
          color="secondary"
          size="md"
          flat
          dense
          @click="getFreeswitchXml(item.id)"
        />
      </template>
    </BaseItemsListTable>
  </q-page>
  <q-dialog v-model="codeDialog">
    <q-card flat style="min-width: 100%; min-height: 100%">
      <q-card-section class="row">
        <div class="text-h6">freeswitch.xml</div>
        <q-space />
        <q-btn dense flat icon="mdi-close" @click="closeCodeDialog" />
      </q-card-section>
      <q-card-section style="max-height: 85vh">
        <VCodeBlock
          :code="
            useXmlFormatter($store.freeswitchXml ?? '', {
              strictMode: false,
              collapseContent: true,
            })
          "
          height="85vh"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import BaseItemsListTable from "@/components/base-items-list-table.vue";
import ToolbarAdd from "@/components/toolbar/toolbar-add.vue";
import useQueryParam from "@/composables/useQueryParam";
import useXmlFormatter from "@/composables/useXmlFormatter";
import type { BaseItemMessage } from "@/generated/protobuf/common/common";
import { validate as uuidValidate } from "uuid";
import { computed, onMounted, ref } from "vue";
import { useHostStore } from "@/stores/host";
import { useQuasar } from "quasar";

const $q = useQuasar();

const $store = useHostStore();
const id = useQueryParam("id") ?? "list";
const form = computed(() => uuidValidate(id));
const codeDialog = ref(false);

const getFreeswitchXml = async (id: string) => {
  $q.loading.show();
  await $store.getFreeswitchXml(id);
  codeDialog.value = true;
  $q.loading.hide();
};

const closeCodeDialog = () => {
  codeDialog.value = false;
  $store.freeswitchXml = "";
};

onMounted(() => (form.value ? $store.get(id) : $store.list()));
</script>
