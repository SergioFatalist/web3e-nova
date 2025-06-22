import { ccManagerRoutes } from "@/router/role-route/cc-manager.routes";
import { ccOperatorColdRoutes } from "@/router/role-route/cc-operator-cold.routes";
import { ccOperatorHotRoutes } from "@/router/role-route/cc-operator-hot.routes";
import { ccOperatorRejectedRoutes } from "@/router/role-route/cc-operator-rejected.routes";
import { cpaAdminRoutes } from "@/router/role-route/cpa-admin.routes";
import { cpaAdvertiserRoutes } from "@/router/role-route/cpa-advertiser.routes";
import { cpaWebmasterRoutes } from "@/router/role-route/cpa-webmaster.routes";
import { crmAdminRoutes } from "@/router/role-route/crm-admin.routes";
import { crmFinancierRoutes } from "@/router/role-route/crm-financier.routes";
import { dlvCourierRoutes } from "@/router/role-route/dlv-courier.routes";
import { dlvManagerRoutes } from "@/router/role-route/dlv-manager.routes";
import { noRolesRoutes } from "@/router/role-route/no-roles.routes";
import { pbxAdminRoutes } from "@/router/role-route/pbx-admin.routes";
import { whManagerRoutes } from "@/router/role-route/wh-manager.routes";
import { whOperatorRoutes } from "@/router/role-route/wh-operator.routes";
import type { MenuRouteRecordRaw } from "@/types";
import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";

export const routes: MenuRouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/index.vue"),
  },
  {
    role: "no-roles",
    path: "/no-roles",
    label: "no-roles.label",
    icon: "sym_o_question_mark",
    children: noRolesRoutes,
  },
  {
    role: "cc-manager",
    path: "/cc-manager",
    redirect: "/cc-manager/dashboard",
    label: "cc-manager.label",
    icon: "mdi-shield-crown-outline",
    visible: false,
    children: ccManagerRoutes,
  },
  {
    role: "cc-operator-cold",
    path: "/cc-operator-cold",
    redirect: "/cc-operator-cold/dashboard",
    label: "cc-operator-cold.label",
    icon: "headset_mic",
    visible: false,
    children: ccOperatorColdRoutes,
  },
  {
    role: "cc-operator-hot",
    path: "/cc-operator-hot",
    redirect: "/cc-operator-hot/dashboard",
    label: "cc-operator-hot.label",
    icon: "headset_mic",
    visible: false,
    children: ccOperatorHotRoutes,
  },
  {
    role: "cc-operator-rejected",
    path: "/cc-operator-rejected",
    redirect: "/cc-operator-rejected/dashboard",
    label: "cc-operator-rejected.label",
    icon: "headset_mic",
    visible: false,
    children: ccOperatorRejectedRoutes,
  },
  {
    role: "cpa-admin",
    path: "/cpa-admin",
    redirect: "/cpa-admin/dashboard",
    label: "cpa-admin.label",
    icon: "sym_o_security",
    visible: false,
    children: cpaAdminRoutes,
  },
  {
    role: "cpa-advertiser",
    path: "/cpa-advertiser",
    redirect: "/cpa-advertiser/dashboard",
    label: "cpa-advertiser.label",
    icon: "sym_o_security",
    visible: false,
    children: cpaAdvertiserRoutes,
  },
  {
    role: "cpa-webmaster",
    path: "/cpa-webmaster",
    redirect: "/cpa-webmaster/dashboard",
    label: "cpa-webmaster.label",
    icon: "sym_o_lightbulb_2",
    visible: false,
    children: cpaWebmasterRoutes,
  },
  {
    role: "crm-admin",
    path: "/crm-admin",
    redirect: "/crm-admin/dashboard",
    label: "cc-operator-cold.label",
    icon: "mdi-security",
    visible: false,
    children: crmAdminRoutes,
  },
  {
    role: "crm-financier",
    path: "/crm-financier",
    redirect: "/crm-financier/dashboard",
    label: "crm-financier.label",
    icon: "sym_o_account_balance",
    visible: false,
    children: crmFinancierRoutes,
  },
  {
    role: "dlv-courier",
    path: "/dlv-courier",
    redirect: "/dlv-courier/dashboard",
    label: "dlv-courier.label",
    icon: "sym_o_bike_lane",
    visible: false,
    children: dlvCourierRoutes,
  },
  {
    role: "dlv-manager",
    path: "/dlv-manager",
    redirect: "/dlv-manager/dashboard",
    label: "dlv-manager.label",
    icon: "sym_o_bike_lane",
    visible: false,
    children: dlvManagerRoutes,
  },
  {
    role: "pbx-admin",
    path: "/pbx-admin",
    label: "pbx-admin.label",
    icon: "sip",
    redirect: "/pbx-admin/dashboard",
    visible: true,
    children: pbxAdminRoutes,
  },
  {
    role: "wh-manager",
    path: "/wh-manager",
    redirect: "/wh-manager/dashboard",
    label: "wh-manager.label",
    icon: "sym_o_security",
    visible: false,
    children: whManagerRoutes,
  },
  {
    role: "wh-operator",
    path: "/wh-operator",
    redirect: "/wh-operator/dashboard",
    label: "wh-operator.label",
    icon: "sym_o_security",
    visible: false,
    children: whOperatorRoutes,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
});

export default router;
