<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-invoice-text-clock-outline q-mr-sm" />
        {{ $t(edit ? "schedule.edit" : "schedule.create") }}
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
                v-model="$store.item.timezone"
                :label="$t('label.timezone')"
                :options="$timezone.sortedDictionary"
                option-label="name"
                option-value="value"
                map-options
                emit-value
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-checkbox v-model="$store.item.isEnabled" :label="$t('label.enabled')" />
            </div>
          </div>
        </q-card-section>
        <q-expansion-item
          :label="$t('periods.label')"
          icon="mdi-calendar-week-outline"
          default-opened
          expand-separator
        >
          <q-table
            :columns="columns"
            :rows="$store.item.periods"
            :sort-method="undefined"
            :pagination="{
              rowsPerPage: 0,
              sortBy: 'order',
              descending: false,
            }"
            binary-state-sort
            hide-pagination
            disable-sort
            dense
            flat
          >
            <template #header>
              <q-tr>
                <q-th>{{ $t("label.exact") }}</q-th>
                <q-th colspan="2">{{ $t("label.begin") }}</q-th>
                <q-th colspan="2">{{ $t("label.end") }}</q-th>
                <q-th>{{ $t("label.enabled") }}</q-th>
                <q-th class="text-right">
                  {{ $t("label.actions") }}
                  <q-btn
                    class="q-ml-md"
                    icon="add"
                    size="sm"
                    dense
                    outline
                    @click="$store.addPeriod"
                  />
                </q-th>
              </q-tr>
            </template>
            <template #body="{ row }">
              <q-tr>
                <q-td class="text-center" auto-width>
                  <q-checkbox v-model="row.isExact" size="xs" />
                </q-td>
                <q-td width="20%">
                  <q-input v-if="row.isExact" v-model="row.beginDate" mask="date" dense outlined>
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="row.beginDate" flat minimal />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-select
                    v-else
                    v-model="row.beginDay"
                    :label="$t('label.dayOfWeek')"
                    :options="$app.dayOfWeek"
                    :option-label="(i) => $t(`dictionaries.dayOfWeek.${i.name}`)"
                    :option-value="(i) => i.value"
                    map-options
                    emit-value
                    dense
                    outlined
                  />
                </q-td>
                <q-td width="20%">
                  <q-input v-model="row.beginTime" mask="time" dense outlined>
                    <template #append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="row.beginTime" format24h now-btn flat minimal />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-td>
                <q-td width="20%">
                  <q-input v-if="row.isExact" v-model="row.endDate" mask="date" dense outlined>
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="row.endDate" flat minimal />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-select
                    v-else
                    v-model="row.endDay"
                    :label="$t('label.dayOfWeek')"
                    :options="$app.dayOfWeek"
                    :option-label="(i) => $t(`dictionaries.dayOfWeek.${i.name}`)"
                    :option-value="(i) => i.value"
                    map-options
                    emit-value
                    dense
                    outlined
                  />
                </q-td>
                <q-td width="20%">
                  <q-input v-model="row.endTime" mask="time" dense outlined>
                    <template #append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="row.endTime" format24h now-btn flat minimal />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-td>
                <q-td class="text-center" auto-width>
                  <q-checkbox v-model="row.isEnabled" size="xs" />
                </q-td>
                <q-td class="text-right">
                  <ActionDelete size="md" @click="$store.removePeriod(row)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
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
import ActionDelete from "@/components/actions/action-delete.vue";
import FormCancel from "@/components/form/form-cancel.vue";
import FormSave from "@/components/form/form-save.vue";
import useQueryParam from "@/composables/useQueryParam";
import { useAppStore } from "@/stores/app";
import { useScheduleStore } from "@/stores/schedule";
import type { QTable, QTableProps } from "quasar";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useTimezoneStore } from "@/stores/timezone";

const { t } = useI18n();
const $app = useAppStore();
const $store = useScheduleStore();
const $timezone = useTimezoneStore();
const id = useQueryParam("id") ?? "list";
const edit = computed<boolean>(() => useQueryParam("action") == "edit");

onMounted(async () => {
  await $timezone.init();
  if (edit.value) {
    await $store.get(id);
  }
});

const columns = computed<QTableProps["columns"]>(() => [
  {
    name: "isExact",
    align: "center",
    label: t("label.exact"),
    field: "isExact",
    sortable: false,
  },
  {
    name: "begin",
    align: "left",
    label: t("label.begin"),
    field: "",
    sortable: false,
  },
  {
    name: "end",
    align: "left",
    label: t("label.end"),
    field: "",
    sortable: false,
  },
  {
    name: "isEnabled",
    align: "center",
    label: t("label.enabled"),
    field: "isEnabled",
    sortable: false,
  },
  {
    name: "actions",
    align: "center",
    label: t("label.actions"),
    field: "actions",
  },
]);
</script>
