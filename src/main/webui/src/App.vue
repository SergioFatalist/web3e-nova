<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { type QuasarLanguage, useQuasar } from "quasar";
import { useAppStore } from "@/stores/app";
import { onBeforeMount } from "vue";
import ru from "quasar/lang/ru";
import en from "quasar/lang/en-US";
import es from "quasar/lang/es";
import { useI18n } from "vue-i18n";

const langmap = new Map([
  ["en", en],
  ["ru", ru],
  ["es", es],
]);
const $app = useAppStore();
const $q = useQuasar();
const { locale } = useI18n({ useScope: "global" });

const cb = async () => {
  $q.lang.set(<QuasarLanguage>langmap.get($app.$state.locale));
  $q.dark.set($app.$state.dark);
  locale.value = $app.$state.locale;
};

$app.$subscribe(async () => await cb(), { deep: true, detached: true });

onBeforeMount($app.init);
</script>
