// src/main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import AppComponent from "./App.vue";
import router from "./router";

import "./assets/theme.css";
import "./assets/base.css";
import "./assets/hero-section.css";
import "./assets/categories.css";
import "./assets/form.css";
import "./assets/button.css";
import "vue-final-modal/style.css";

// Import Vuetify
import { vuetifyConfig } from "@/lib/VuerifyConfig";

// Import FontAwesome Icon Component
import FontAwesomeIcon from "@/lib/FortAwesomeIcon";

const app = createApp(AppComponent);

// Register global plugins
app.use(createPinia());
app.use(router);
app.use(vuetifyConfig);

// Register FontAwesomeIcon globally
app.component("fa", FontAwesomeIcon);

app.mount("#app");
