<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { AxiosError, AxiosResponse } from "axios";
import request from "@/stores/request";

function isError(error: unknown): error is Error {
   return error instanceof Error;
}

interface Product {
   id: number;
   name: string;
   price: number;
   description: string;
   category: string;
   stock: number;
   images: string[];
}

const PRODUCT_CATEGORIES = [
   "Electronics",
   "Clothing",
   "Books",
   "Toys",
] as const;
const MAX_IMAGES = 5;

const router = useRouter();
const route = useRoute();

const isEditing = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const createEmptyProduct = (): Product => ({
   id: 0,
   name: "",
   price: 0,
   description: "",
   category: "",
   stock: 0,
   images: [],
});

const productId = String(route.params.id);
const product = reactive<Product>(createEmptyProduct());
const originalProduct = reactive<Product>(createEmptyProduct());
const hasChanges = computed(
   () => JSON.stringify(product) !== JSON.stringify(originalProduct),
);

const isValidImageUrl = (url: string): boolean => {
   try {
      const testUrl = new URL(url);
      return /\.(jpeg|jpg|gif|png|webp)$/i.test(testUrl.pathname);
   } catch {
      return false;
   }
};

const fetchProductDetails = async () => {
   isLoading.value = true;
   errorMessage.value = "";
   try {
      const response: AxiosResponse<Product> = await request.get(
         `/products/${productId}`,
      );

      Object.entries(response.data).forEach(([key, value]) => {
         const typedKey = key as keyof Product;
         if (typedKey in product) {
            (product[typedKey] as typeof value) = value;
            (originalProduct[typedKey] as typeof value) = value;
         }
      });
   } catch (error: unknown) {
      if (isError(error)) {
         errorMessage.value = `Failed to load: ${error.message}`;
      } else {
         errorMessage.value =
            "An unknown error occurred while loading product details";
      }
      console.error("Error fetching product details:", error);
   } finally {
      isLoading.value = false;
   }
};

const validateForm = (): boolean => {
   if (!product.name.trim()) {
      alert("Product name cannot be empty");
      return false;
   }
   if (product.price <= 0) {
      alert("Price must be greater than 0");
      return false;
   }
   if (!product.category) {
      alert("Please select a category");
      return false;
   }
   return true;
};

const saveProduct = async () => {
   if (!validateForm()) return;

   isLoading.value = true;
   errorMessage.value = "";
   try {
      const response: AxiosResponse<Product> = await request.put(
         `/products/${product.id}`,
         product,
      );

      if (response.status === 200) {
         alert("Product updated successfully");
         Object.entries(product).forEach(([key, value]) => {
            const typedKey = key as keyof Product;
            (originalProduct[typedKey] as typeof value) = value;
         });
         isEditing.value = false;
      }
   } catch (error: unknown) {
      if (isError(error)) {
         errorMessage.value = `Update failed: ${error.message}`;
      } else {
         errorMessage.value =
            "An unknown error occurred while updating the product";
      }
      console.error("Error saving product:", error);
   } finally {
      isLoading.value = false;
   }
};

const addImage = () => {
   if (product.images.length < MAX_IMAGES) {
      const newImageUrl = prompt("Please enter the image URL");
      if (newImageUrl && isValidImageUrl(newImageUrl)) {
         product.images.push(newImageUrl);
      } else if (newImageUrl) {
         alert("Please enter a valid image URL");
      }
   } else {
      alert(`You can only add up to ${MAX_IMAGES} images`);
   }
};

const removeImage = (index: number) => {
   product.images.splice(index, 1);
};

const cancelEdit = () => {
   Object.entries(originalProduct).forEach(([key, value]) => {
      const typedKey = key as keyof Product;
      (product[typedKey] as typeof value) = value;
   });
   isEditing.value = false;
};

onMounted(() => {
   fetchProductDetails();
});
</script>

<template>
   <div class="form-container">
      <h1>Product Edit Page</h1>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div v-if="isLoading" class="loading-spinner">Loading...</div>

      <div v-else class="product-form">
         <div class="form-header">
            <button @click="isEditing = !isEditing" :disabled="isLoading">
               {{ isEditing ? "Cancel" : "Edit" }}
            </button>
            <button
               v-if="isEditing"
               @click="saveProduct"
               :disabled="!hasChanges || isLoading"
            >
               Save Product
            </button>
         </div>

         <div class="form-section">
            <div class="form-field">
               <label>Product Name:</label>
               <span v-if="!isEditing">{{ product.name }}</span>
               <input
                  v-if="isEditing"
                  v-model="product.name"
                  placeholder="Enter product name"
               />
            </div>

            <div class="form-field">
               <label>Product Price:</label>
               <span v-if="!isEditing">{{ product.price }}</span>
               <input
                  v-if="isEditing"
                  type="number"
                  v-model.number="product.price"
                  placeholder="Enter product price"
               />
            </div>

            <div class="form-field">
               <label>Product Description:</label>
               <span v-if="!isEditing">{{ product.description }}</span>
               <textarea
                  v-if="isEditing"
                  v-model="product.description"
                  placeholder="Enter product description"
               ></textarea>
            </div>

            <div class="form-field">
               <label>Product Category:</label>
               <span v-if="!isEditing">{{ product.category }}</span>
               <select v-if="isEditing" v-model="product.category">
                  <option value="">Please select a category</option>
                  <option
                     v-for="category in PRODUCT_CATEGORIES"
                     :key="category"
                     :value="category"
                  >
                     {{ category }}
                  </option>
               </select>
            </div>

            <div class="form-field">
               <label>Product Stock:</label>
               <span v-if="!isEditing">{{ product.stock }}</span>
               <input
                  v-if="isEditing"
                  type="number"
                  v-model.number="product.stock"
                  placeholder="Enter stock quantity"
               />
            </div>
         </div>

         <div class="form-section">
            <h2>Product Images</h2>
            <div
               v-for="(image, index) in product.images"
               :key="index"
               class="image-item"
            >
               <img
                  v-if="image"
                  :src="image"
                  :alt="`Product Image ${index + 1}`"
               />
               <input
                  v-if="isEditing"
                  v-model="product.images[index]"
                  placeholder="Image URL"
               />
               <button v-if="isEditing" @click="removeImage(index)">
                  Remove Image
               </button>
            </div>
            <button
               v-if="isEditing && product.images.length < MAX_IMAGES"
               @click="addImage"
            >
               Add Image
            </button>
         </div>
      </div>
   </div>
</template>

<style scoped>
.form-title {
   text-align: left;
}

.profile-picture {
   width: 100px;
   height: 100px;
   border-radius: 50%;
   border: 2px solid var(--color-border);
}

h1,
h2 {
   color: var(--color-heading); /* Use theme color */
}
</style>
