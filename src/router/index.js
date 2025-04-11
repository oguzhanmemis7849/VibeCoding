import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import { ROUTE_NAME, MENU } from "@/constants";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MainLayout,
      name: ROUTE_NAME.MAIN_LAYOUT,
      children: [
        {
          path: "/:pathMatch(.*)*",
          name: ROUTE_NAME.NOT_FOUND,
          component: () => import("@/views/NotFound.vue"),
          meta: {
            showHeader: true,
            pageTitle: MENU.NOT_FOUND,
            breadcrumb: [
              { label: MENU.HOME, route: "/" },
              { label: MENU.NOT_FOUND, route: "/:pathMatch(.*)*" },
            ],
          },
        },
        {
          path: "",
          name: ROUTE_NAME.HOME,
          component: () => import("@/views/home/index.vue"),
          meta: {
            showHeader: false,
          },
        },
      ],
    },
  ],
});

export default router;
