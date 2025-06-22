<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-phone-log-outline q-mr-sm" />
        {{ $t("cdr.list.label") }}
      </q-toolbar-title>
    </q-toolbar>
    <q-card flat class="q-dark_bg">
      <q-expansion-item expand-separator icon="mdi-filter-cog-outline" :label="$t('filters.label')">
        <q-card-section>
          <div class="q-gutter-md q-pt-none row">
            <div class="col">
              <SelectDictionaryItem
                :model-value="$store.filter.hostId!"
                :options="$hosts.dictionary"
                :label="$t('item.host')"
                clearable
                @update:model-value="$store.filter.hostId = isArray($event) ? $event[0] : $event"
              />
            </div>
            <div class="col">
              <SelectDictionaryItem
                :model-value="$store.filter.domainId!"
                :options="$domains.dictionary"
                :label="$t('item.domain')"
                clearable
                @update:model-value="$store.filter.domainId = isArray($event) ? $event[0] : $event"
              />
            </div>
            <div class="col">
              <SelectDictionaryItem
                :model-value="$store.filter.direction!"
                :options="$phoneNumbers.directions"
                :label="$t('item.direction')"
                clearable
                @update:model-value="$store.filter.direction = isArray($event) ? $event[0] : $event"
              />
            </div>
            <div class="col">
              <SelectDictionaryItem
                :model-value="$store.filter.phoneNumberId!"
                :options="$phoneNumbers.dictionary"
                :label="$t('item.phone-number')"
                clearable
                @update:model-value="
                  $store.filter.phoneNumberId = isArray($event) ? $event[0] : $event
                "
              />
            </div>
          </div>
          <div class="q-gutter-md q-pt-none row">
            <div class="col-4">
              <q-select
                v-model="$store.filter.userId"
                :label="$t('item.user')"
                :options="candidates"
                option-label="name"
                option-value="value"
                class="col"
                use-input
                fill-input
                map-options
                emit-value
                outlined
                dense
                clearable
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
                          scope.opt.isEnabled
                            ? 'mdi-check-circle-outline'
                            : 'mdi-close-circle-outline'
                        "
                      />
                    </q-item-section>
                  </q-item>
                </template>
                <template #selected>
                  {{ candidates.find((i) => i.value == $store.filter.userId)?.description }}
                </template>
              </q-select>
            </div>
            <div class="col">
              <q-input
                v-model="$store.filter.userSearch"
                :label="$t('item.partial-user')"
                dense
                outlined
                clearable
              />
            </div>
            <div class="col">
              <q-input
                v-model="$store.filter.phoneNumberSearch"
                :label="$t('item.partial-phone-number')"
                dense
                outlined
                clearable
              />
            </div>
            <div class="col-2">
              <q-input
                v-model="$store.filter.crmOrderId"
                :label="$t('item.partial-order-id')"
                dense
                outlined
                clearable
              />
            </div>
          </div>
        </q-card-section>
      </q-expansion-item>
      <q-card-section>
        <div class="q-pt-none row">
          <div class="col-11">
            <DateTimeRange
              :timezones="$timezones.sortedDictionary"
              :from-epoch="$store.filter.fromEpoch"
              :to-epoch="$store.filter.toEpoch"
              :tz="$app.timezone"
              @update:from-epoch="$store.filter.fromEpoch = $event"
              @update:to-epoch="$store.filter.toEpoch = $event"
              @update:tz="$app.timezone = $event"
            />
          </div>
          <div class="col-1 text-right">
            <q-btn color="primary" @click="$store.list">{{ $t("action.search") }}</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-table
      v-model:pagination="$store.pagination"
      :rows="$store.items"
      :columns="columns"
      :loading="$store.loading"
      :rows-per-page-options="[5, 10, 15, 25, 50, 100]"
      row-key="id"
      disable-sort
      flat
      dense
      @request="onRequest"
    >
      <template #body-cell-direction="{ row }">
        <q-td auto-width>
          <q-icon
            :name="directionIcons.get(row.direction) || 'mdi-phone-outline'"
            :color="directionColors.get(row.direction) || 'primary'"
            size="xs"
          />
        </q-td>
      </template>
      <template #body-cell-isLost="{ row }">
        <q-td auto-width>
          <q-icon
            :name="row.isLost ? 'mdi-phone-missed-outline' : 'mdi-phone-ring-outline'"
            :color="row.isLost ? 'negative' : 'positive'"
            size="xs"
          />
        </q-td>
      </template>
      <template #body-cell-recordPath="props">
        <q-td>
          <cdr-player v-if="props.value" :url="props.value" />
        </q-td>
      </template>
      <template #body-cell-actions="{ row }">
        <q-td auto-width class="text-right">
          <q-btn
            icon="mdi-code-tags"
            color="secondary"
            size="sm"
            :disabled="!row.rawId"
            flat
            dense
            @click="getRawXml(row.rawId)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
  <q-dialog v-model="codeDialog">
    <q-card flat style="min-width: 100%; min-height: 100%">
      <q-card-section class="row">
        <div class="text-h6">CDR XML</div>
        <q-space />
        <q-btn dense flat icon="mdi-close" @click="closeCodeDialog" />
      </q-card-section>
      <q-card-section class="scroll">
        <VCodeBlock
          :code="useXmlFormatter($store.rawXml ?? '', { strictMode: true, collapseContent: true })"
          height="85vh"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDomainStore } from "@/stores/domain";
