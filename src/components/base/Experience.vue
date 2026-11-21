<template>
  <section
    class="container-custom py-16 lg:py-24"
    aria-labelledby="career-title"
  >
    <div class="grid gap-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
      <div>
        <h2
          id="career-title"
          class="font-display text-3xl font-bold text-neutral-900 lg:text-4xl"
        >
          {{ $t("career.title") }}
        </h2>
        <p class="mt-4 max-w-sm text-neutral-600">
          {{ $t("about.timeline.intro") }}
        </p>
        <router-link
          to="/about"
          class="mt-6 inline-flex items-center gap-2 font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-700"
        >
          {{ $t("career.fullHistory") }}
          <span aria-hidden="true">→</span>
        </router-link>
      </div>

      <career-list compact />
    </div>

    <div class="mt-16 border-t border-neutral-200 pt-12">
      <h2 class="font-display text-2xl font-bold text-neutral-900">
        {{ $t("career.stackTitle") }}
      </h2>
      <ul class="mt-8 grid gap-10 md:grid-cols-3">
        <li v-for="item in stack" :key="item.key">
          <div
            class="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-primary-100 bg-primary-50 text-primary-700"
            aria-hidden="true"
          >
            <font-awesome-icon :icon="item.icon" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 font-bold text-neutral-900">
            {{ $t(`experiences.${item.key}.title`) }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-neutral-700">
            {{ $t(`experiences.${item.key}.description`) }}
          </p>
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="tech in item.technologies"
              :key="tech"
              class="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
            >
              {{ tech }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CareerList from './CareerList.vue'

export default defineComponent({
  name: 'ExperiencePro',
  components: { CareerList },
  data() {
    return {
      stack: [
        {
          key: 'node',
          icon: ['fas', 'fa-code'],
          technologies: ['Express', 'NestJS', 'Fastify', 'Socket.io']
        },
        {
          key: 'database',
          icon: ['fas', 'fa-database'],
          technologies: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis']
        },
        {
          key: 'webdevelopment',
          icon: ['fas', 'fa-code'],
          technologies: ['Vue.js', 'React', 'Angular', 'TypeScript']
        }
      ]
    }
  }
})
</script>
