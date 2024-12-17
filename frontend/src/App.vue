<script setup lang="ts">
import Navbar from "@/components/common/Navbar.vue";
import Footer from "@/components/common/Footer.vue";
import { computed } from "vue";
import overlayStore from "@/stores/overlay";

const store = overlayStore();
const overlay = computed(() => store.overlay);
</script>

<template>
   <div>
      <!-- Navbar Component -->
      <Navbar />

      <!-- Hero Section -->
      <router-view />

      <!-- Footer Component -->
      <Footer />

      <v-overlay v-model="overlay"></v-overlay>
      <span v-if="overlay" class="loader"></span>
   </div>
</template>

<style scoped>
.loader {
   position: fixed;
   top: 50%;
   left: 50%;
   width: 48px;
   height: 48px;
   border: 5px solid #fff;
   border-bottom-color: transparent;
   border-radius: 50%;
   display: inline-block;
   box-sizing: border-box;
   animation: rotation 1s linear infinite;
}

@keyframes rotation {
   0% {
      transform: rotate(0deg);
   }
   100% {
      transform: rotate(360deg);
   }
}
</style>
