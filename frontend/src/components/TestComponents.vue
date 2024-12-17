<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import { useProductOptions } from "@/lib/useProductOptions";
import request from "@/stores/request";
import store from "@/stores/user";

defineProps<{
   products: Products[];
}>();

const currentUser = store.currentUser || { userPermission: "guest" };

// const { cart, favorites, addToCart, addToFavorites } =
//    productCardButtonActions(userId);

const {
   selectedOptions,
   // updateSelectedOption,
   calculateTotalPrice,
   // areAllOptionsSelected,
} = useProductOptions();

let currentEditProduct = ref<Products>({
   _id: "",
   id: 0,
   brand: "",
   link2Pic: "",
   basePrice: 0,
   discountPrice: 0,
   collection: "",
   title: "",
   options: [],
});

// ================================ //

let dialog = ref(false);
let valid = ref(false);

const sizeOptions = ref<SizeOption[]>([]);
const colorOptions = ref<ColorOption[]>([]);

const tempEditProduct = ref<Products | null>(null);
const tempSizeOptions = ref<SizeOption[]>([]);
const tempColorOptions = ref<ColorOption[]>([]);

watch(
   () => currentEditProduct.value,
   (newVal) => {
      if (newVal) {
         const sizeOpt = newVal.options.find((opt) => opt.name === "Size");
         const colorOpt = newVal.options.find((opt) => opt.name === "Color");
         sizeOptions.value = sizeOpt ? (sizeOpt.values as SizeOption[]) : [];
         colorOptions.value = colorOpt
            ? (colorOpt.values as ColorOption[])
            : [];
      }
   },
   { immediate: true },
);

// Headers
const sizeHeaders = [
   { title: "Size", key: "value" },
   { title: "Price Adjustment", key: "priceAdj" },
   { title: "Actions", key: "actions" },
];

const colorHeaders = [
   { title: "Color", key: "value" },
   { title: "Actions", key: "actions", sortable: false },
];

function openDialog() {
   tempEditProduct.value = JSON.parse(JSON.stringify(currentEditProduct.value));
   // @ts-ignore
   const sizeOpt = tempEditProduct.value.options.find(
      (opt) => opt.name === "Size",
   );
   // @ts-ignore
   const colorOpt = tempEditProduct.value.options.find(
      (opt) => opt.name === "Color",
   );
   console.log("tempEditProduct.value", tempEditProduct.value);
   console.log("colorOpt", colorOpt);
   console.log("sizeOpt", sizeOpt);
   tempSizeOptions.value = sizeOpt
      ? JSON.parse(JSON.stringify(sizeOpt.values))
      : [];
   tempColorOptions.value = colorOpt
      ? JSON.parse(JSON.stringify(colorOpt.values))
      : [];

   dialog.value = true;
}

function addSizeRow() {
   tempSizeOptions.value.push({ value: 0, priceAdj: 0 });
}

function removeSizeOption(item: { value: number }) {
   tempSizeOptions.value = tempSizeOptions.value.filter(
      (s) => s.value !== item.value,
   );
}

function addColorRow() {
   tempColorOptions.value.push({ value: "" });
}

function removeColorOption(index: number) {
   tempColorOptions.value.splice(index, 1);
}

let products: any = ref([]);
onMounted(async () => {
   products.value = await request.get("/admin/products");
});

function overwritingData() {
   currentEditProduct.value = {
      ...currentEditProduct.value,
      ...tempEditProduct.value,
      options: [
         { name: "Size", values: tempSizeOptions.value },
         { name: "Color", values: tempColorOptions.value },
      ],
   };
}

async function amendProduct() {
   if (!tempEditProduct.value) return;
   overwritingData();

   await request.put("/admin/products/" + currentEditProduct.value._id, {
      ...currentEditProduct.value,
   });

   alert("Successfully amended");
   dialog.value = false;

   const index = products.value.findIndex(
      (p: Products) => p._id === currentEditProduct.value._id,
   );
   if (index !== -1) {
      products.value[index] = { ...currentEditProduct.value };
   }
}

// ========= //

const drawer = ref(true);
const selectedComponent = ref("Products");

const switchComponent = (componentName: string) => {
   selectedComponent.value = componentName;
};
</script>

