import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-symbols-outlined/material-symbols-outlined.css";
import "@quasar/extras/material-symbols-sharp/material-symbols-sharp.css";
import "@quasar/extras/mdi-v7/mdi-v7.css";
import "quasar/src/css/index.sass";
import "@/assets/app.scss";

import App from "@/App.vue";
import i18n from "@/i18n";
import router from "@/router";
import { createVCodeBlock } from "@wdns/vue-code-block";
import { createPinia } from "pinia";
import peristedState from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";
import { Dark, Dialog, EventBus, Loading, Notify, Platform, Quasar } from "quasar";
import { createApp, markRaw } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const app = createApp(App);
const eventbus = new EventBus();

const pinia = createPinia();
pinia.use(({ store }) => {
  store.$router = markRaw(router);
  store.$eventbus = markRaw(eventbus);
  store.$t = markRaw(i18n.global.t);
});

pinia.use(peristedState);
pinia.use(
  PiniaSharedState({
    enable: false,
    initialize: false,
    type: "localstorage",
  })
);

app.use(pinia);
app.use(router);
app.use(i18n);

app.use(Quasar, {
  plugins: {
    Notify,
    Dark,
    Loading,
    Dialog,
    Platform,
  },
});

const codeBlock = createVCodeBlock({
  languages: ["xml"],
  indent: 2,
  highlightjs: true,
  persistentCopyButton: true,
});
app.use(codeBlock);

app.provide("$eventbus", eventbus);

app.mount("#app");
