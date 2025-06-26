import { IconHome } from "@tabler/icons-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    sublabel: false,
    icon: IconHome,
  },
  {
    label: "Inventory",
    sublabel: true,
    children: [
      {
        label: "Items",
        subLabel: "",
        href: "/items",
      },
    ],
  },
  {
    label: "Transactions",
    sublabel: true,
    icon: IconHome,
    children: [
      {
        label: "Purchases",
        subLabel: "",
        href: "/purchases",
      },
      {
        label: "Sales",
        subLabel: "",
        href: "/sales",
      },
      {
        label: "Adjustment",
        subLabel: "",
        href: "/adjustment",
      },
    ],
  },

  {
    label: "Tables",
    sublabel: true,
    icon: IconHome,
    children: [
      {
        label: "Customers",
        subLabel: "",
        href: "/customers",
      },
      {
        label: "Suppliers",
        subLabel: "",
        href: "/suppliers",
      },
      /*   {
        label: 'Item Groups',
        subLabel: '',
        href: '/itemgroups',
      }, */
      {
        label: "Groups",
        subLabel: "",
        href: "/groups",
      },
      {
        label: "Users",
        subLabel: "",
        href: "/users",
      },
      {
        label: "Audit Log",
        subLabel: "",
        href: "/auditlog",
      },
    ],
  },
  // {
  //   label: 'Settings',
  //   href: '/settings',
  //   sublabel: false,
  // },
];
