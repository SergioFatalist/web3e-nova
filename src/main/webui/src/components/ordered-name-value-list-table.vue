<template>
  <q-table
    :rows="filtered"
    :columns="columns"
    :pagination="pagination"
    binary-state-sort
    disable-sort
    flat
    dense
  >
    <template #header-cell-name>
      <q-th class="text-left">
        <q-input v-model="filterName" :label="$t('item.name')" dense clearable />
      </q-th>
    </template>
    <template #header-cell-value>
      <q-th class="text-left">
        <q-input v-model="filterValue" :label="$t('item.value')" dense clearable />
      </q-th>
    </template>
    <template #header-cell-isEnabled>
      <q-th class="text-center">
        <q-checkbox v-model="filterEnabled" :label="$t('item.isEnabled')" dense />
      </q-th>
    </template>

    <template #header-cell-actions>
      <q-th auto-width class="text-center">
        {{ $t("actions.label") }}
        <q-btn class="q-ml-md" icon="add" size="sm" dense outline @click="emit('add')" />
      </q-th>
    </template>
    <template #body="{ row }">
      <q-tr>
        <q-td key="name">
          <q-icon
            name="mdi-tooltip-question-outline"
            size="xs"
            :color="row.description ? 'info' : 'transparent'"
          >
            <q-tooltip v-if="row.description" class="text-dark bg-info"
              >{{ row.description }}
            </q-tooltip>
          </q-icon>
          {{ row.name }}
          <q-popup-edit
            v-slot="scope"
            v-model="row.name"
            :validate="(v) => v && v.length > 0"
            fit
            auto-save
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              @close="scope.set"
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="value">
          {{ row.value && row.value.length > 30 ? row.value.substring(0, 30) + "..." : row.value }}
          <q-popup-edit
            v-slot="scope"
            v-model="row.value"
            :validate="(v) => v && v.length > 0"
            fit
            auto-save
          >
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
        <q-td key="order" class="text-right" auto-width>
          {{ row.order }}
          <q-popup-edit
            v-slot="scope"
            :model-value="row.order"
            :validate="(v) => v > 0"
            fit
            @update:model-value="$emit('move', row, $event)"
          >
            <q-input
              v-model.number="scope.value"
              dense
              autofocus
              @close="scope.set"
              @keyup.enter="scope.set"
            >
              <template #after>
                <q-btn
                  icon="mdi-close-circle-outline"
                  flat
                  dense
                  @click.stop.prevent="scope.cancel"
                />
                <q-btn
                  icon="mdi-check-circle-outline"
                  flat
                  dense
                  :disable="!scope.validate(scope.value) || scope.initialValue === scope.value"
                  @click.stop.prevent="scope.set"
                />
              </template>
            </q-input>
          </q-popup-edit>
        </q-td>
        <q-td key="actions" class="text-right no-wrap" auto-width>
          <q-btn
            icon="arrow_circle_up"
            color="info"
            flat
            dense
            :disabled="isFirst(row)"
            @click="emit('step', row, true)"
          >
            <q-tooltip class="bg-info text-dark">
              {{ $t("Move Up") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="arrow_circle_down"
            color="secondary"
            flat
            dense
            :disabled="isLast(row)"
            @click="emit('step', row, false)"
          >
            <q-tooltip class="bg-info text-dark">
              {{ $t("Move Down") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="delete"
            color="negative"
            class="q-ml-md"
            flat
            dense
            @click="emit('del', row)"
          >
            <q-tooltip class="bg-negative">
              {{ $t("Delete") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import TableToggleBool from "@/components/table/table-toggle-bool.vue";
import type { OrderedNameValueMessage } from "@/generated/protobuf/common/common";
import type { QTable, QTableProps } from "quasar";
import * as R from "remeda";
import { computed, type PropType, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits<{
  add: [];
  del: [item: OrderedNameValueMessage];
  step: [item: OrderedNameValueMessage, up: boolean];
  move: [item: OrderedNameValueMessage, order: number];
}>();

const props = defineProps({
  items: {
    type: Array as PropType<OrderedNameValueMessage[]>,
    required: true,
    default: () => [],
  },
  descriptionLength: {
    type: Number,
    required: false,
    default: 80,
  },
  title: String,
});

const { t } = useI18n();
const { items } = toRefs(props);

const filterEnabled = ref<boolean>(false);
const filterName = ref<string>("");
const filterValue = ref<string>("");

const pagination = ref<QTableProps["pagination"]>({
  page: 1,
  rowsPerPage: 25,
  sortBy: "order",
  descending: false,
});

const filtered = computed(() => {
  return props.items
    .filter((item) => (filterEnabled.value ? item.isEnabled : true))
    .filter((item) =>
      filterName.value && filterName.value.length > 0
        ? item.name.toLowerCase().includes(filterName.value.toLowerCase())
        : true
    )
    .filter((item) =>
      filterValue.value && filterValue.value.length > 0
        ? item.value?.toLowerCase().includes(filterValue.value.toLowerCase())
        : true
    );
});

const isFirst = (item: OrderedNameValueMessage) =>
  0 === R.findIndex(items.value, (i) => i.order === item.order);

const isLast = (item: OrderedNameValueMessage) =>
  items.value.length === 1 + R.findIndex(items.value, (i) => i.order === item.order);

const columns = computed<QTable["columns"]>(() => [
  {
    name: "name",
    field: "name",
    label: t("item.name"),
    align: "left",
  },
  {
    name: "value",
    field: "value",
    label: t("item.value"),
    align: "left",
  },
  {
    name: "isEnabled",
    field: "isEnabled",
    label: t("item.isEnabled"),
    align: "center",
  },
  {
    name: "order",
    field: "order",
    label: t("action.sort"),
    align: "center",
    sortable: true,
    sort: (a, b) => a - b,
  },
  {
    name: "actions",
    field: "actions",
    label: t("actions.label"),
    align: "right",
  },
]);
</script>
