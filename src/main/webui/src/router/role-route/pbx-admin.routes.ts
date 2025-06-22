import type { MenuRouteRecordRaw } from "@/types";

export const pbxAdminRoutes: MenuRouteRecordRaw[] = [
  {
    label: "dashboard.label",
    tooltip: "dashboard.tooltip",
    icon: "dashboard",
    link: "/pbx-admin/dashboard",
    default: true,
    visible: true,
    path: "dashboard",
    component: () => import("@/pages/pbx-admin/dashboard.vue"),
  },
  {
    label: "configuration.label",
    tooltip: "configuration.tooltip",
    icon: "mdi-folder-cog-outline",
    link: "/pbx-admin/configuration",
    path: "configuration",
    visible: true,
    children: [
      {
        label: "hosts.label",
        tooltip: "hosts.tooltip",
        icon: "mdi-server-outline",
        link: "/pbx-admin/configuration/host/list",
        path: "host",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/hosts-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/host-form.vue"),
          },
        ],
      },
      {
        label: "contexts.label",
        tooltip: "contexts.tooltip",
        icon: "mdi-application-braces-outline",
        link: "/pbx-admin/configuration/context/list",
        path: "context",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/contexts-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/context-form.vue"),
          },
        ],
      },
      {
        label: "sip-profiles.label",
        tooltip: "sip-profiles.tooltip",
        icon: "mdi-artboard",
        link: "/pbx-admin/configuration/sip-profile/list",
        path: "sip-profile",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/sip-profiles-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/sip-profile-form.vue"),
          },
        ],
      },
      {
        label: "gateways.label",
        tooltip: "gateways.tooltip",
        icon: "mdi-router",
        link: "/pbx-admin/configuration/gateway/list",
        path: "gateway",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/gateways-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/gateway-form.vue"),
          },
        ],
      },
      {
        label: "acls.label",
        tooltip: "acls.tooltip",
        icon: "mdi-security-network",
        link: "/pbx-admin/configuration/acl/list",
        path: "acl",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/acls-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/acl-form.vue"),
          },
        ],
      },
    ],
  },
  {
    label: "directory.label",
    tooltip: "directory.label",
    icon: "mdi-folder-account-outline",
    link: "/pbx-admin/directory",
    path: "directory",
    visible: true,
    children: [
      {
        label: "domains.label",
        tooltip: "domains.tooltip",
        icon: "mdi-domain",
        link: "/pbx-admin/directory/domain/list",
        path: "domain",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/domains-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/domain-form.vue"),
          },
        ],
      },
      {
        label: "groups.label",
        tooltip: "groups.tooltip",
        icon: "mdi-account-multiple-outline",
        link: "/pbx-admin/directory/group/list",
        path: "group",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/groups-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/group-form.vue"),
          },
        ],
      },
      {
        label: "users.label",
        tooltip: "users.tooltip",
        icon: "mdi-account-outline",
        link: "/pbx-admin/directory/user/list",
        path: "user",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/users-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/user-form.vue"),
          },
        ],
      },
      {
        label: "phone-numbers.label",
        tooltip: "phone-numbers.tooltip",
        icon: "mdi-numeric",
        link: "/pbx-admin/directory/phone-number/list",
        path: "phone-number",
        visible: true,
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/phone-numbers-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/phone-number-form.vue"),
          },
        ],
      },
    ],
  },
  {
    label: "rules.label",
    tooltip: "rules.label",
    icon: "mdi-folder-network-outline",
    link: "/pbx-admin/rule",
    path: "rule",
    visible: true,
    children: [
      {
        label: "schedules.label",
        tooltip: "schedules.label",
        icon: "mdi-invoice-text-clock-outline",
        link: "/pbx-admin/rule/schedule/list",
        visible: true,
        path: "schedule",
        children: [
          {
            path: "list",
            visible: false,
            component: () => import("@/pages/pbx-admin/schedules-list.vue"),
          },
          {
            path: ":action/:id",
            visible: false,
            component: () => import("@/pages/pbx-admin/schedule-form.vue"),
          },
        ],
      },
    ],
  },
  {
    label: "journals.label",
    tooltip: "journals.label",
    icon: "mdi-view-list-outline",
    link: "/pbx-admin/journals",
    path: "journals",
    visible: true,
    children: [
      {
        label: "cdr.list.label",
        tooltip: "cdr.list.label",
        icon: "mdi-phone-log-outline",
        link: "/pbx-admin/journals/cdr",
        visible: true,
        path: "cdr",
        component: () => import("@/pages/pbx-admin/cdr.vue"),
      },
    ],
  },
  {
    label: "status.title",
    tooltip: "status.tooltip",
    icon: "mdi-list-status",
    link: "/pbx-admin/status",
    path: "status",
    children: [
      {
        label: "freeswitch.status.title",
        tooltip: "freeswitch.status.tooltip",
        icon: "mdi-phone-log-outline",
        link: "/pbx-admin/status/freeswitch",
        path: "status",
        visible: true,
        component: () => import("@/pages/pbx-admin/status.vue"),
      },
    ],
  },
];