<template>
   <!-- <pre>
  {{ currentUser }}
  </pre> -->
   <v-card>
      <v-layout>
         <v-navigation-drawer class="my-drawer" theme="dark" permanent>
            <v-list nav>
               <v-list-item
                  prepend-icon="mdi-email"
                  title="Overview"
                  value="inbox"
               ></v-list-item>
               <v-list-item
                  prepend-icon="mdi-account-supervisor-circle"
                  title="Establish New Product"
                  value="supervisors"
               ></v-list-item>
               <v-list-item
                  prepend-icon="mdi-clock-start"
                  title=""
                  value="clockin"
               ></v-list-item>
            </v-list>
         </v-navigation-drawer>
         <v-main>
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
                              <span
                                 v-for="value in option.values"
                                 :key="value.value"
                                 class="option-button"
                                 :class="{
                                    selected:
                                       selectedOptions[item.id]?.[
                                          option.name
                                       ] === value.value,
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
                              </span>
                           </div>
                        </div>
                     </div>

                     <div class="action-button-container">
                        <button
                           id="edit-button"
                           class="action-button"
                           @click="
                              currentEditProduct = item;
                              openDialog();
                           "
                        >
                           <fa :icon="['fas', 'pen-to-square']" />Edit Product
                        </button>
                        <button
                           id="delete-button"
                           class="action-button"
                           v-if="currentUser.userPermission === 'admin'"
                           @click="
                              currentEditProduct = item;
                              openDialog();
                           "
                        >
                           <fa :icon="['fas', 'trash']" />Delete Product
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </v-main>
      </v-layout>
   </v-card>
   <v-dialog v-model="dialog" width="1000">
      <v-card class="vuerify-card" max-width="1000" title="Editing Product">
         <v-form v-model="valid">
            <v-row dense v-if="tempEditProduct">
               <!-- Product Title -->
               <v-col cols="12" md="6">
                  <v-text-field
                     clearable
                     variant="outlined"
                     v-model="tempEditProduct.title"
                     label="Product Title*"
                     required
                  ></v-text-field>
               </v-col>

               <!-- Product Collection -->
               <v-col cols="12" sm="6">
                  <v-autocomplete
                     :items="[
                        'Mobile Phones',
                        'Tablets',
                        'Accessories',
                        'Desktops',
                        'Home Devices',
                        'Wearables',
                        'Audios',
                        'Displays',
                        '*Miscellaneous',
                     ]"
                     v-model="tempEditProduct.collection"
                     label="Collection"
                     auto-select-first
                  ></v-autocomplete>
               </v-col>

               <!-- Base Price -->
               <v-col cols="12" md="6">
                  <v-text-field
                     clearable
                     variant="outlined"
                     v-model.number="tempEditProduct.basePrice"
                     label="Base Price (USD)*"
                     required
                  ></v-text-field>
               </v-col>

               <!-- Discount Price -->
               <v-col cols="12" md="6">
                  <v-text-field
                     clearable
                     variant="outlined"
                     v-model.number="tempEditProduct.discountPrice"
                     label="Discount Price (USD)"
                  ></v-text-field>
               </v-col>

               <!-- Size Management -->
               <v-col cols="12" md="6">
                  <span class="form-field label">Size Options</span>
                  <v-data-table
                     :headers="sizeHeaders"
                     :items="tempSizeOptions"
                     item-key="id"
                     item-value="value"
                     class="elevation-1"
                  >
                     <!-- Size Column -->
                     <template v-slot:[`item.value`]="{ index }">
                        <v-text-field
                           class="field-input"
                           variant="outlined"
                           v-model.number="tempSizeOptions[index].value"
                           label="Size"
                           type="text"
                           hide-details="auto"
                        ></v-text-field>
                     </template>

                     <!-- Price Adjustment Column -->
                     <template v-slot:[`item.priceAdj`]="{ index }">
                        <v-text-field
                           class="field-input"
                           variant="outlined"
                           v-model.number="tempSizeOptions[index].priceAdj"
                           label="Price Adjustment"
                           hide-details="auto"
                           type="number"
                        ></v-text-field>
                     </template>

                     <!-- Actions Column -->
                     <template v-slot:[`item.actions`]="{ item }">
                        <div class="options-button-container">
                           <button
                              class="option-button"
                              @click="removeSizeOption(item)"
                           >
                              Delete
                           </button>
                        </div>
                     </template>
                  </v-data-table>
               </v-col>

               <!-- Color Management -->
               <v-col cols="12" md="6">
                  <span class="text-subtitle-1">Color Options</span>
                  <v-data-table
                     :headers="colorHeaders"
                     :items="tempColorOptions"
                     item-value="value"
                     dense
                     class="elevation-1"
                  >
                     <template v-slot:[`item.value`]="{ index }">
                        <v-text-field
                           class="field-input"
                           variant="outlined"
                           v-model="tempColorOptions[index].value"
                           label="Color"
                           hide-details="auto"
                           type="text"
                        ></v-text-field>
                     </template>

                     <template v-slot:[`item.actions`]="{ index }">
                        <div class="options-button-container">
                           <button
                              class="option-button"
                              @click="removeColorOption(index)"
                           >
                              Delete
                           </button>
                        </div>
                     </template>
                  </v-data-table>
               </v-col>
            </v-row>
         </v-form>

         <template v-slot:actions>
            <div class="form-button-container">
               <button class="form-button" @click.prevent="dialog = false">
                  <fa :icon="['fas', 'ban']" />Cancel
               </button>
               <button class="form-button" type="button" @click="addSizeRow">
                  <fa :icon="['fas', 'ruler']" />Add Size
               </button>
               <button class="form-button" type="button" @click="addColorRow">
                  <fa :icon="['fas', 'palette']" />Add Color
               </button>
               <button class="form-button" @click.prevent="amendProduct()">
                  <fa :icon="['fas', 'download']" />Amend
               </button>
            </div>
         </template>
      </v-card>
   </v-dialog>
