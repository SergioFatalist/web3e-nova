<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered height-hint="98" class="bg-dark">
      <q-toolbar>
        <q-btn
          dense
          flat
          :icon="$app.rail ? 'sym_o_expand_content' : 'sym_o_collapse_content'"
          round
          @click="$app.rail = !$app.rail"
        />

        <q-toolbar-title>
          <router-link to="/">
            <img class="logo" src="/logo.svg" height="24" alt="Logo" />
          </router-link>
        </q-toolbar-title>

        <q-btn icon="mdi-theme-light-dark" flat @click="$app.toggleDark" />

        <!-- Languages Menu  -->
        <q-btn flat icon="language" :label="locale">
          <q-menu anchor="top end" self="bottom end">
            <q-item
              v-for="item in localeOptions"
              :key="item.value"
              v-close-popup
              clickable
              @click="$app.setLocale(item.value)"
            >
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-menu>
        </q-btn>

        <!-- User Roles Menu  -->
        <q-btn
          :label="$t(currentRoleItem?.label || '')"
          :icon="currentRoleItem?.icon"
          :disable="rolesMenu.length == 1"
          flat
        >
          <q-menu anchor="top end" self="bottom end">
            <q-item
              v-for="role in rolesMenu"
              v-close-popup
              clickable
              class="text-uppercase"
              :to="role.path"
              :active="$app.role == role.role"
              @click="() => ($app.role = role.role!)"
            >
              <q-item-section no-wrap>
                <q-item-label>
                  <q-icon :name="role.icon" left />
                  {{ $t(role.label || "") }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-menu>
        </q-btn>

        <!-- User Profile -->
        <q-btn icon="mdi-account-circle-outline" :label="$app.name" flat>
          <q-menu anchor="top end" self="bottom end">
            <q-item v-close-popup clickable :href="$app.authConfig?.accountUri">
              <q-item-section no-wrap>
                <q-item-label>
                  <q-icon name="mdi-cog-outline" left />
                  {{ $t("profile.label") }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-close-popup clickable :href="$app.authConfig?.endSessionUri">
              <q-item-section no-wrap>
                <q-item-label>
                  <q-icon name="mdi-logout" left />
                  {{ $t("signout.label") }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer
      :mini="$app.rail"
      :breakpoint="0"
      class="column justify-between no-wrap"
      bordered
      show-if-above
    >
      <q-list v-if="drawerMenu && drawerMenu.length > 0">
        <template v-for="menuItem in drawerMenu">
          <template v-if="!!menuItem.visible && $app.rail">
            <q-item
              v-if="!menuItem.children && !menuItem.separator"
              :to="menuItem.link"
              :active="active(menuItem.link)"
            >
              <q-item-section avatar class="q-mr-none">
                <q-icon :name="menuItem.icon" />
                <q-tooltip
                  v-if="$app.rail && menuItem.tooltip"
                  anchor="center left"
                  self="center right"
                >
                  {{ $t(menuItem.tooltip) }}
                </q-tooltip>
              </q-item-section>
              <q-item-section>
                {{ $t(menuItem.label || "") }}
              </q-item-section>
            </q-item>
            <q-item
              v-else-if="menuItem.children && !menuItem.separator"
              :active="active(menuItem.link)"
              :label="$t(menuItem.label ?? '')"
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
                <q-tooltip v-if="menuItem.tooltip" anchor="center left" self="center right">
                  {{ $t(menuItem.tooltip) }}
                </q-tooltip>
              </q-item-section>
              <q-item-section>
                {{ $t(menuItem.label ?? "") }}
              </q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
              <q-menu anchor="top end" self="top start">
                <template v-for="subItem in menuItem.children">
                  <q-item v-if="!!subItem.visible" :to="subItem.link">
                    <q-item-section avatar>
                      <q-icon :name="subItem.icon" />
                    </q-item-section>
                    <q-item-section>
                      {{ $t(subItem.label ?? "") }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-menu>
            </q-item>
            <q-separator v-else-if="menuItem.separator" />
          </template>
          <template v-else-if="!!menuItem.visible">
            <q-item
              v-if="!menuItem.children && !menuItem.separator"
              :to="menuItem.link"
              :active="active(menuItem.link)"
            >
              <q-item-section avatar class="q-mr-none">
                <q-icon :name="menuItem.icon" />
                <q-tooltip
                  v-if="$app.rail && menuItem.tooltip"
                  anchor="center left"
                  self="center right"
                >
                  {{ $t(menuItem.tooltip) }}
                </q-tooltip>
              </q-item-section>
              <q-item-section>
                {{ $t(menuItem.label || "") }}
              </q-item-section>
            </q-item>
            <q-expansion-item
              v-else
              group="rolemenu"
              :icon="menuItem.icon"
              :label="$t(menuItem.label || '')"
              :default-opened="active(menuItem.link)"
              :header-class="active(menuItem.link) ? 'q-router-link--active' : ''"
            >
              <q-list>
                <template v-for="subItem in menuItem.children">
                  <q-item v-if="!!subItem.visible" :to="subItem.link" class="q-pl-xl">
                    <q-item-section avatar>
                      <q-icon :name="subItem.icon" />
                    </q-item-section>
                    <q-item-section>
                      {{ $t(subItem.label ?? "") }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-expansion-item>
          </template>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { routes } from "@/router";
import { useAppStore } from "@/stores/app";
import type { Locale } from "@/types";
import { computed, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { locale } = useI18n({ useScope: "global" });
const $app = useAppStore();
const $route = useRoute();

const rolesMenu = computed(() => routes.filter((r) => !!r.visible && !!r.role && !!r.children));
const drawerMenu = computed(() => rolesMenu.value.find((r) => r.role == $app.role)?.children ?? []);
const currentRoleItem = computed(() => rolesMenu.value.find((r) => r.role == $app.role));

const active = (link?: string) => $route.matched.some((l) => l.path == link);

const localeOptions: { value: Locale; label: string }[] = [
  { value: "en", label: "EN - English" },
  { value: "es", label: "ES - Español" },
  { value: "ru", label: "RU - Русский" },
];

onBeforeMount(() => {
  const defaultRole = rolesMenu.value[0]?.role;
  if ($app.role == "no-roles" && defaultRole) {
    $app.role = defaultRole;
  }
});
</script>

<style>
.logo {
  vertical-align: middle;
  margin-top: -4px;
}
</style>
