<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

interface NavLink {
   text: string;
   href: string;
}

const navLinks = ref<NavLink[]>([
   { text: "Test", href: "./testComponents" },
   { text: "Management", href: "./seller-product-management" },
   { text: "Products", href: "./Products" },
   { text: "Favourites", href: "#" },
   { text: "Shopping Cart", href: "./cart" },
   { text: "View Orders", href: "/order" },
]);

const token = localStorage.getItem("token");
const isLoggedIn = ref(!!token);
const router = useRouter();

window.addEventListener("userLoggedIn", () => {
   isLoggedIn.value = true;
});

window.addEventListener("userLoggedOut", () => {
   isLoggedIn.value = false;
});

function navLinkHandler(link: NavLink) {
   if (link.href === "#") {
      return;
   }
   router.push(link.href);
}
</script>

<template>
   <header class="navbar">
      <div class="navbar_logo">
         <button class="navbar_logo-button" @click.prevent="router.push('/')">
            <img
               class="logo"
               src="@/assets/e-commerce-logo.png"
               alt="E-Commerce WebApp"
            />
            E-Commerce WebApp
         </button>
      </div>
      <nav class="navbar_nav">
         <a
            v-for="(link, index) in navLinks"
            :key="index"
            :href="link.href"
            class="navbar_nav-link"
            @click.prevent="navLinkHandler(link)"
         >
            {{ link.text }}
         </a>

         <a
            v-if="!isLoggedIn"
            href="/login"
            class="navbar_auth-link"
            @click.prevent="router.push('/login')"
         >
            Login
         </a>
         <a
            v-else
            href="/profile"
            class="navbar_auth-link"
            @click.prevent="router.push('/profile')"
         >
            Profile
         </a>
      </nav>
   </header>
</template>

<style scoped>
.logo {
   height: 2vmin;
   width: 2vmin;
   margin-right: 0.5rem;
   vertical-align: middle;
}

.navbar {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 1rem 2rem;
   left: 0;
   top: 0;
   background-color: var(--vt-c-black);
   color: var(--vt-c-text-dark-1);
   border-bottom: 2px solid var(--vt-c-divider-dark-1);
}

.navbar_logo {
   font-size: 1.5rem;
   font-weight: bold;
   font-family: Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
}

.navbar_logo-button {
   all: unset;
   cursor: pointer;
   color: var(--vt-c-text-dark-1);
   font-size: 1.5rem;
   font-weight: bold;
   text-transform: uppercase;
   transition: color 0.3s ease-in-out;
}

.navbar_logo-button:hover {
   color: var(--vt-c-text-dark-2);
}

.navbar_nav {
   display: flex;
   align-items: center;
   gap: 1.5rem;
   margin-top: 0.1rem;
}

.navbar_nav-link {
   color: var(--vt-c-text-dark-2);
   text-decoration: none;
   font-size: 1rem;
   font-weight: 500;
   transition:
      color 0.3s ease-in-out,
      border-bottom 0.3s ease-in-out;
   border: 2px solid transparent;
}

.navbar_nav-link:hover {
   color: var(--color-heading);
}

.navbar_auth-link {
   color: var(--vt-c-text-dark-1);
   font-weight: bold;
   text-decoration: none;
   padding: 0.5rem 1rem;
   border: 2px solid transparent;
   border-radius: 5px;
   transition: all 0.3s ease-in-out;
}

.navbar_auth-link:hover {
   color: var(--vt-c-black);
   background-color: var(--color-background-mute);
   border-color: var(--color-border-hover);
}
</style>
