<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

interface SimilarItem {
   id: string;
   name: string;
   link2Pic: string;
   price: string;
}

const similarItems = reactive<SimilarItem[]>([
   {
      id: "1",
      name: "Air Max 90",
      price: "$150",
      link2Pic: "https://via.placeholder.com/150",
   },
   {
      id: "2",
      name: "Yeezy Boost 350",
      price: "$220",
      link2Pic: "https://via.placeholder.com/150",
   },
]);

const handleProductClick = (id: string) => {
   const router = useRouter();
   router.push(`/product/${id}`);
};
</script>

<template>
   <div class="similar-items">
      <h2>類似商品</h2>
      <div v-for="item in similarItems" :key="item.id" class="item-card">
         <img :src="item.link2Pic" alt="Similar Item Image" />
         <h3>{{ item.name }}</h3>
         <p>價格：{{ item.price }}</p>
         <button @click="handleProductClick(item.id)">查看商品</button>
      </div>
   </div>
</template>

<style scoped>
.similar-items {
   display: flex;
   flex-wrap: wrap;
   gap: 20px;
}

.item-card {
   border: 1px solid #ddd;
   padding: 10px;
   border-radius: 5px;
   width: 150px;
   text-align: center;
}

.item-card img {
   max-width: 100%;
   margin-bottom: 10px;
}
</style>
