<script setup lang="ts">
import request from "../stores/request";
import { ref } from "vue";
import { useRouter } from "vue-router";
import RegisterForm from "@/components/auth/RegisterForm.vue";

const registrationFormData = ref<RegistrationFormData>({
   userId: "root7",
   userEmail: "nephew7.UncleRoger@noreply.gmail.com",
   userPassword: "1qazXSW@7",
   confirmPassword: "1qazXSW@7",
});

const router = useRouter();

const isVisible = ref(false);
const toggleVisibility = () => {
   isVisible.value = !isVisible.value;
};

const requiredRule = (value: string): true | string => {
   return !!value || "Required.";
};

const emailRule = (value: string): true | string => {
   const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   return (
      pattern.test(value) ||
      "You may evaluate if your input matches the email pattern."
   );
};

const passwordRule = (value: string): true | string => {
   const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
   return (
      pattern.test(value) ||
      "Min. 8 chars with at least one uppercase, one number, and one special character."
   );
};

const confirmPasswordRule = (value: string): boolean | string => {
   return (
      value === registrationFormData.value.userPassword ||
      "Passwords do not match."
   );
};

const userEmailRules = [requiredRule, emailRule];
const userPasswordRules = [requiredRule, passwordRule];
const confirmPasswordRules = [requiredRule, confirmPasswordRule];

const ajaxErrorHandler = (error: any) => {
   if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
   } else {
      console.error("Error", error);
   }
};
async function register(): Promise<void> {
   console.log("register function");
   try {
      const res = await request.post("/users/register", {
         userId: registrationFormData.value.userId,
         userEmail: registrationFormData.value.userEmail,
         userPassword: registrationFormData.value.userPassword,
         confirmPassword: registrationFormData.value.confirmPassword,
      });

      if (res.data.userPassword !== res.data.confirmPassword) {
         alert("Unmatched password. Please examine your password.");
      }

      await router.push("/login");
   } catch (error) {
      ajaxErrorHandler(error);
   }
}

function googleOAuth() {
   window.location.href = "http://localhost:3000/auth/google";
}

function githubOAuth() {
   window.location.href = "http://localhost:3000/auth/github";
}
</script>

<template>
   <RegisterForm
      :registrationFormData="registrationFormData"
      :isVisible="isVisible"
      :onToggleVisibility="toggleVisibility"
      :onGoogleOAuth="googleOAuth"
      :onGithubOAuth="githubOAuth"
      :userEmailRules="userEmailRules"
      :userPasswordRules="userPasswordRules"
      :confirmPasswordRules="confirmPasswordRules"
      :onSubmit="register"
   />
</template>

<style scoped></style>
