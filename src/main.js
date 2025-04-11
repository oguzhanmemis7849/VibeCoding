import "@/assets/styles/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { setupPrimeVue } from "@Sompo-Sigorta-A-S/sompo-ui-kit";
import Icon from "@/components/Icon.vue";
import App from "./App.vue";
import router from "./router";
import { useGlobalConfirmation, useGlobalToast } from "@/plugins";

const app = createApp(App);
setupPrimeVue(app, {}, { darkModeSelector: ".theme-dark" });

app.use(createPinia());
app.use(router);
app.component("Icon", Icon);

const toastPlugin = useGlobalToast(app);
app.config.globalProperties.$toast = toastPlugin;

const confirmationPlugin = useGlobalConfirmation(app);
app.config.globalProperties.$confirm = confirmationPlugin;

app.mount("#app");
