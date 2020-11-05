const Menu = [
  {
    name: "Dashboard",
    icon: "fas fa-home",
    path: "/dashboard",
    translate: "sidebar.nav.DASHBOARD",
    label: { value: 3, color: "success" },
  },
  {
    name: "Pending Calls",
    icon: "fas fa-phone-alt",
    label: { value: 30, color: "success" },
    path: "/pendingCalls",
    translate: "sidebar.nav.PENDINGCALLS",
  },
  {
    name: "To-Do",
    icon: "fas fa-tasks",
    path: "/toDo",
    translate: "sidebar.nav.TODO",
  },
  {
    name: "Cadences",
    // icon: "fas fa-rocket",
    icon: 'svgicon trucadence-icon',
    path: "/cadences",
    translate: "sidebar.nav.CADENCES",
  },
  {
    name: "Prospects",
    icon: "fas fa-user",
    path: "/prospects",
    translate: "sidebar.nav.PROSPECTS",
  },
  {
    name: "Accounts",
    icon: "far fa-building",
    path: "/accounts",
    translate: "sidebar.nav.ACCOUNTS",
    
  },
  {
    name: "Templates",
    icon: "fas fa-envelope",
    path: "/templates",
    translate: "sidebar.nav.TEMPLATES",
  },
  {
    name: "Reports",
    icon: "fas fa-chart-bar",
    path: "/reports",
    translate: "sidebar.nav.REPORTS",
  },
  {
    name: "Settings",
    icon: "fas fa-cog",
    path: "/settings",
    translate: "sidebar.nav.SETTINGS",
  },
];

export default Menu;
