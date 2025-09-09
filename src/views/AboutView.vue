<template>
  <!-- About View Completamente Renovado -->
  <div class="min-h-screen">

    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 bg-gradient-to-br from-neutral-50 via-secondary-50/20 to-primary-50/20 overflow-hidden">

      <!-- Background decorativo -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-float"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-300/10 rounded-full blur-2xl animate-pulse-soft"></div>
      </div>

      <div class="container-custom relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <!-- Contenido Principal -->
          <div class="animate-slide-up">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-6">
              <div class="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
              Sobre mí
            </div>

            <!-- Título principal -->
            <h1 class="text-4xl lg:text-6xl font-display font-bold leading-tight mb-6">
              {{ $t('home.aboutMe.meTitle') }}
              <span class="text-gradient-hero block mt-2">
                {{ $t('home.aboutMe.meSubs') }}
              </span>
            </h1>

            <!-- Descripción -->
            <p class="text-lg text-neutral-600 leading-relaxed mb-8 max-w-2xl">
              {{ $t('home.aboutMe.meDescription') }}
            </p>

            <!-- Botones de acción -->
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
              <router-link to="/contact" class="btn-primary inline-flex items-center justify-center gap-2 group">
                Trabajemos juntos
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </router-link>
              <a
                href="https://www.linkedin.com/in/yromeroc"
                target="_blank"
                class="btn-outline inline-flex items-center justify-center gap-2"
              >
                <font-awesome-icon icon="fa-brands fa-linkedin-in" class="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          <!-- Imagen -->
          <div class="relative lg:ml-8 animate-scale-in" style="animation-delay: 0.4s;">
            <!-- Elementos decorativos -->
            <div class="absolute -inset-4 bg-gradient-to-br from-secondary-200/30 to-primary-200/30 rounded-3xl blur-2xl"></div>
            <div class="absolute -inset-2 bg-gradient-to-br from-white/60 to-white/30 rounded-3xl backdrop-blur-sm"></div>

            <!-- Imagen principal -->
            <div class="relative bg-white rounded-3xl p-8 shadow-large hover:shadow-glow transition-all duration-500">
              <img
                src="../assets/img/Coding.png"
                alt="coding"
                title="coding-me"
                class="w-full h-auto rounded-2xl hover:scale-105 transition-transform duration-500"
              >
            </div>

            <!-- Elementos decorativos adicionales -->
            <div class="absolute -top-4 -left-4 w-20 h-20 bg-secondary-300/30 rounded-full blur-xl animate-pulse-soft"></div>
            <div class="absolute -bottom-8 left-12 w-16 h-16 bg-primary-300/30 rounded-full blur-xl animate-pulse-soft" style="animation-delay: 1s;"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="py-16 lg:py-24 bg-white">
      <div class="container-custom">

        <!-- Header de la sección -->
        <div class="text-center mb-16 animate-fade-in">
          <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            {{ $t('home.aboutMe.meFirts') }}
          </h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            Mi trayectoria profesional y experiencias más destacadas
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-secondary-500 to-primary-400 mx-auto mt-6 rounded-full"></div>
        </div>

        <!-- Timeline moderna -->
        <div class="relative">
          <!-- Línea central -->
          <div class="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary-200 via-primary-300 to-secondary-200"></div>

          <div class="space-y-12">
            <div
              v-for="(about, index) in localizedAboutMe[0]"
              :key="index"
              class="relative animate-slide-up"
              :style="`animation-delay: ${index * 0.2}s`"
            >

              <!-- Punto en la línea -->
              <div class="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-400 rounded-full flex items-center justify-center shadow-large z-10">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </div>

              <!-- Card -->
              <div class="ml-16 md:ml-0 group">
                <div :class="index % 2 === 0 ? 'md:pr-8 md:text-right md:mr-auto md:w-1/2' : 'md:pl-8 md:ml-auto md:w-1/2'">
                  <div class="relative bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-3xl p-8 shadow-soft hover:shadow-glow hover:-translate-y-2 transition-all duration-500 group-hover:bg-white">

                    <!-- Background gradient en hover -->
                    <div class="absolute inset-0 bg-gradient-to-br from-secondary-50/50 to-primary-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <!-- Contenido -->
                    <div class="relative z-10">
                      <!-- Header -->
                      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                        <h3 class="text-xl font-bold text-neutral-900 group-hover:text-gradient transition-all duration-300">
                          {{ about.title }}
                        </h3>
                        <span class="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                          {{ about.fromTo }}
                        </span>
                      </div>

                      <!-- Descripción -->
                      <p class="text-neutral-600 leading-relaxed mb-6">
                        {{ about.description }}
                      </p>

                      <!-- Botón -->
                      <button
                        @click="toOutside(about.url)"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary-500 to-primary-400 text-white rounded-xl hover:from-secondary-600 hover:to-primary-500 transition-all duration-300 shadow-soft hover:shadow-glow hover:-translate-y-0.5 text-sm font-medium"
                      >
                        {{ $t('home.aboutMe.meSeeMore') }}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Decorative elements -->
                    <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- LinkedIn Card especial -->
            <div class="relative animate-slide-up" style="animation-delay: 1s;">

              <!-- Punto en la línea -->
              <div class="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-400 rounded-full flex items-center justify-center shadow-large z-10">
                <font-awesome-icon icon="fa-brands fa-linkedin-in" class="w-4 h-4 text-white" />
              </div>

              <!-- Card -->
              <div class="ml-16 md:ml-0 group">
                <div class="md:pr-8 md:text-right md:mr-auto md:w-1/2">
                  <div class="relative bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-3xl p-8 shadow-soft hover:shadow-glow hover:-translate-y-2 transition-all duration-500 group-hover:bg-white">

                    <!-- Background gradient en hover -->
                    <div class="absolute inset-0 bg-gradient-to-br from-secondary-50/50 to-primary-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <!-- Contenido -->
                    <div class="relative z-10">
                      <h3 class="text-xl font-bold text-neutral-900 mb-4 group-hover:text-gradient transition-all duration-300">
                        Conecta conmigo
                      </h3>
                      <p class="text-neutral-600 leading-relaxed mb-6">
                        Sígueme en LinkedIn para más actualizaciones sobre mi trabajo y proyectos.
                      </p>
                      <button
                        @click="toOutside('https://www.linkedin.com/in/yromeroc')"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary-500 to-primary-400 text-white rounded-xl hover:from-secondary-600 hover:to-primary-500 transition-all duration-300 shadow-soft hover:shadow-glow hover:-translate-y-0.5 text-sm font-medium"
                      >
                        <font-awesome-icon icon="fa-brands fa-linkedin-in" class="w-4 h-4" />
                        Ver LinkedIn
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Decorative elements -->
                    <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 lg:py-24 bg-gradient-to-br from-secondary-50 via-white to-primary-50 relative overflow-hidden">

      <!-- Background decorativo -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-20 w-32 h-32 bg-secondary-200/30 rounded-full blur-xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-24 h-24 bg-primary-200/30 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div class="container-custom relative z-10">
        <div class="text-center max-w-3xl mx-auto animate-fade-in">
          <h2 class="text-3xl lg:text-4xl font-bold mb-6">
            <span class="text-gradient">¿Listo para trabajar juntos?</span>
          </h2>
          <p class="text-lg text-neutral-600 mb-8 leading-relaxed">
            Si tienes un proyecto en mente o simplemente quieres conectar, estaré encantado de escucharte.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/contact" class="btn-primary inline-flex items-center justify-center gap-2 group">
              Iniciar conversación
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </router-link>
            <router-link to="/" class="btn-outline inline-flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Ir al inicio
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useAboutMe from '../composables/use-about.composable'

export default defineComponent({
  name: 'AboutMe',
  setup() {
    const { aboutMeResume } = useAboutMe()
    const { locale } = useI18n()
    const currentLocale = computed(() => locale.value)

    const localizedAboutMe = computed(() => {
      return aboutMeResume.map((about) => {
        return about[currentLocale.value]
      })
    })

    return {
      localizedAboutMe,
      toOutside: (url: string) => {
        window.open(url, '_blank')
      }
    }
  }
})
</script>

<style lang="">
</style>
