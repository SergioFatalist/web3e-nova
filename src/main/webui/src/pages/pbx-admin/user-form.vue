<template>
  <q-page padding>
    <q-toolbar class="q-px-none">
      <q-toolbar-title>
        <q-icon name="mdi-account-outline q-mr-sm" />
        {{ $t(edit ? "users.edit" : "users.create") }}
      </q-toolbar-title>
    </q-toolbar>
    <q-form @submit.prevent="$store.set">
      <q-card flat class="q-dark_bg">
        <q-card-section>
          <div class="q-gutter-md row">
            <div class="col">
              <q-input
                v-model="$store.item.name"
                :label="$t('user.username')"
                :error="!!$store.validationErrors.name"
                :error-message="$store.validationErrors.name"
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-input
                v-model="$store.item.password"
                :label="$t('user.password')"
                :error="!!$store.validationErrors.name"
                :error-message="$store.validationErrors.name"
                :type="showPassword ? 'text' : 'password'"
                dense
                outlined
              >
                <template #append>
                  <q-btn
                    :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    flat
                    dense
                    @click="showPassword = !showPassword"
                  />
                  <q-btn
                    icon="mdi-lock-reset"
                    flat
                    dense
                    @click="() => ($store.item.password = v4())"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="q-gutter-md row">
            <div class="col">
              <SelectDictionaryItem
                v-model="$store.item.contextId"
                :options="$contexts.dictionary"
                :label="$t('item.context')"
                :error="!!$store.validationErrors.contextId"
              />
            </div>
            <div class="col">
              <SelectDictionaryItem
                v-model="$store.item.groupIds"
                :options="$groups.dictionary"
                :label="$t('item.groups')"
                :error="!!$store.validationErrors.groupIds"
                multiple
              />
            </div>
          </div>
          <div class="q-gutter-md row">
            <div class="col">
              <q-input
                v-model="$store.item.description"
                :label="$t('item.description')"
                dense
                outlined
              />
            </div>
            <div class="col">
              <q-input
                v-model="$store.item.externalId"
                :label="$t('item.external-id')"
                disable
                dense
                outlined
              />
            </div>
          </div>
          <div class="q-gutter-md row">
            <div class="col">
              <q-checkbox v-model="$store.item.isEnabled" :label="$t('item.isEnabled')" />
            </div>
          </div>
        </q-card-section>
        <q-expansion-item expand-separator icon="mdi-code-brackets" :label="$t('params.label')">
          <OrderedNameValueListTable
            :items="$store.item.params"
            @add="$store.addParam"
            @del="$store.delParam"
            @step="$store.stepParam"
            @move="$store.moveParam"
          />
        </q-expansion-item>
        <q-expansion-item expand-separator icon="mdi-code-braces" :label="$t('variables.label')">
          <OrderedNameValueListTable
            :items="$store.item.variables"
            @add="$store.addVariable"
            @del="$store.delVariable"
            @step="$store.stepVariable"
            @move="$store.moveVariable"
          />
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
import FormCancel from "@/components/form/form-cancel.vue";
import FormSave from "@/components/form/form-save.vue";
import OrderedNameValueListTable from "@/components/ordered-name-value-list-table.vue";
import useQueryParam from "@/composables/useQueryParam";
import { randomString } from "remeda";
import { NIL, v4 } from "uuid";
import { computed, onMounted, ref } from "vue";
import { useContextStore } from "@/stores/context";
import { useDomainStore } from "@/stores/domain";
import { useUserStore } from "@/stores/user";
import { useGroupStore } from "@/stores/group";
import SelectDictionaryItem from "@/components/form/select-dictionary-item.vue";

const $store = useUserStore();
const $contexts = useContextStore();
const $domains = useDomainStore();
const $groups = useGroupStore();

const edit = computed(() => useQueryParam("action") == "edit");
const id = useQueryParam("id") ?? NIL;
const showPassword = ref(false);

onMounted(async () => {
  await Promise.all([
    $contexts.init(),
    $domains.init(),
    $groups.init(),
    edit.value ? $store.get(id) : $store.prepare(id),
  ]);
});
</script>
