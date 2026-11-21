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
      <dl class="mt-8 grid gap-10 md:grid-cols-3">
        <div v-for="item in stack" :key="item.key">
          <dt class="font-bold text-neutral-900">
            {{ $t(`experiences.${item.key}.title`) }}
          </dt>
          <dd class="mt-2 text-sm leading-relaxed text-neutral-700">
            {{ $t(`experiences.${item.key}.description`) }}
          </dd>
          <dd class="mt-3 text-sm font-medium text-primary-700">
            {{ item.technologies.join(" · ") }}
          </dd>
        </div>
      </dl>
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
          technologies: ['Express', 'NestJS', 'Fastify', 'Socket.io']
        },
        {
          key: 'database',
          technologies: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis']
        },
        {
          key: 'webdevelopment',
          technologies: ['Vue.js', 'React', 'Angular', 'TypeScript']
        }
      ]
    }
  }
})
</script>
