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
import { groupMessageSchema } from "@/generated/schema/callmanager/group";
import type { GroupMessage } from "@/generated/protobuf/callmanager/group";
import type { UserMessage } from "@/generated/protobuf/callmanager/user";
import type { GatewayMessage } from "@/generated/protobuf/callmanager/gateway";

export type GroupsViewState = ViewState<
  GroupMessage,
  BaseItemMessage,
  typeof groupMessageSchema
> & {
  dictionary: DictionaryItem[];
};

export const useGroupStore = defineStore("group", {
  state: (): GroupsViewState => ({
    viewUrl: "/pbx-admin/directory/group",
    apiUrl: "/api/callmanager/group",
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    items: [] as BaseItemMessage[],
    item: clone(useSchemaDefault(groupMessageSchema)),
    validationSchema: groupMessageSchema,
    validationErrors: {} as Partial<Record<keyof typeof groupMessageSchema, string>>,
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
          Partial<Record<keyof typeof groupMessageSchema, string>>
        >;
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          this.validationErrors = error.errors.reduce(
            (acc, curr) => {
              const path = curr.path[0] as keyof z.infer<typeof groupMessageSchema>;
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
      await this.$router.push(`${this.viewUrl}/edit/${id ?? NIL}`);
    },

    async create() {
      this.item = clone(useSchemaDefault(groupMessageSchema));
      await this.$router.push(`${this.viewUrl}/create/${NIL}`);
    },

    async prepare() {
      this.item = clone(useSchemaDefault(groupMessageSchema));
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
        const response = await axiosInstance.post<GroupMessage>(`${this.apiUrl}/get`, { id });
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
