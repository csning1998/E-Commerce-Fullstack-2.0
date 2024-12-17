<script setup lang="ts">
import { onMounted, ref } from "vue";
import request from "../stores/request";

let orders = ref<any>([]);

onMounted(async () => {
   try {
      orders.value = await request.get("/admin/orders");
   } catch (error) {}
});
</script>

<template>
   <v-card class="mx-auto" title="Order Checkout">
      <v-container>
         <v-table>
            <thead>
               <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Total Amount</th>
                  <th class="text-left">Buyer's Name</th>
                  <th class="text-left">Shipping Address</th>
                  <th class="text-left">Recipient</th>
                  <th class="text-left">Recipient's Phone Number</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Created at</th>
                  <th class="text-left">Updated at</th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="o in orders" :key="o.id">
                  <td>{{ o.id }}</td>
                  <td>{{ o.totalAmount }}</td>
                  <td>{{ o.buyerName }}</td>
                  <td>{{ o.shippingAddress }}</td>
                  <td>{{ o.recipient }}</td>
                  <td>{{ o.shippingContactPhone }}</td>
                  <td>{{ o.status }}</td>
                  <td>{{ o.createdAt }}</td>
                  <td>{{ o.updatedAt }}</td>
               </tr>
            </tbody>
         </v-table>
      </v-container>
   </v-card>
</template>

<style scoped></style>
