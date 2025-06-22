<template>
  <q-table
    v-model:pagination="pagination"
    :rows="items"
    :columns="columns"
    :loading="loading"
    :rows-per-page-options="[5, 10, 15, 25, 50, 100]"
    row-key="id"
    disable-sort
    flat
    @request="$emit('request', $event.pagination)"
  >
    <template #header-cell-actions>
      <q-th auto-width class="text-center">
        {{ $t("actions.label") }}
        <q-btn class="q-ml-md" icon="sync" size="md" flat dense @click="emit('refresh')" />
      </q-th>
    </template>
    <template #body-cell-desc="{ row }">
      <q-td>
        {{
          row.desc && row.description?.length > props.descriptionLength
            ? `${row.description.substring(0, descriptionLength)}... `
            : row.desc
        }}
        <q-tooltip
          v-if="row.description && row.description?.length > props.descriptionLength"
          activator="parent"
          location="bottom"
          max-width="50%"
        >
          {{ row.desc }}
        </q-tooltip>
      </q-td>
    </template>
    <template #body-cell-isEnabled="{ row }">
      <q-td auto-width class="text-center">
        <TableToggleBool
          :bool="!!row.isEnabled"
          :disabled="loading"
          size="md"
          @click="$emit('toggle', row.id)"
        />
      </q-td>
    </template>
    <template #body-cell-actions="{ row }">
      <q-td auto-width class="actions-cell text-right">
        <slot name="extra-actions" :item="row"></slot>
        <slot name="actions">
          <ActionEdit :disabled="loading" size="md" @click="$emit('edit', row.id)" />
          <ActionDelete :disabled="loading" size="md" @click="onDeleteDialog(row.id)" />
        </slot>
      </q-td>
    </template>
  </q-table>
  <q-dialog v-model="deleteDialog">
    <q-card padding style="min-width: 50%">
      <q-card-section>
        <div class="text-h6 text-warning">{{ t("Warning") }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ t("Are you sure? This action cannot be undone!") }}
      </q-card-section>
      <q-card-actions>
        <q-space />
        <q-btn
          flat
          icon="mdi-close"
          color="primary"
          :label="$t('Cancel')"
          @click="deleteDialog = false"
        />
        <q-btn
          v-close-popup
          flat
          icon="mdi-check"
          color="positive"
          :label="$t('Ok')"
          @click="$emit('remove', current)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import ActionDelete from "@/components/actions/action-delete.vue";
import ActionEdit from "@/components/actions/action-edit.vue";
import TableToggleBool from "@/components/table/table-toggle-bool.vue";
import type { QTableProps } from "quasar";
import { NIL } from "uuid";
import { computed, type PropType, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emit = defineEmits<{
  request: [pagination: QTableProps["pagination"]];
  refresh: [];
  edit: [id: string];
  toggle: [id: string];
  remove: [id: string];
}>();

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  pagination: {
    type: Object as PropType<QTableProps["pagination"]>,
    required: true,
  },
  descriptionLength: {
    type: Number,
    required: false,
    default: 80,
  },
  extraColumns: {
    type: Array as PropType<QTableProps["columns"]>,
    required: false,
    default: () => [],
  },
});

const { items, loading, pagination, descriptionLength, extraColumns } = toRefs(props);

const current = ref<string>(NIL);
const deleteDialog = ref<boolean>(false);

const onDeleteDialog = (id: string) => {
  current.value = id;
  deleteDialog.value = true;
};

const columns = computed<QTableProps["columns"]>(() => [
  {
    name: "name",
    align: "left",
    label: t("label.name"),
    field: "name",
    sortable: false,
  },
  {
    name: "description",
    align: "left",
    label: t("label.description"),
    field: "description",
    sortable: false,
  },
  ...(extraColumns.value ?? []),
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
