<script setup lang="ts">
import request from "../stores/request";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginForm from "@/components/auth/LoginForm.vue";

const router = useRouter();
const route = useRoute();

const isVisible = ref(false);

// Function to toggle visibility
const toggleVisibility = (): void => {
   isVisible.value = !isVisible.value;
   console.log("isVisible.value", isVisible.value);
};

const loginFormData = ref<LoginFormData>({
   userId: "nephew.UncleRoger@noreply.gmail.com",
   userPassword: "1qazXSW@",
});

const ajaxErrorHandler = (error: any) => {
   if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
   } else {
      console.error("Error", error);
   }
};

async function login(): Promise<void> {
   try {
      const res = await request.post("/users/login", {
         userId: loginFormData.value.userId,
         userPassword: loginFormData.value.userPassword,
      });

      // Save the token of login
      localStorage.setItem("token", res.data.token);

      // Set the token into default header.
      request.defaults.headers.common["CommerceAuthToken"] = res.data.token;

      window.dispatchEvent(new CustomEvent("userLoggedIn")); // Dispatch the event

      alert("Login successfully");
      console.log("isLoggedIn", localStorage.getItem("isLoggedIn"));

      if (route.query && route.query.redirectTo) {
         // @ts-ignore
         await router.push(route.query.redirectTo);
      } else {
         await router.push("/");
      }
   } catch (error) {
      ajaxErrorHandler(error);
   }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function googleOAuth() {
   window.location.href = BASE_URL + "/auth/google";
}

function githubOAuth() {
   window.location.href = BASE_URL + "/auth/github";
}
</script>

<template>
   <LoginForm
      :loginFormData="loginFormData"
      :isVisible="isVisible"
      :onToggleVisibility="toggleVisibility"
      :onGoogleOAuth="googleOAuth"
      :onGithubOAuth="githubOAuth"
      :onSubmit="login"
   />
</template>

<style scoped></style>
