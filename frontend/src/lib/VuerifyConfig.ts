import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import type { ThemeDefinition } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

const darkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: "#bb86fc",
        secondary: "#03dac6",
        background: "#121212",
        surface: "#1e1e1e",
        error: "#cf6679",
        "on-primary": "#000000",
        "on-secondary": "#000000",
        "on-background": "#ffffff",
        "on-surface": "#ffffff",
    },
};

export const vuetifyConfig = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: "dark",
        themes: {
            dark: darkTheme,
        },
    },
});
