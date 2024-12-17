<script setup lang="ts">
import { onMounted, ref } from "vue";
import request from "../stores/request";
import QuantitySelector from "@/components/cart/QuantitySelector.vue";
interface Cart {
   items: CartItem[];
   totalAmount: number;
}
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const CHECKOUT_URL = baseURL + "/orders";

interface CartItem {
   // interface CartItem<T = Record<string, number>| string[] > {
   // priceDetail: Record<string, number>;
   // metadata: T;
   productId: string;
   amount: number;
   title: string;
   price: number;
   subtotal: number;
}

let cart = ref<Cart>({
   items: [],
   totalAmount: 0,
});

onMounted(async () => {
   try {
      cart.value = await request.get("/carts");
   } catch (error) {}
});

async function checkout(): Promise<void> {
   console.log("checkout started");
   try {
      hasCheckout.value = true;
      const createdOrder = await request.post("/orders", {
         order: {
            ...order.value,
            // @ts-ignore
            items: cart.value.items.map((_) => {
               // console.log('item', _)
               return {
                  productId: _.productId,
                  title: _.title,
                  price: _.price,
                  amount: _.amount,
                  // size: '',
               };
            }),
         },
      });

      console.log("createdOrder", createdOrder);

      // @ts-ignore
      if (createdOrder.id) {
         const token = localStorage.getItem("token");
         // @ts-ignore
         console.log("createdOrder.id)", createdOrder.id);
         // @ts-ignore
         window.location.href = `${baseURL}/payment/${createdOrder.id}?token=${token}`;
      }
   } catch (error) {
      console.error(error);
   }
}

let order = ref({
   buyerName: "Uncle Roger",
   buyerContactNumber: "+886 (978)-563-809",
   recipient: "Uncle Roger Nephew",
   shippingAddress: "my home",
   shippingContactPhone: "+1 (909) 144-2236",
   // status: '',
});
let hasCheckout = ref(false);
</script>

<template>
   <div>
      <!-- <p class="card-text" v-html="author.description" /> -->
      <!-- <v-dialog v-model="dialog" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
    >
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog> -->

      <div v-if="!hasCheckout">
         <v-card class="mx-auto" max-width="1200" title="Order Checkout">
            <v-container>
               <!-- <div v-for="item in cart.items">
      <h3>{{ item.title }}</h3>
      <QuantitySelector v-model="item.amount" />
      <span class="subtotal"> subtotal: {{ item.subtotal }} </span>
    </div> -->

               <v-table>
                  <thead>
                     <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">amount</th>
                        <th class="text-left">price</th>
                        <th class="text-left">subtotal</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="item in cart.items" :key="item.title">
                        <td>{{ item.title }}</td>
                        <td>{{ item.amount }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.subtotal }}</td>
                     </tr>
                  </tbody>
               </v-table>

               <h2>Total Amount : {{ cart.totalAmount }}</h2>
               <button @click="checkout">Checkout</button>

               <v-text-field
                  v-model="order.buyerName"
                  label="Buyer name"
               ></v-text-field>

               <v-text-field
                  v-model="order.buyerContactNumber"
                  label="Buyer contact number"
               ></v-text-field>

               <v-text-field
                  v-model="order.shippingAddress"
                  label="Shipping address"
               ></v-text-field>

               <v-text-field
                  v-model="order.recipient"
                  label="Recipient"
               ></v-text-field>

               <v-text-field
                  v-model="order.shippingContactPhone"
                  label="Shipping Contact Phone"
               ></v-text-field>

               <!-- <v-checkbox
        v-model="terms"
        color="secondary"
        label="I agree to site terms and conditions"
      ></v-checkbox> -->
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
               <v-spacer></v-spacer>

               <div class="form-button-container">
                  <button class="form-button" @click="checkout">
                     Checkout!
                  </button>
               </div>
               <!-- <button type="submit">Checkout!</button> -->
            </v-card-actions>
         </v-card>
      </div>
      <div v-else>Redirecting to ECPAY.....</div>
   </div>
</template>

<style scoped></style>
