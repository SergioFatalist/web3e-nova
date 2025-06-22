<template>
  <div class="row">
    <div class="q-pr-sm col-3">
      <q-input v-model="fromDate" :label="$t('filters.date-from')" dense outlined>
        <template #prepend>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy cover transition-hide="scale" transition-show="scale">
              <q-date
                v-model="fromDate"
                :mask="props.format"
                :options="disableNextDates"
                first-day-of-week="1"
                no-unset
                @update:model-value="setFromDate"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat :label="$t('Close')" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template #append>
          <q-icon class="cursor-pointer" name="access_time">
            <q-popup-proxy cover transition-hide="scale" transition-show="scale">
              <q-time v-model="fromDate" format24h mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat :label="$t('Close')" />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-pr-sm col-3">
      <q-input v-model="toDate" :label="$t('filters.date-to')" dense outlined>
        <template #prepend>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy cover transition-hide="scale" transition-show="scale">
              <q-date
                v-model="toDate"
                :mask="props.format"
                :options="disablePrevDates"
                first-day-of-week="1"
                no-unset
                @update:model-value="setToDate"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat :label="$t('Close')" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template #append>
          <q-icon class="cursor-pointer" name="access_time">
            <q-popup-proxy cover transition-hide="scale" transition-show="scale">
              <q-time v-model="toDate" format24h mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat :label="$t('Close')" />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-pr-sm col-3">
      <q-select
        v-model="tzone"
        :label="$t('item.timezone')"
        :options="props.timezones"
        option-label="name"
        option-value="value"
        map-options
        dense
        outlined
        emit-value
        @update:model-value="emit('update:tz', $event)"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section :class="scope.opt.isEnabled ? '' : 'text-grey'">
              <q-item-label>{{ scope.opt.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="q-pr-sm col-3">
      <q-btn-group outline flat spread class="full-width">
        <q-btn :label="$t('filters.day')" @click="setDay" />
        <q-btn :label="$t('filters.week')" @click="setWeek" />
        <q-btn :label="$t('filters.month')" @click="setMonth" />
      </q-btn-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ref } from "vue";
import type { DictionaryItem } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

const props = withDefaults(
  defineProps<{
    timezones: DictionaryItem[];
    tz?: string;
    fromEpoch?: number;
    toEpoch?: number;
    format?: string;
    filter?: object;
  }>(),
  {
    fromEpoch: 0,
    toEpoch: 0,
    format: "YYYY-MM-DD HH:mm",
  }
);

const emit = defineEmits<{
  (e: "update:from", value: number): void;
  (e: "update:to", value: number): void;
  (e: "update:tz", value: string): void;
}>();

const tzone = ref(props.tz ?? "Europe/London");
const fromDate = ref<string>(
  dayjs.tz(props.fromEpoch * 1000 || dayjs().startOf("D"), tzone.value).format(props.format)
);
const toDate = ref<string>(
  dayjs.tz(props.toEpoch * 1000 || dayjs().endOf("D"), tzone.value).format(props.format)
);

const disableNextDates = (date: string) => date <= dayjs().format("YYYY/MM/DD");
const disablePrevDates = (date: string) => date >= dayjs(fromDate.value).format("YYYY/MM/DD");

function setDay() {
  fromDate.value = dayjs
    .tz(dayjs().unix() * 1000, tzone.value)
    .subtract(1, "day")
    .set("hours", 0)
    .set("minute", 0)
    .format(props.format);
}

function setWeek() {
  fromDate.value = dayjs
    .tz(dayjs().unix() * 1000, tzone.value)
    .subtract(7, "day")
    .set("hours", 0)
    .set("minute", 0)
    .format(props.format);
}

function setMonth() {
  fromDate.value = dayjs
    .tz(dayjs().unix() * 1000, tzone.value)
    .subtract(1, "month")
    .set("hours", 0)
    .set("minute", 0)
    .format(props.format);
}

function setFromDate(val: string) {
  fromDate.value = dayjs
    .tz(val, tzone.value)
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0)
    .format(props.format);
  emit("update:from-epoch", dayjs(fromDate.value).unix());
}

function setToDate(val: string) {
  toDate.value = dayjs
    .tz(val, tzone.value)
    .set("hours", 23)
    .set("minutes", 59)
    .set("seconds", 59)
    .format(props.format);
  emit("update:to-epoch", dayjs(toDate.value).unix());
}
</script>
