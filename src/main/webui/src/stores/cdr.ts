import type { QTableProps } from "quasar";
import type { CDRListFilter, CDRMessage, CDRsList } from "@/generated/protobuf/callmanager/cdr";
import { defineStore } from "pinia";
import axiosInstance from "@/plugins/axios-instance";
import { useAppStore } from "@/stores/app";
import dayjs from "dayjs";

export type CDRViewState = {
  viewUrl: string;
  apiUrl: string;
  loading: boolean;
  pagination: QTableProps["pagination"];
  items: CDRMessage[];
  filter: CDRListFilter;
  rawXml?: string;
};

export const useCDRStore = defineStore("cdr", {
  state: (): CDRViewState => {
    const $app = useAppStore();
    return {
      viewUrl: "/pbx-admin/journals/cdr",
      apiUrl: "/api/callmanager/cdr",
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
      items: [] as CDRMessage[],
      filter: {
        domainId: "",
        hostId: "",
        fromEpoch: dayjs.tz(dayjs().startOf("D"), $app.timezone).unix(),
        toEpoch: dayjs.tz(dayjs().endOf("D"), $app.timezone).unix(),
        userId: "",
        phoneNumberId: "",
        userSearch: "",
        phoneNumberSearch: "",
        direction: "",
      },
    };
  },
  persist: {
    pick: ["pagination.page", "pagination.rowsPerPage"],
  },

  actions: {
    async list() {
      this.loading = true;
      const response = await axiosInstance.post<CDRsList>(`${this.apiUrl}/list`, {
        pagination: {
          page: this.pagination?.page ? this.pagination?.page - 1 : 0,
          size: this.pagination?.rowsPerPage ? this.pagination?.rowsPerPage : 25,
        },
        filter: this.filter,
      });

      this.$patch({
        loading: false,
        items: response.data.items,
        pagination: {
          page: response.data.pagination?.page ? response.data.pagination?.page + 1 : 1,
          rowsPerPage: response.data.pagination?.size
            ? response.data.pagination?.size
            : this.pagination?.rowsPerPage,
          rowsNumber: response.data.pagination?.total ?? this.pagination?.rowsNumber,
        },
      });
    },

    async getRawXml(id: string) {
      const response = await axiosInstance.get(`${this.apiUrl}/get-raw-xml`, {
        params: { id },
      });
      this.rawXml = response.data;
    },
  },
});
