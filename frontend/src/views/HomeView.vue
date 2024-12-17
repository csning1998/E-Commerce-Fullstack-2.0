<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import ProductCardVertical from "@/components/product/ProductCardVertical.vue";
import HeroSection from "@/components/common/HeroSection.vue";
import request from "../stores/request";

let products = ref([]);
onMounted(async () => {
   products.value = await request.get("/products");
});
</script>

<template>
   <div id="app">
      <section class="hero-section">
         <HeroSection />
      </section>

      <!-- ProductCard Section -->
      <section class="categories">
         <ProductCardVertical :products="products" />
      </section>
   </div>
</template>

<style scoped></style>
