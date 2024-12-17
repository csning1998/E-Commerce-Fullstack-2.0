<script setup lang="ts">
// Reformatted from: https://github.com/thefaiz/vue-dialog

import { defineProps } from "vue";

defineProps({
   show: {
      type: Boolean,
      default: false,
   },
   title: {
      type: String,
      default: "",
   },
   description: {
      type: String,
      default: "",
   },
   cancel: {
      type: Function,
      required: true,
   },
   confirm: {
      type: Function,
      required: true,
   },
});
</script>

<template>
   <div v-show="show" class="overlay">
      <div class="dialog">
         <div class="dialog__content">
            <h2 class="dialog__title">{{ title }}</h2>
            <p class="dialog__description">{{ description }}</p>
         </div>

         <hr />

         <div class="dialog__footer">
            <button @click="cancel" class="dialog__cancel">Cancel</button>
            <button @click="confirm" class="dialog__confirm">
               Yes, delete it
            </button>
         </div>
      </div>
   </div>
</template>
