<template>
  <!-- Hero Section Moderna -->
  <section class="section-hero bg-gradient-to-br from-neutral-50 via-secondary-50/20 to-primary-50/20 relative overflow-hidden">
    <!-- Background decorativo -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-300/10 rounded-full blur-2xl animate-pulse-soft"></div>
    </div>

    <!-- Grid pattern sutil -->
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 50px 50px;"></div>

    <div class="container-custom relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">

        <!-- Contenido Principal -->
        <div class="lg:pr-8 animate-slide-up">
          <!-- Badge profesional -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in" style="animation-delay: 0.2s;">
            <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            {{ $t('home.aboutMe.availability') }}
          </div>

          <!-- Título principal con gradiente -->
          <h1 class="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up" style="animation-delay: 0.3s;">
            {{ $t('home.aboutMe.greeting') }}
            <span class="text-gradient-hero block mt-2">
              {{ $t('home.aboutMe.name') }}
            </span>
          </h1>

          <!-- Subtítulo -->
          <h2 class="text-2xl lg:text-3xl font-display font-semibold text-neutral-600 mb-6 animate-slide-up" style="animation-delay: 0.4s;">
            {{ $t('home.aboutMe.title') }}
          </h2>

          <!-- Descripción mejorada -->
          <p class="text-lg text-neutral-600 leading-relaxed mb-8 max-w-2xl animate-slide-up" style="animation-delay: 0.5s;">
            {{ $t('home.aboutMe.description') }}
          </p>

          <!-- Estadísticas destacadas -->
          <div class="grid grid-cols-3 gap-6 mb-8 animate-slide-up" style="animation-delay: 0.6s;">
            <div class="text-center">
              <div class="text-3xl font-display font-bold text-primary-600 mb-1">7+</div>
              <div class="text-sm text-neutral-500 font-medium">{{ $t('home.aboutMe.yearsExp') }}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-display font-bold text-secondary-600 mb-1">50+</div>
              <div class="text-sm text-neutral-500 font-medium">{{ $t('home.aboutMe.projects') }}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-display font-bold text-accent-600 mb-1">10+</div>
              <div class="text-sm text-neutral-500 font-medium">{{ $t('home.aboutMe.technologies') }}</div>
            </div>
          </div>

          <!-- Stack de tecnologías -->
          <div class="mb-8 animate-slide-up" style="animation-delay: 0.7s;">
            <p class="text-sm text-neutral-500 font-medium mb-3">{{ $t('home.aboutMe.techStack') }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in techStack" :key="tech" class="px-3 py-1 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 hover:bg-white hover:shadow-soft transition-all duration-200">
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style="animation-delay: 0.8s;">
            <router-link to="/about" class="btn-primary inline-flex items-center justify-center gap-2 group">
              {{ $t('home.aboutMe.cta') }}
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </router-link>
            <router-link to="/contact" class="btn-outline inline-flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              {{ $t('home.aboutMe.contact') }}
            </router-link>
          </div>

          <!-- Social Links mejorados -->
          <div class="flex items-center gap-4 animate-slide-up" style="animation-delay: 0.9s;">
            <span class="text-sm text-neutral-500 font-medium">{{ $t('home.aboutMe.followMe') }}</span>
            <div class="flex gap-3">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-600 hover:text-primary-600 hover:bg-white hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200"
                :title="social.name"
              >
                <font-awesome-icon :icon="social.icon" class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <!-- Imagen/Visual mejorado -->
        <div class="relative lg:ml-8 animate-scale-in" style="animation-delay: 0.4s;">
          <!-- Elementos decorativos -->
          <div class="absolute -inset-4 bg-gradient-to-br from-secondary-200/30 to-primary-200/30 rounded-3xl blur-2xl"></div>
          <div class="absolute -inset-2 bg-gradient-to-br from-white/60 to-white/30 rounded-3xl backdrop-blur-sm"></div>

          <!-- Imagen principal -->
          <div class="relative bg-white rounded-3xl p-8 shadow-large hover:shadow-glow transition-all duration-500">
            <img
              src="../../assets/img/Coding.png"
              :alt="$t('home.aboutMe.imageAlt')"
              class="w-full h-auto rounded-2xl hover:scale-105 transition-transform duration-500"
            >

            <!-- Badge flotante -->
            <div class="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-large border border-neutral-200/50 animate-bounce-soft">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <font-awesome-icon icon="fa-solid fa-code" class="text-primary-600 text-lg" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-neutral-900">{{ $t('home.aboutMe.status') }}</div>
                  <div class="text-xs text-neutral-500">{{ $t('home.aboutMe.statusDetail') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Elementos decorativos adicionales -->
          <div class="absolute -top-4 -left-4 w-20 h-20 bg-secondary-300/30 rounded-full blur-xl animate-pulse-soft"></div>
          <div class="absolute -bottom-8 left-12 w-16 h-16 bg-primary-300/30 rounded-full blur-xl animate-pulse-soft" style="animation-delay: 1s;"></div>
        </div>
      </div>
    </div>

    <!-- Indicador de scroll -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-10 h-10 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-full flex items-center justify-center shadow-soft hover:shadow-lg transition-all duration-300">
        <font-awesome-icon icon="chevron-down" class="text-neutral-600 text-lg" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

// Datos del stack tecnológico
const techStack = [
  'Vue.js', 'Node.js', 'TypeScript', 'TailwindCSS',
  'MongoDB', 'MySQL', 'NestJS', 'Express'
]

// Enlaces sociales
const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/yromeroc/',
    icon: ['fab', 'linkedin-in']
  },
  {
    name: 'GitHub',
    url: 'https://github.com/eondev-inc',
    icon: ['fab', 'github']
  },
  {
    name: 'Blog',
    url: 'https://steemit.com/@seventrust',
    icon: ['fas', 'blog']
  }
]

onMounted(() => {
  // Inicializar animaciones cuando el componente se monte
  const elements = document.querySelectorAll('.animate-slide-up, .animate-fade-in, .animate-scale-in')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100')
        entry.target.classList.remove('opacity-0', 'translate-y-4', 'scale-95')
      }
    })
  }, { threshold: 0.1 })

  elements.forEach((el) => {
    el.classList.add('opacity-0', 'translate-y-4', 'scale-95')
    observer.observe(el)
  })
})
</script>
