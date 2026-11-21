<template>
  <!-- About View Completamente Renovado -->
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 bg-neutral-50 overflow-hidden">
      <div class="container-custom relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Contenido Principal -->
          <div class="animate-slide-up">
            <!-- Badge -->
            <div
              class="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-6"
            >
              <div class="w-2 h-2 bg-secondary-500 rounded-full"></div>
              {{ $t("about.badge") }}
            </div>

            <!-- Título principal -->
            <h1
              class="text-4xl lg:text-6xl font-display font-bold leading-tight mb-6"
            >
              {{ $t("home.aboutMe.meTitle") }}
              <span class="text-primary-700 block mt-2">
                {{ $t("home.aboutMe.meSubs") }}
              </span>
            </h1>

            <!-- Descripción -->
            <p class="text-lg text-neutral-600 leading-relaxed mb-8 max-w-2xl">
              {{ $t("home.aboutMe.meDescription") }}
            </p>

            <!-- Botones de acción -->
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
              <router-link
                to="/contact"
                class="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                {{ $t("about.cta.buttonContact") }}
                <svg
                  class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </router-link>
              <a
                href="https://www.linkedin.com/in/yromeroc"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-outline inline-flex items-center justify-center gap-2"
              >
                <font-awesome-icon
                  icon="fa-brands fa-linkedin-in"
                  class="w-4 h-4"
                />
                LinkedIn
              </a>
            </div>
          </div>

          <!-- Imagen -->
          <div
            class="relative lg:ml-8 animate-scale-in"
            style="animation-delay: 0.4s"
          >
            <!-- Imagen principal -->
            <div
              class="relative bg-white rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-500"
            >
              <img
                src="../assets/img/Coding.png"
                alt="coding"
                title="coding-me"
                class="w-full h-auto rounded-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trayectoria -->
    <section class="py-16 lg:py-24 bg-white" aria-labelledby="timeline-title">
      <div
        class="container-custom grid gap-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16"
      >
        <div>
          <h2
            id="timeline-title"
            class="font-display text-3xl lg:text-4xl font-bold text-neutral-900"
          >
            {{ $t("home.aboutMe.meFirts") }}
          </h2>
          <p class="mt-4 max-w-sm text-neutral-600">
            {{ $t("about.timeline.intro") }}
          </p>
        </div>
        <div>
          <career-list />
          <p class="mt-8 text-neutral-700">
            {{ $t("about.linkedin.description") }}
            <a
              href="https://www.linkedin.com/in/yromeroc"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-700"
              >{{ $t("about.linkedin.button")
              }}<span class="sr-only">
                ({{ $t("career.opensNewTab") }})</span
              ></a
            >
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 lg:py-24 bg-neutral-50 relative overflow-hidden">
      <div class="container-custom relative z-10">
        <div class="text-center max-w-3xl mx-auto animate-fade-in">
          <h2 class="text-3xl lg:text-4xl font-bold mb-6">
            <span class="text-primary-700">{{ $t("about.cta.title") }}</span>
          </h2>
          <p class="text-lg text-neutral-600 mb-8 leading-relaxed">
            {{ $t("about.cta.description") }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/contact"
              class="btn-primary inline-flex items-center justify-center gap-2 group"
            >
              {{ $t("about.cta.buttonContact") }}
              <svg
                class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import CareerList from '../components/base/CareerList.vue'

export default defineComponent({
  name: 'AboutView',
  components: { CareerList }
})
</script>
