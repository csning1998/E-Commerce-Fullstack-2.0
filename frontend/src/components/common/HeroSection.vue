<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const slides = ref([
   {
      image: "https://cdn.mos.cms.futurecdn.net/eEgvEmehB9gAHtqcLkPHGm-1024-80.jpg.webp",
      subtitle: "Slide 1",
      title: "Google Products 1",
      link: "https://store.google.com",
   },
   {
      image: "https://s3.ca-central-1.amazonaws.com/itechnolabs.ca-uploads-staging/wp-content/uploads/2023/12/1-.Best-Google-Products-That-are-Expected-to-Roll-Out.jpg",
      subtitle: "Slide 2",
      title: "Google Products 2",
      link: "https://store.google.com",
   },
   {
      image: "https://www.androidauthority.com/wp-content/uploads/2017/10/Google-Pixel-2-event-2017-made-by-google-product-range-840w-472h.jpg.webp",
      subtitle: "Slide 3",
      title: "Google Products 3",
      link: "https://store.google.com",
   },
]);

const currentIndex = ref(0);
const intervalId = ref<number | null>(null);
const heroSectionRef = ref<HTMLElement | null>(null);

// Move to the next slide
const handleButtonClick = () => {
   console.log("Button clicked");
};

const nextSlide = () => {
   currentIndex.value = (currentIndex.value + 1) % slides.value.length;
   updateSlidePosition();
   resetAutoSlide();
};

const prevSlide = () => {
   currentIndex.value =
      (currentIndex.value - 1 + slides.value.length) % slides.value.length;
   updateSlidePosition();
   resetAutoSlide();
};

const updateSlidePosition = () => {
   if (heroSectionRef.value) {
      const offset = currentIndex.value * heroSectionRef.value.offsetWidth;
      heroSectionRef.value.scrollTo({
         left: offset,
         behavior: "smooth", // Ensure smooth scrolling
      });
   }
};

const startAutoSlide = () => {
   // @ts-ignore
   intervalId.value = setInterval(nextSlide, 5000);
};

const resetAutoSlide = () => {
   if (intervalId.value) {
      clearInterval(intervalId.value);
   }
   startAutoSlide();
};

onMounted(() => {
   heroSectionRef.value = document.querySelector(".hero-section-slider");
   startAutoSlide();
   updateSlidePosition();
});

onBeforeUnmount(() => {
   if (intervalId.value) {
      clearInterval(intervalId.value);
   }
});
</script>

<template>
   <div class="hero-section-container">
      <div class="hero-section-slider" ref="hero-section">
         <div
            v-for="(slide, index) in slides"
            :key="index"
            class="hero-section-slide"
            :style="{ backgroundImage: `url(${slide.image})` }"
         >
            <div class="hero-section-overlay"></div>
            <div class="hero-section-content">
               <h3 class="hero-section-subtitle">{{ slide.subtitle }}</h3>
               <h2 class="hero-section-title">{{ slide.title }}</h2>
               <a :href="slide.link" target="_blank" class="hero-section-btn"
                  >Tell me more</a
               >
            </div>
         </div>
      </div>
      <div class="hero-section-controls">
         <button class="hero-section-control-btn" @click="prevSlide">❮</button>
         <button class="hero-section-control-btn" @click="nextSlide">❯</button>
      </div>
   </div>
</template>

<style scoped>
.hero-section {
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 5px;
   background-color: var(--color-background-mute);
   text-align: center;
   transition: background-color 0.5s;
}

.hero-section-container {
   position: relative;
   width: 100%;
   height: 50vh;
   overflow: hidden;
   background-color: var(--color-background-mute);
   text-align: center;
}

.hero-section-slider {
   display: flex;
   width: 100%;
   height: 100%;
   scroll-behavior: smooth;
   overflow: hidden;
}

.hero-section-slide {
   flex: 0 0 100%;
   height: 100%;
   background-repeat: no-repeat;
   background-size: cover;
   background-position: center;
   position: relative;
}

.hero-section-overlay {
   position: absolute;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;
   background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.7)
   );
}

.hero-section-content {
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   color: white;
   text-align: center;
}

.hero-section-subtitle {
   font-size: 2rem;
   font-weight: 200;
   font-style: italic;
   color: rgba(255, 255, 255, 0.5);
   margin-bottom: 5px;
}

.hero-section-title {
   font-size: 3rem;
   text-transform: uppercase;
   margin-bottom: 40px;
}

.hero-section-btn {
   border: 1px solid white;
   padding: 10px 20px;
   font-size: 1rem;
   color: white;
   background-color: transparent;
   cursor: pointer;
   transition: all 0.3s;
}

.hero-section-btn:hover {
   background-color: white;
   color: black;
}

.hero-section-controls {
   position: absolute;
   top: 50%;
   width: 100%;
   display: flex;
   justify-content: space-between;
   transform: translateY(-50%);
}

.hero-section-control-btn {
   background: rgba(0, 0, 0, 0.5);
   color: white;
   border: none;
   border-radius: 50%;
   width: 50px;
   height: 50px;
   font-size: 1.5rem;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   transition: background 0.3s;
}

.hero-section-control-btn:hover {
   background: white;
   color: black;
}
</style>
