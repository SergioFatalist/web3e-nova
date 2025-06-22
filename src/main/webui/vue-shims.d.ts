/* eslint-disable */
// @ts-ignore
/// <reference types="vite/client" />
/// <reference types="vue-i18n" />
/// <reference types="vite-plugin-vue-layouts/client" />

import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";
import "vite/client";
import "pinia";
import type {VueI18nTranslation} from "vue-i18n";
import type {Router} from "vue-router";


declare module "pinia" {
  export interface PiniaCustomProperties {
    $router: Router;
  }
  export interface GenericStoreDefinition {
    $router: Router;
  }
}

declare module "vue" {
  import type {DefineComponent} from "vue";
  type ComponentCustomOptions = _ComponentCustomOptions;
  interface ComponentCustomProperties extends _ComponentCustomProperties {
    $t: VueI18nTranslation;
  }
  const component: DefineComponent<{}, {}, any>;
}

declare module "*.vue" {
  import type {DefineComponent} from "vue";
  type ComponentCustomOptions = _ComponentCustomOptions;
  interface ComponentCustomProperties extends _ComponentCustomProperties {
    $t: VueI18nTranslation;
  }
  const component: DefineComponent<{}, {}, any>;
}

declare module "@vue/runtime-core" {
  type ComponentCustomOptions = _ComponentCustomOptions;
  interface ComponentCustomProperties extends _ComponentCustomProperties {
    $t: VueI18nTranslation;
  }
}

export {};
