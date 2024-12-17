<script setup lang="ts">
import { defineProps } from "vue";
import { productCardButtonActions } from "@/lib/productCardButtonActions";
import { useProductOptions } from "@/lib/useProductOptions";
import QuantitySelector from "@/components/cart/QuantitySelector.vue";

defineProps<{
   products: Products[];
}>();

const userId = undefined;

const { quantities, addToCart, addToFavorites } =
   productCardButtonActions(userId);

const { selectedOptions, calculateTotalPrice, areAllOptionsSelected } =
   useProductOptions();

const addToCartHandler = async (item: Products): Promise<void> => {
   const productId = item._id;
   console.log("productId", productId);
   const quantity: number = quantities.value[productId];
   console.log("quantity", quantity);
   const options: Record<string, string | number> =
      selectedOptions.value[productId];
   console.log("options", options);

   if (!item._id) {
      alert("Product ID is missing.");
      return;
   }

   const bestPrice = calculateTotalPrice(item).bestPrice;
   console.log("bestPrice", bestPrice);

   const color = options.Color;
   const size = options.Size;

   console.log(`(color: ${color}, size: ${size}, quantity: ${quantity})`);

   if (!color || !size) {
      alert("Please select color and size.");
      return;
   }

   const params = {
      productId: productId,
      title: item.title,
      amount: quantity,
      price: bestPrice,
      color: color,
      size: size,
   };

   //@ts-ignore
   await addToCart(params);
};
</script>

<template>
   <div class="product-container">
      <div v-for="item in products" :key="item.id" class="card">
         <div class="image-container">
            <img :src="item.link2Pic" alt="Product Image" />
         </div>
         <div class="content-container">
            <div class="product-brand">
               {{ item.brand }}
               <div class="price-container">
                  <span class="discount">
                     <fa icon="dollar-sign" />
                     {{ calculateTotalPrice(item).bestPrice }}
                  </span>
                  <span class="original-price">
                     <fa icon="dollar-sign" />
                     {{ calculateTotalPrice(item).discountPrice }}
                  </span>
               </div>
            </div>
            <div class="details">
               <div class="container">
                  <div class="left">
                     <h3>{{ item.collection }}</h3>
                     <h2>{{ item.title }}</h2>
                  </div>
                  <div class="right">
                     <QuantitySelector v-model="quantities[item.id]" />
                  </div>
               </div>

               <div v-for="option in item.options" :key="option.name">
                  <p class="label">
                     {{ option.name.toUpperCase() }}
                  </p>
                  <div class="options-button-container">
                     <button
                        v-for="value in option.values"
                        :key="value.value"
                        class="option-button"
                        :class="{
                           selected:
                              selectedOptions[item.id]?.[option.name] ===
                              value.value,
                        }"
                        @click="
                           () => {
                              if (!selectedOptions[item.id]) {
                                 selectedOptions[item.id] = {};
                              }
                              selectedOptions[item.id][option.name] =
                                 value.value;
                           }
                        "
                     >
                        {{ value.value }}
                     </button>
                  </div>
               </div>
            </div>
            <div class="action-button-container">
               <button
                  class="action-button"
                  :class="{ disabled: !areAllOptionsSelected(item) }"
                  @click="
                     () => {
                        if (areAllOptionsSelected(item)) {
                           addToCartHandler(item);
                        }
                     }
                  "
               >
                  <span class="icon">
                     <fa icon="cart-arrow-down" id="addToCart" />
                  </span>
                  Add to Cart
               </button>
               <button class="action-button" @onClick.prevent="addToFavorites">
                  <span class="icon" id="addToFavorites">
                     <fa icon="heart" />
                  </span>
                  Add to Favorites
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.product-container {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
   flex-wrap: wrap;
   gap: 1rem;
   width: 100%;
   justify-content: space-between;
   align-items: flex-start;
}

.card {
   flex: 1 1 15rem;
   border-radius: 12px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   overflow: hidden;
   background-color: var(--color-background-soft);
}

.card:hover {
   transform: translateY(-5px);
   box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.image-container {
   width: 100%;
   max-height: 24rem;
   min-height: 20rem;
   overflow: hidden;
   display: flex;
   justify-content: center;
   align-items: center;
   background-color: #fff;
}

.image-container img {
   width: 100%;
   height: auto;
   object-fit: scale-down;
}

.content-container {
   padding: 20px;
}

.product-info {
   margin-bottom: 20px;
}

.product-brand {
   display: flex;
   margin-bottom: 6px;
   align-items: center;
   justify-content: space-between;
   gap: 8px;
   font-size: 18px;
   font-family: "Muli", Ubuntu, sans-serif;
   color: var(--color-heading);
}

.container {
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.left {
   flex: 1;
}

.right {
   flex-shrink: 0;
   margin-left: 20px;
}

.details {
   font-size: 14px;
   color: var(--color-text);
}

.price-container {
   display: flex;
   flex-wrap: wrap;
   align-items: center;
   gap: 10px;
}

.original-price {
   font-size: 16px;
   font-weight: normal;
   text-decoration: line-through;
   color: var(--vt-c-divider-dark-1);
}

.discount {
   font-size: 24px;
   font-weight: bold;
   color: var(--vt-c-indigo);
   gap: 4px;
}

ul {
   display: flex;
   gap: 10px;
   list-style: none;
   margin: 8px 0;
   padding: 0;
}

ul li {
   padding: 4px 8px;
   border-radius: 4px;
   font-size: 12px;
   background-color: var(--color-border);
   color: var(--color-text);
   transition:
      background-color 0.3s ease,
      color 0.3s ease;
}

ul li.bg:hover {
   background-color: var(--vt-c-indigo);
   color: var(--color-background);
}

h1 {
   font-size: 20px;
   font-family: "Muli", Ubuntu, sans-serif;
}

h2 {
   font-size: 24px;
   font-weight: bold;
   font-family: "Muli", Ubuntu, sans-serif;
}

h3 {
   font-size: 14px;
   font-family: "Muli", Ubuntu, sans-serif;
}

.details {
   margin-top: 2px;
   margin-bottom: 2px;
   font-weight: normal;
   font-family: "Muli", Ubuntu, sans-serif;
}

.foot.disabled {
   opacity: 0.5;
   pointer-events: none;
}

@media (max-width: 768px) {
   .card {
      flex: 1 1 100%;
      max-width: none;
   }

   .product-container {
      justify-content: center;
   }

   .image-container img {
      height: auto;
   }

   .action-button-container {
      flex-direction: column;
      gap: 10px;
   }
}

@media (max-width: 480px) {
   .card {
      flex: 1 1 100%;
   }
}
</style>
