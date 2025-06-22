import useAxiosError from "@/composables/useAxiosError";
import useSchemaDefault from "@/composables/useSchemaDefault";
import type { BaseItemMessage, BaseItemsList } from "@/generated/protobuf/common/common";
import axiosInstance from "@/plugins/axios-instance";
import type { DictionaryItem, ViewState } from "@/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import type { QTableProps } from "quasar";
import { clone, mapValues } from "remeda";
import { NIL } from "uuid";
import type { UnwrapRef } from "vue";
import { z } from "zod";
import type { ContextMessage } from "@/generated/protobuf/callmanager/context";
import { contextMessageSchema } from "@/generated/schema/callmanager/context";

export type ContextsViewState = ViewState<
  ContextMessage,
  BaseItemMessage,
  typeof contextMessageSchema
> & {
  dictionary: DictionaryItem[];
};

export const useContextStore = defineStore("context", {
  state: (): ContextsViewState => ({
    viewUrl: "/pbx-admin/configuration/context",
    apiUrl: "/api/callmanager/context",
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    items: [] as BaseItemMessage[],
    item: clone(useSchemaDefault(contextMessageSchema)),
    validationSchema: contextMessageSchema,
    validationErrors: {} as Partial<Record<keyof typeof contextMessageSchema, string>>,
    dictionary: [],
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
          Partial<Record<keyof typeof contextMessageSchema, string>>
        >;
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          this.validationErrors = error.errors.reduce(
            (acc, curr) => {
              const path = curr.path[0] as keyof z.infer<typeof contextMessageSchema>;
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

    async create() {
      this.item = clone(useSchemaDefault(contextMessageSchema));
      await this.$router.push(`${this.viewUrl}/create/${NIL}`);
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
        const response = await axiosInstance.post<ContextMessage>(`${this.apiUrl}/get`, { id });
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
  },
});
