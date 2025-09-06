<template>
  <!-- Sección de experiencias modernizada -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

    <!-- Header de la sección -->
    <div class="text-center mb-16 animate-fade-in">
      <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
        Experiencia Técnica
      </h2>
      <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
        Tecnologías y herramientas con las que he trabajado para crear soluciones escalables
      </p>
      <div class="w-24 h-1 bg-gradient-to-r from-secondary-500 to-primary-400 mx-auto mt-6 rounded-full"></div>
    </div>

    <!-- Grid de experience cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      <div
        v-for="(experience, index) in experiences"
        :key="index"
        class="group relative"
        :style="`animation-delay: ${index * 0.2}s`"
      >
        <!-- Card con glassmorphism y hover effects -->
        <div class="relative bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-3xl p-8 h-full transition-all duration-500 hover:bg-white hover:shadow-glow hover:-translate-y-2 animate-slide-up group">

          <!-- Background gradient en hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-secondary-50/50 to-primary-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <!-- Icon container moderno -->
          <div class="relative z-10">
            <div :class="`relative inline-flex items-center justify-center w-16 h-16 ${experience.bgGradient} rounded-2xl mb-6 shadow-soft group-hover:shadow-glow transition-all duration-500 group-hover:scale-110`">
              <font-awesome-icon
                :icon="experience.icon"
                class="w-7 h-7 text-white transition-transform duration-500 group-hover:rotate-12"
              />
              <!-- Glow effect -->
              <div class="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <!-- Title con gradient -->
            <h3 class="text-xl font-bold text-neutral-900 mb-4 group-hover:bg-gradient-to-r group-hover:from-secondary-600 group-hover:to-primary-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {{ $t(`experiences.${experience.key}.title`) }}
            </h3>

            <!-- Description mejorada -->
            <p class="text-neutral-600 leading-relaxed text-sm group-hover:text-neutral-700 transition-colors duration-300">
              {{ $t(`experiences.${experience.key}.description`) }}
            </p>

            <!-- Tech badges -->
            <div class="flex flex-wrap gap-2 mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
              <span
                v-for="tech in experience.technologies"
                :key="tech"
                class="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Decorative elements -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-tl from-primary-200 to-secondary-200 rounded-full opacity-10 group-hover:opacity-30 transition-all duration-500 group-hover:scale-125"></div>
        </div>

        <!-- Hover border effect -->
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary-400 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-105"></div>
      </div>
    </div>

    <!-- Call to action sutil -->
    <div class="text-center mt-16 animate-fade-in-up" style="animation-delay: 0.8s">
      <p class="text-neutral-600 mb-6">
        ¿Quieres saber más sobre mi experiencia técnica?
      </p>
      <router-link
        to="/about"
        class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary-600 to-primary-400 text-white rounded-xl hover:from-secondary-700 hover:to-primary-500 transition-all duration-300 shadow-soft hover:shadow-glow hover:-translate-y-0.5"
      >
        <span>Ver más detalles</span>
        <svg class="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExperiencePro',
  data() {
    return {
      experiences: [
        {
          key: 'node',
          bgGradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
          icon: ['fas', 'fa-code'],
          technologies: ['Express', 'NestJS', 'Fastify', 'Socket.io']
        },
        {
          key: 'database',
          bgGradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          icon: ['fas', 'fa-database'],
          technologies: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis']
        },
        {
          key: 'webdevelopment',
          bgGradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
          icon: ['fas', 'fa-code'],
          technologies: ['Vue.js', 'React', 'Angular', 'TypeScript']
        }
      ]
    }
  }
})
</script>

<style scoped>
/* Animaciones para las experience cards */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
  animation-fill-mode: both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
  animation-fill-mode: both;
}

/* Efectos de hover personalizados */
.group:hover .group-hover\:rotate-12 {
  transform: rotate(12deg);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:scale-125 {
  transform: scale(1.25);
}

/* Mejoras de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
