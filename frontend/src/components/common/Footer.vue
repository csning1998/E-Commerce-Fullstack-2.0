<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

interface FooterLink {
   text: string;
   href: string;
}

const router = useRouter();

const footerLinks = ref<FooterLink[]>([
   { text: "Privacy Policy", href: "/privacy-policy" },
   { text: "Terms of Services", href: "/terms-of-service" },
   { text: "Contact Us", href: "ContactUs" },
]);

const Nav2Push = (link: FooterLink) => {
   router.push(link.href);
};
</script>

<template>
   <footer class="footer">
      <div class="footer_content">
         <p class="footer_text">
            &copy; 2024 E-Commerce WebApp. All rights reserved.
         </p>
         <nav class="footer_nav">
            <ul class="footer_nav-list">
               <li
                  v-for="(link, index) in footerLinks"
                  :key="index"
                  class="footer_nav-item"
               >
                  <a
                     class="footer_nav-link"
                     @click.prevent="Nav2Push(link)"
                     :href="link.href"
                  >
                     {{ link.text }}
                  </a>
               </li>
            </ul>
         </nav>
      </div>
   </footer>
</template>

<style scoped>
.footer {
   position: fixed;
   bottom: 0;
   left: 0;
   padding: 1rem;
   width: 100%;
   background-color: var(--vt-c-black);
   color: var(--vt-c-text-dark-2);
   text-align: center;
   border-top: 2px solid var(--vt-c-divider-dark-1);
}

.footer_content {
   max-width: 1200px;
   margin: 0 auto;
   display: flex;
   flex-direction: column;
   align-items: center;
}

.footer_text {
   font-size: 1rem;
   color: var(--vt-c-text-dark-1);
   margin: 0;
}

.footer_nav {
   display: flex;
   gap: 1rem;
   margin-top: 0.6rem;

   justify-content: center;
}

.footer_nav-list {
   list-style: none;
   padding: 0;
   margin: 0;
   display: flex;
   gap: 2rem;
}

.footer_nav-item {
   font-size: 1rem;
}

.footer_nav-link {
   color: var(--vt-c-text-dark-2);
   text-decoration: none;
   font-weight: 500;
   transition: color 0.3s ease-in-out;
}

.footer_nav-link:hover {
   color: var(--color-heading);
}
</style>
