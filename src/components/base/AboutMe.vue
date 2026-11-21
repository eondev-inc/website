<template>
  <!-- Hero Section Moderna -->
  <section
    ref="rootEl"
    class="section-hero bg-neutral-50 relative overflow-hidden"
  >
    <div class="container-custom relative z-10">
      <div
        class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24"
      >
        <!-- Contenido Principal -->
        <div class="lg:pr-8 animate-slide-up">
          <!-- Badge profesional -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in"
            style="animation-delay: 0.2s"
          >
            <div class="w-2 h-2 bg-primary-600 rounded-full"></div>
            {{ $t("home.aboutMe.availability") }}
          </div>

          <!-- Título principal con énfasis plano -->
          <h1
            class="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up"
            style="animation-delay: 0.3s"
          >
            {{ $t("home.aboutMe.greeting") }}
            <span class="text-primary-700 block mt-2">
              {{ $t("home.aboutMe.name") }}
            </span>
          </h1>

          <!-- Subtítulo -->
          <h2
            class="text-2xl lg:text-3xl font-display font-semibold text-neutral-600 mb-6 animate-slide-up"
            style="animation-delay: 0.4s"
          >
            {{ $t("home.aboutMe.title") }}
          </h2>

          <!-- Descripción mejorada -->
          <p
            class="text-lg text-neutral-600 leading-relaxed mb-8 max-w-2xl animate-slide-up"
            style="animation-delay: 0.5s"
          >
            {{ $t("home.aboutMe.description") }}
          </p>

          <!-- Stack de tecnologías -->
          <div class="mb-8 animate-slide-up" style="animation-delay: 0.7s">
            <p class="text-sm text-neutral-600 font-medium mb-3">
              {{ $t("home.aboutMe.techStack") }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in techStack"
                :key="tech"
                class="px-3 py-1 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 hover:bg-white hover:shadow-soft transition-all duration-200"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div
            class="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up"
            style="animation-delay: 0.8s"
          >
            <router-link
              to="/contact"
              class="btn-primary inline-flex items-center justify-center gap-2"
            >
              {{ $t("home.aboutMe.contact") }}
            </router-link>
            <router-link
              to="/about"
              class="btn-outline inline-flex items-center justify-center gap-2"
            >
              {{ $t("home.aboutMe.cta") }}
            </router-link>
          </div>

          <p class="mb-8 text-neutral-700">
            <a
              :href="`mailto:${contactEmail}`"
              class="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-700"
              >{{ contactEmail }}</a
            >
          </p>

          <!-- Social Links mejorados -->
          <div
            class="flex items-center gap-4 animate-slide-up"
            style="animation-delay: 0.9s"
          >
            <span class="text-sm text-neutral-600 font-medium">{{
              $t("home.aboutMe.followMe")
            }}</span>
            <div class="flex gap-3">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="w-11 h-11 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-600 hover:text-primary-700 hover:border-primary-600 transition-colors duration-200"
                :title="social.name"
                :aria-label="social.name"
              >
                <font-awesome-icon :icon="social.icon" class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <!-- Imagen/Visual mejorado -->
        <div
          class="relative lg:ml-8 animate-scale-in"
          style="animation-delay: 0.4s"
        >
          <!-- Imagen principal -->
          <div
            class="relative bg-white rounded-lg border border-neutral-200 p-8"
          >
            <img
              src="../../assets/img/Coding.png"
              :alt="$t('home.aboutMe.imageAlt')"
              class="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { CONTACT_EMAIL } from '@/config/contact'

const contactEmail = CONTACT_EMAIL

const rootEl = ref<HTMLElement | null>(null)

// Datos del stack tecnológico
const techStack = [
  'Vue.js',
  'Node.js',
  'TypeScript',
  'TailwindCSS',
  'MongoDB',
  'MySQL',
  'NestJS',
  'Express'
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

// El observer se limita a este componente: un query global forzaba opacity-0
// en las secciones de Experience y OurBlog, que solo reaparecían al scrollear.
let observer: IntersectionObserver | null = null

onMounted(() => {
  // Inicializar animaciones cuando el componente se monte
  const elements =
    rootEl.value?.querySelectorAll(
      '.animate-slide-up, .animate-fade-in, .animate-scale-in'
    ) ?? []
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            'opacity-100',
            'translate-y-0',
            'scale-100'
          )
          entry.target.classList.remove(
            'opacity-0',
            'translate-y-4',
            'scale-95'
          )
        }
      })
    },
    { threshold: 0.1 }
  )

  elements.forEach((el) => {
    el.classList.add('opacity-0', 'translate-y-4', 'scale-95')
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>
