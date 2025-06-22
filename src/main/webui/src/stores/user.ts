import useAxiosError from "@/composables/useAxiosError";
import useSchemaDefault, { getSchemaDefault } from "@/composables/useSchemaDefault";
import useStoreActions from "@/composables/useStoreActions";
import type {
  BaseItemMessage,
  BaseItemsList,
  OrderedNameValueMessage,
} from "@/generated/protobuf/common/common";
import { orderedNameValueMessageSchema } from "@/generated/schema/common/common";
import axiosInstance from "@/plugins/axios-instance";
import type { DictionaryItem, ViewState } from "@/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import type { QTableProps } from "quasar";
import { clone, mapValues } from "remeda";
import { NIL } from "uuid";
import type { UnwrapRef } from "vue";
import { z } from "zod";
import type { UserMessage } from "@/generated/protobuf/callmanager/user";
import { userMessageSchema } from "@/generated/schema/callmanager/user";

export type UsersViewState = ViewState<UserMessage, BaseItemMessage, typeof userMessageSchema> & {
  dictionary: DictionaryItem[];
  candidates: DictionaryItem[];
};

export const useUserStore = defineStore("user", {
  state: (): UsersViewState => ({
    viewUrl: "/pbx-admin/directory/user",
    apiUrl: "/api/callmanager/user",
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    items: [] as BaseItemMessage[],
    item: clone(useSchemaDefault(userMessageSchema)),
    validationSchema: userMessageSchema,
    validationErrors: {} as Partial<Record<keyof typeof userMessageSchema, string>>,
    dictionary: [],
    candidates: [],
  }),
  persist: {
    pick: ["pagination.page", "pagination.rowsPerPage"],
  },

  actions: {
    async init() {
      const response = await axiosInstance.get<DictionaryItem[]>(`${this.apiUrl}/dictionary`);
      this.dictionary = response.data;
    },

    async validateForm() {
      try {
        this.validationSchema.parse(
          mapValues<object, unknown>(this.item, (v) =>
            typeof v == "string" && (<string>v).length == 0 ? undefined : v
          )
        );
        this.validationErrors = {} as UnwrapRef<
          Partial<Record<keyof typeof userMessageSchema, string>>
        >;
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          this.validationErrors = error.errors.reduce(
            (acc, curr) => {
              const path = curr.path[0] as keyof z.infer<typeof userMessageSchema>;
              acc[path] = curr.message;
              return acc;
            },
            {} as typeof this.validationErrors
          );
        }
        return false;
      }
    },

    async edit(id: string) {
      await this.$router.push(`${this.viewUrl}/edit/${id}`);
    },

    async create(id: string) {
      await this.$router.push(`${this.viewUrl}/create/${id}`);
    },

    async prepare(id: string) {
      const response = await axiosInstance.get<UserMessage>(`${this.apiUrl}/prepare/${id}`);
      this.item = response.data;
    },

    async cancel() {
      await this.$router.push(`${this.viewUrl}/list`);
    },

    async load(pagination: QTableProps["pagination"]) {
      this.$patch({
        pagination,
      });
      await this.list();
    },

    async list() {
      try {
        this.loading = true;
        const response = await axiosInstance.post<BaseItemsList>(`${this.apiUrl}/list`, {
          pagination: {
            page: this.pagination?.page ? this.pagination?.page - 1 : 0,
            size: this.pagination?.rowsPerPage ? this.pagination?.rowsPerPage : 25,
          },
        });

        this.$patch({
          loading: false,
          items: response.data.items,
          pagination: {
            page: response.data.pagination?.page ? response.data.pagination?.page + 1 : 1,
            rowsPerPage: response.data.pagination?.size
              ? response.data.pagination?.size
              : this.pagination?.rowsPerPage,
            rowsNumber: response.data.pagination?.total
              ? response.data.pagination?.total
              : this.pagination?.rowsNumber,
          },
        });
      } catch (e) {
        useAxiosError(<AxiosError>e);
      } finally {
        this.loading = false;
      }
    },

    async get(id: string) {
      try {
        if (id == NIL) return;
        const response = await axiosInstance.post<UserMessage>(`${this.apiUrl}/get`, { id });
        this.$patch({
          item: response.data,
        });
      } catch (e) {
        useAxiosError(<AxiosError>e);
      } finally {
        this.loading = false;
      }
    },

    async set() {
      const valid = await this.validateForm();
      if (!valid) return;
      try {
        await axiosInstance.post(`${this.apiUrl}/set`, this.item);
        await this.cancel();
      } catch (e) {
        useAxiosError(<AxiosError>e);
      } finally {
        this.loading = false;
      }
    },

    async toggle(id: string) {
      this.loading = true;
      try {
        await axiosInstance.post(`${this.apiUrl}/toggle`, { id });
        await this.list();
      } catch (e) {
        useAxiosError(<AxiosError>e);
      } finally {
        this.loading = false;
      }
    },

    async remove(id: string) {
      try {
        this.loading = true;
        await axiosInstance.post(`${this.apiUrl}/remove`, { id });
        await this.list();
      } catch (e) {
        useAxiosError(<AxiosError>e);
      } finally {
        this.loading = false;
      }
    },

    addVariable() {
      useStoreActions.addOrderedItem(
        this.item.variables,
        getSchemaDefault(orderedNameValueMessageSchema)
      );
    },

    delVariable(row: OrderedNameValueMessage) {
      useStoreActions.delOrderedItem(this.item.variables, row);
    },

    stepVariable(row: OrderedNameValueMessage, up: boolean) {
      useStoreActions.stepOrderedItem(this.item.variables, row, up);
    },

    moveVariable(row: OrderedNameValueMessage, newOrder: number): void {
      useStoreActions.moveOrderedItem(this.item.variables, row, newOrder);
    },

    addParam() {
      useStoreActions.addOrderedItem(
        this.item.params,
        getSchemaDefault(orderedNameValueMessageSchema)
      );
    },

    delParam(row: OrderedNameValueMessage) {
      useStoreActions.delOrderedItem(this.item.params, row);
    },

    stepParam(row: OrderedNameValueMessage, up: boolean) {
      useStoreActions.stepOrderedItem(this.item.params, row, up);
    },

    moveParam(row: OrderedNameValueMessage, newOrder: number): void {
      useStoreActions.moveOrderedItem(this.item.params, row, newOrder);
    },

    async loadCandidates() {
      const response = await axiosInstance.get<DictionaryItem[]>(`${this.apiUrl}/candidates`);
      if (response && response.data) {
        this.candidates = response.data;
      }
    },
  },
});
