<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
   modelValue: number;
}>();

const emit = defineEmits<{
   (e: "update:modelValue", value: number): void;
}>();

const counter = ref(Number.isFinite(props.modelValue) ? props.modelValue : 0);

function counterMinus() {
   if (counter.value > 1) {
      counter.value--;
      emit("update:modelValue", counter.value);
      animateButton("minus");
   }
}

function counterPlus() {
   counter.value++;
   emit("update:modelValue", counter.value);
   animateButton("plus");
}

function onInputChange(event: Event) {
   const input = event.target as HTMLInputElement;
   const value = parseInt(input.value, 10);

   if (!isNaN(value) && value > 0) {
      counter.value = value;
      emit("update:modelValue", counter.value);
   } else {
      input.value = counter.value.toString();
   }
}

function animateButton(buttonId: string) {
   const button = document.getElementById(buttonId);
   if (button) {
      button.classList.add("ripple");
      setTimeout(() => {
         button.classList.remove("ripple");
      }, 300);
   }
}
</script>

<template>
   <div class="wrapper">
      <button id="minus" class="quantity" @click="counterMinus">
         <fa :icon="['fas', 'minus']" />
      </button>
      <input
         class="quantity"
         type="text"
         name="quantity"
         :value="counter"
         @input="onInputChange"
      />
      <button id="plus" class="quantity" @click="counterPlus">
         <fa :icon="['fas', 'plus']" />
      </button>
   </div>
</template>

<style scoped>
.wrapper {
   display: flex;
   align-items: center;
   margin-top: 0.5rem;
}

.quantity {
   font-size: 1rem;
   width: 2.5rem;
   height: 2.5rem;
   text-align: center;
}

button.quantity {
   display: flex;
   justify-content: center;
   align-items: center;
   border: 0.0625rem solid var(--color-border);
   cursor: pointer;
   border-radius: 0.25rem;
   position: relative;
   overflow: hidden;
}

button.quantity::after {
   content: "";
   position: absolute;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;
   background: rgba(0, 0, 0, 0.1);
   opacity: 0;
   transition: opacity 0.3s;
   pointer-events: none;
}

button.quantity:hover {
   background-color: transparent;
}

input.quantity {
   border: 0.0625rem solid #ccc;
   border-radius: 0.25rem;
   padding: 0.3125rem;
}
</style>
