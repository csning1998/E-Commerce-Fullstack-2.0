import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("overlay", {
    state: () => {
        return {
            overlay: ref(false),
        };
    },
});
