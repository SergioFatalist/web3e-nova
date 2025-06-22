import en from "@/i18n/messages/en.json";
import ru from "@/i18n/messages/ru.json";
import es from "@/i18n/messages/es.json";
import { createI18n } from "vue-i18n";

export default createI18n({
  legacy: false,
  globalInjection: true,
  fallbackLocale: "en",
  fallbackWarn: false,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: false,
  flatJson: true,
  messages: { en, ru, es },
});
