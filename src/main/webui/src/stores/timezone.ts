import { defineStore } from "pinia";
import type { DictionaryItem } from "@/types";
import axiosInstance from "@/plugins/axios-instance";

export type TimezonesViewState = {
  apiUrl: string;
  dictionary: DictionaryItem[];
};

export const useTimezoneStore = defineStore("timezone", {
  state: (): TimezonesViewState => ({
    apiUrl: "/api/timezone",
    dictionary: [],
  }),

  getters: {
    sortedDictionary: (state) => {
      const enabled = state.dictionary
        .filter((item) => item.isEnabled)
        .sort((a, b) => a.name.localeCompare(b.name));
      const disabled = state.dictionary
        .filter((item) => !item.isEnabled)
        .sort((a, b) => a.name.localeCompare(b.name));
      return [...enabled, ...disabled];
    },
  },

  actions: {
    async init() {
      const response = await axiosInstance.get<DictionaryItem[]>(`${this.apiUrl}/dictionary`);
      this.dictionary = response.data;
    },
  },
});
