import type { QTableProps } from "quasar";
import type { RouteRecordRaw } from "vue-router";
import { z, ZodType } from "zod";

export type Locale = "en" | "ru" | "es";

export type Role =
  | "no-roles"
  | "cc-manager"
  | "cc-operator-cold"
  | "cc-operator-hot"
  | "cc-operator-rejected"
  | "cpa-admin"
  | "cpa-advertiser"
  | "cpa-webmaster"
  | "crm-admin"
  | "crm-financier"
  | "dlv-courier"
  | "dlv-manager"
  | "pbx-admin"
  | "wh-manager"
  | "wh-operator";

export type MenuRouteRecordRaw = RouteRecordRaw & {
  role?: Role;
  label?: string;
  icon?: string;
  link?: string;
  tooltip?: string;
  separator?: boolean;
  default?: boolean;
  visible?: boolean;
  children?: MenuRouteRecordRaw[];
};

export type ViewState<TItem, TListItem, TSchema extends ZodType<any, any, any>> = {
  viewUrl: string;
  apiUrl: string;
  loading: boolean;
  pagination: QTableProps["pagination"];
  items: TListItem[];
  item: TItem;
  validationSchema: TSchema;
  validationErrors: Partial<Record<keyof z.infer<TSchema>, string>>;
};

export type AuthProviderConfig = {
  clientId: string;
  realm: string;
  authServerUri: string;
  accountUri: string;
  discoveryUri: string;
  tokenUri: string;
  introspectionUri: string;
  authorizationUri: string;
  jsonWebKeySetUri: string;
  userInfoUri: string;
  endSessionUri: string;
  issuer: string;
  supportedScopes: string[];
  propertyNames: string[];
};

export type SessionData = {
  name: string;
  locale: Locale;
  dark: string;
  pageSize: string;
  roles: Role[];
};

export enum Direction {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
  LOCAL = "local",
  ANY = "any",
}

export type DictionaryItem = {
  name: string;
  value: number | string;
  description?: string;
  isEnabled: boolean;
};

export type UserCacheItem = DictionaryItem & {
  externalId: string;
};

export type OrderedOptionItem = DictionaryItem & {
  order: number;
};

export type TimeZoneItem = DictionaryItem & {
  utc: string;
  allowed: boolean;
};
