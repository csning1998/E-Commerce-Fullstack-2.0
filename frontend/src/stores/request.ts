import axios from "axios";

import overlayStore from "@/stores/overlay";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

console.log("baseURL", baseURL);

const request = axios.create({
    baseURL,
});

// We can use interceptor to change the request config before perform the request

request.interceptors.request.use((config: any): any => {
    const store = overlayStore();
    store.$state.overlay = true;
    config.headers.token = localStorage.getItem("token");
    return config;
});

// We also can use interceptor to modify the response after the request finished.

request.interceptors.response.use(
    (response: any): any => {
        const store = overlayStore();
        store.$state.overlay = false;
        if (response.data && response.data.payload) {
            return response.data.payload;
        } else {
            return response;
        }
    },
    function (error: any) {
        const store = overlayStore();
        store.$state.overlay = false;
        if (error.response.data.payload) {
            alert(error.response.data.payload);
        }

        return Promise.reject(error);
    },
);

export default request;