</template>

<style scoped>
.form-container {
   width: 800px;
}
.card {
   display: flex;
   justify-content: space-between;
   width: 100%;
   max-width: 60rem;
   margin: 20px auto;
   border-radius: 16px;
   position: relative;
   overflow: hidden;
   box-sizing: border-box;
   transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
}

.card:hover {
   transform: translateY(-5px);
   box-shadow: 0 8px 18px var(--color-border-hover);
}

.left {
   flex: 1 1 40%;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   overflow: hidden;
   aspect-ratio: 4 / 3;
}

.left img {
   max-width: 95%;
   max-height: 95%;
   object-fit: contain;
   border-radius: 12px;
}

.right {
   flex: 1 1 60%;
   display: inline-grid;
   height: 100%;
   padding: 20px;
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
   gap: 8px;
   font-size: 18px;
   font-family: "Muli", Ubuntu, sans-serif;
   color: var(--color-heading);
}

.icon {
   margin-left: 2px;
   margin-right: 6px;
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
   font-size: 14px;
   margin: 5px 0;
   color: var(--color-text);
   font-family: "Muli", Ubuntu, sans-serif;
}

.label {
   margin-top: 8px;
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
   margin-top: 6px;
   margin-bottom: 6px;
   font-weight: normal;
   font-family: "Muli", Ubuntu, sans-serif;
}

.price-container {
   display: flex;
   align-items: center;
   gap: 30px;
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
   gap: 16px;
   list-style: none;
   margin: 8px 0;
   padding: 0;
}

ul li {
   padding: 4px 8px;
   border-radius: 4px;
   font-size: 12px;
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

.vuerify-card {
   padding: 1rem;
   background-color: var(--vt-c-black-soft);
   color: white;
   border-radius: 8px;
}

.field-input {
   min-width: 5rem;
   max-width: 12rem;
   margin-top: 0.8rem;
   margin-bottom: 0.8rem;
}

@media (max-width: 768px) {
   .form-container {
      width: 90%;
      margin: 0 auto;
   }

   .card {
      flex-direction: column;
      padding: 16px;
      width: 100%;
      height: auto;
      border-radius: 12px;
      margin: 16px auto;
   }

   .left {
      width: 100%;
      height: 200px;
      border-radius: 12px 12px 0 0;
      justify-content: center;
      align-items: center;
   }

   .left img {
      max-width: 90%;
      max-height: 100%;
      border-radius: 12px;
   }

   .right {
      width: 100%;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
   }

   .product-brand {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      font-size: 16px;
   }

   .details {
      text-align: center;
      font-size: 14px;
   }

   .price-container {
      flex-direction: column;
      gap: 8px;
      align-items: center;
   }

   .option-button {
      min-width: 70px;
      margin: 4px;
   }
}

.my-drawer {
   margin-top: 5rem;
}
</style>
