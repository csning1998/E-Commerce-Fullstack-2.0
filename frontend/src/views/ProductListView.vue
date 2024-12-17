<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import ProductCardHorizontal from "@/components/product/ProductCardHorizontal.vue";
import request from "../stores/request";

let products = ref([]);
onMounted(async () => {
   products.value = await request.get("/products");
});

import overlayStore from "@/stores/overlay";
const store = overlayStore();
const overlay = computed(() => store.overlay);
</script>

<template>
   <ProductCardHorizontal v-if="products.length > 0" :products="products" />

   <h1 v-if="!overlay && products.length === 0">There is no product on sale</h1>
</template>

<style scoped>
/* body {
    font-size: 60px;
  } */

h1 {
   text-align: center;
   margin-top: 5em;
}
</style>
