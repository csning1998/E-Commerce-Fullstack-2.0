<script setup lang="ts">
import { defineProps } from "vue";
import { productCardButtonActions } from "@/lib/productCardButtonActions";
import { useProductOptions } from "@/lib/useProductOptions";
import QuantitySelector from "@/components/cart/QuantitySelector.vue";

defineProps<{
   products: Products[];
}>();

const userId = undefined; // if (!isLoggedIn) then make it undefined

const { quantities, addToCart, addToFavorites } =
   productCardButtonActions(userId);

console.log("quantities", quantities);

const { selectedOptions, calculateTotalPrice, areAllOptionsSelected } =
   useProductOptions();

const addToCartHandler = async (item: Products): Promise<void> => {
   console.log("item", item);

   const productId = item.id;
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

   await addToCart(params);
};
</script>

<template>
   <div>
      <div class="form-container">
         <form class="form-body">
            <div class="form-field">
               <input type="text" placeholder="Search" />
            </div>
         </form>
      </div>
      <div class="product-container">
         <div v-for="item in products" :key="item.id" class="card">
            <div class="left">
               <img :src="item.link2Pic" alt="Product Image" />
            </div>
            <div class="right">
               <div class="product-info">
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
               </div>
               <div class="details">
                  <h3>{{ item.collection }}</h3>
                  <h2>{{ item.title }}</h2>

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
                  <QuantitySelector v-model="quantities[item.id]" />
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
                  <button
                     class="action-button"
                     @onClick.prevent="addToFavorites"
                  >
                     <span class="icon" id="addToFavorites">
                        <fa icon="heart" />
                     </span>
                     Add to Favorites
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.form-container {
   width: 50rem;
}
.card {
   display: flex;
   justify-content: space-between;
   width: 100%;
   max-width: 60rem;
   margin: 1.25rem auto;
   border-radius: 1rem;
   position: relative;
   overflow: hidden;
   box-sizing: border-box;
   transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
}

.card:hover {
   transform: translateY(-0.3125rem);
   box-shadow: 0 0.5rem 1.125rem var(--color-border-hover);
}

.left {
   flex: 1 1 40%;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   overflow: hidden;
   aspect-ratio: 4 / 3;
   background-color: #fff;
}

.left img {
   max-width: 95%;
   max-height: 95%;
   object-fit: contain;
   border-radius: 0.75rem;
}

.right {
   flex: 1 1 60%;
   display: inline-grid;
   height: 100%;
   padding: 1.25rem;
   background-color: var(--color-background-soft);
   overflow: hidden;
}

.product-info {
   display: flex;
   flex-direction: column;
}

.product-brand {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 0.5rem;
   font-size: 1.125rem;
   font-family: "Muli", Ubuntu, sans-serif;
   color: var(--color-heading);
}

.icon {
   margin-left: 0.125rem;
   margin-right: 0.375rem;
   color: var(--color-text);
   transition:
      color 0.3s ease,
      transform 0.3s ease;
}

.icon:hover {
   color: var(--vt-c-indigo);
   transform: scale(1.15);
}

.details {
   font-size: 0.875rem;
   margin: 0.3125rem 0;
   color: var(--color-text);
   font-family: "Muli", Ubuntu, sans-serif;
}

.label {
   margin-top: 0.5rem;
}

h1 {
   font-size: 1.25rem;
   font-family: "Muli", Ubuntu, sans-serif;
}

h2 {
   font-size: 1.5rem;
   font-weight: bold;
   font-family: "Muli", Ubuntu, sans-serif;
}

h3 {
   font-size: 0.875rem;
   font-family: "Muli", Ubuntu, sans-serif;
}

.details {
   margin-top: 0.375rem;
   margin-bottom: 0.375rem;
   font-weight: normal;
   font-family: "Muli", Ubuntu, sans-serif;
}

.price-container {
   display: flex;
   align-items: center;
   gap: 2rem;
}

.original-price {
   font-size: 1rem;
   font-weight: normal;
   text-decoration: line-through;
   color: var(--vt-c-divider-dark-1);
}

.discount {
   font-size: 1.5rem;
   font-weight: bold;
   color: var(--vt-c-indigo);
   gap: 0.25rem;
}

ul {
   display: flex;
   gap: 1rem;
   list-style: none;
   margin: 0.5rem 0;
   padding: 0;
}

ul li {
   padding: 0.25rem 0.5rem;
   border-radius: 0.25rem;
   font-size: 0.75rem;
   font-weight: 500;
   text-align: center;
   background-color: var(--color-border);
   color: var(--color-text);
   transition: all 0.3s ease;
}

ul li.bg:hover {
   background-color: var(--vt-c-indigo);
   color: var(--color-background);
}

@media (max-width: 850px) {
   .form-container {
      width: 90%;
      margin: 0 auto;
   }

   .card {
      flex-direction: column;
      padding: 1rem;
      width: 100%;
      height: 60rem;
      border-radius: 0.75rem;
      margin: 1rem auto;
   }

   .left {
      width: 100%;
      height: 12.5rem;
      border-radius: 0.75rem 0.75rem 0 0;
      justify-content: center;
      align-items: center;
   }

   .left img {
      max-width: 90%;
      max-height: 100%;
      border-radius: 0.75rem;
   }

   .right {
      width: 100%;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
   }

   .product-brand {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
      font-size: 1rem;
   }

   .details {
      text-align: center;
      font-size: 0.875rem;
   }

   .price-container {
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
   }

   .action-button-container {
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin: 1rem 0;
      gap: 0.75rem;
   }

   .option-button {
      min-width: 4.375rem;
      margin: 0.25rem;
   }
}
</style>
