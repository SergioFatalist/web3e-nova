import type { AuthProviderConfig, DictionaryItem, Locale, Role, SessionData } from "@/types";
import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import { useDomainStore } from "@/stores/domain";
import { useContextStore } from "@/stores/context";
import { useGatewayStore } from "@/stores/gateway";
import { useUserStore } from "@/stores/user";
import { useSipProfileStore } from "@/stores/sip-profile";
import { useTimezoneStore } from "@/stores/timezone";
import { useGroupStore } from "@/stores/group";

export interface AppState {
  name: string;
  dark: boolean;
  rail: boolean;
  pageSize: number;
  locale: Locale;
  timezone: string;
  role: Role;
  roles: Role[];
  authConfig: AuthProviderConfig | null;
  refreshInterval: number | null;
  dayOfWeek: DictionaryItem[];
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    name: "",
    dark: true,
    rail: true,
    pageSize: 25,
    locale: Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0] as Locale,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    role: "no-roles",
    roles: ["no-roles"],
    authConfig: null,
    refreshInterval: null,
    dayOfWeek: [
      { name: "any", value: -1, isEnabled: true },
      { name: "sun", value: 0, isEnabled: true },
      { name: "mon", value: 1, isEnabled: true },
      { name: "tue", value: 2, isEnabled: true },
      { name: "wed", value: 3, isEnabled: true },
      { name: "thu", value: 4, isEnabled: true },
      { name: "fri", value: 5, isEnabled: true },
      { name: "sat", value: 6, isEnabled: true },
    ],
  }),
  persist: {
    storage: localStorage,
    pick: ["name", "dark", "rail", "pageSize", "locale"],
  },
  share: {
    enable: true,
  },

  actions: {
    async init() {
      const endpoints = await axios.get<AuthProviderConfig>("/api/auth/endpoints");
      const { clientId, authServerUri, endSessionUri, authorizationUri } = endpoints.data;
      const redirectUri = encodeURIComponent(window.location.origin.toString());
      this.$patch({
        authConfig: {
          ...endpoints.data,
          accountUri: `${authServerUri}/account?referrer=${clientId}`,
          endSessionUri: `${endSessionUri}?client_id=${clientId}&redirect_url=${redirectUri}`,
          authorizationUri: `${authorizationUri}?client_id=${clientId}&redirect_url=${redirectUri}&response_type=code`,
        },
      });
      await this.refreshToken();
      this.startTokenRefresh();

      await Promise.all([
        useDomainStore().init(),
        useContextStore().init(),
        useGatewayStore().init(),
        useGroupStore().init(),
        useUserStore().init(),
        useSipProfileStore().init(),
        useTimezoneStore().init(),
      ]);
    },

    async refreshToken() {
      try {
        const response = await axios.get<SessionData>("/api/auth/session");
        this.$patch({
          name: response.data.name,
          dark: response.data.dark == "true",
          locale: response.data.locale,
          roles: response.data.roles,
          pageSize: parseInt(response.data.pageSize) ?? 25,
        });
      } catch (e) {
        if ((<AxiosError>e).response?.status === 401 && this.authConfig) {
          window.location.href = this.authConfig.authorizationUri;
        }
      }
    },

    async updateSession() {
      try {
        await axios.post("/api/auth/session", {
          locale: this.locale,
          pageSize: this.pageSize,
          dark: this.dark ? "true" : "false",
        });
      } catch (e) {
        console.error(e);
      }
    },

    startTokenRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
      this.refreshInterval = setInterval(() => this.refreshToken(), 30000);
    },

    stopTokenRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },

    async setLocale(locale: Locale) {
      this.locale = locale;
      await this.updateSession();
    },

    async toggleDark() {
      this.dark = !this.dark;
      await this.updateSession();
    },
  },
});