import { useHostStore } from "@/stores/host";
import SelectDictionaryItem from "@/components/form/select-dictionary-item.vue";
import DateTimeRange from "@/components/form/date-time-range.vue";
import { useTimezoneStore } from "@/stores/timezone";
import { useAppStore } from "@/stores/app";
import { useCDRStore } from "@/stores/cdr";
import { isArray } from "remeda";
import { useUserStore } from "@/stores/user";
import type { DictionaryItem } from "@/types";
import { usePhoneNumberStore } from "@/stores/phone-number";
import { type QTableProps, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import useFormatDuration from "@/composables/useFormatDuration";
import CdrPlayer from "@/components/cdr-player.vue";
import useXmlFormatter from "@/composables/useXmlFormatter";

const { t } = useI18n();
const $q = useQuasar();

const $store = useCDRStore();
const $app = useAppStore();
const $hosts = useHostStore();
const $domains = useDomainStore();
const $users = useUserStore();
const $phoneNumbers = usePhoneNumberStore();
const $timezones = useTimezoneStore();

const candidates = ref<DictionaryItem[]>([]);
const codeDialog = ref(false);

const filterFn = (val: string, update: (callback: () => void) => void) => {
  if (!val) {
    candidates.value = $users.dictionary;
    update(() => {});
    return;
  }
  const needle = val.toLowerCase();
  update(() => {
    candidates.value = $users.dictionary.filter((v) => v.name.toLowerCase().includes(needle));
  });
};

const onRequest = ({ pagination }: { pagination: QTableProps["pagination"] }) => {
  $store.pagination = {
    ...$store.pagination,
    ...pagination,
  };
  $store.list();
};

const getRawXml = async (id: string) => {
  $q.loading.show();
  await $store.getRawXml(id);
  codeDialog.value = true;
  $q.loading.hide();
};

const closeCodeDialog = () => {
  codeDialog.value = false;
  $store.rawXml = "";
};

onMounted(async () => {
  await Promise.all([
    $hosts.init(),
    $domains.init(),
    $users.init(),
    $phoneNumbers.init(),
    $store.list(),
  ]);
});

const directionIcons = new Map<string, string>([
  ["inbound", "mdi-phone-incoming-outline"],
  ["outbound", "mdi-phone-outgoing-outline"],
  ["local", "mdi-phone-refresh-outline"],
  ["any", "mdi-phone-incoming-outgoing-outline"],
]);

const directionColors = new Map<string, string>([
  ["inbound", "primary"],
  ["outbound", "info"],
  ["local", "secondary"],
  ["any", "secondary"],
]);

const columns = computed<QTableProps["columns"]>(() => [
  {
    name: "direction",
    align: "left",
    label: "",
    field: "direction",
    sortable: false,
  },
  {
    name: "isLost",
    align: "left",
    label: "",
    field: "isLost",
    sortable: false,
  },
  {
    name: "crmOrderId",
    align: "left",
    label: t("label.order-id"),
    field: "crmOrderId",
    sortable: false,
    headerStyle: "text-align: center;",
  },
  {
    name: "startEpoch",
    align: "left",
    label: t("label.start-epoch"),
    field: "startEpoch",
    format: (v: number) => dayjs.tz(v * 1000, $app.timezone).format("YYYY-MM-DD HH:mm:ss"),
    sortable: false,
    headerStyle: "text-align: center;",
  },
  {
    name: "sipFrom",
    align: "left",
    label: t("item.caller"),
    field: "sipFrom",
    sortable: false,
    headerStyle: "text-align: center;",
  },
  {
    name: "sipTo",
    align: "left",
    label: t("item.callee"),
    field: "sipTo",
    sortable: false,
    headerStyle: "text-align: center;",
  },
  {
    name: "duration",
    align: "right",
    label: t("item.duration"),
    field: "duration",
    format: (v: number) => useFormatDuration(v),
    sortable: false,
    headerStyle: "text-align: center;",
  },
  {
    name: "billSec",
    align: "right",
    label: t("item.billable"),
    field: "billSec",
    format: (v: number) => useFormatDuration(v),
    sortable: false,
    headerStyle: "text-align: center;",
  },
  {
    name: "hangupCause",
    align: "left",
    label: t(""),
    field: "hangupCause",
    sortable: false,
  },
  {
    name: "hangupCauseQ850",
    align: "left",
    label: t(""),
    field: "hangupCauseQ850",
    sortable: false,
  },
  {
    name: "sipHangupDisposition",
    align: "left",
    label: t(""),
    field: "sipHangupDisposition",
    sortable: false,
  },
  {
    name: "recordPath",
    label: t("item.record"),
    field: "recordPath",
    align: "left",
    format: (v: string | undefined) => (v ? "/store/recordings/" + v : undefined),
    sortable: false,
    required: true,
  },
  {
    name: "actions",
    label: "",
    field: "actions",
    align: "right",
    sortable: false,
    required: true,
  },
]);
</script>
