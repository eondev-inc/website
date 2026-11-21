<template>
  <ol class="divide-y divide-neutral-200 border-y border-neutral-200">
    <li
      v-for="job in jobs"
      :key="job.fromTo + job.employer"
      class="grid gap-x-10 gap-y-2 py-6 md:grid-cols-[12rem_1fr]"
    >
      <p class="text-sm font-semibold tabular-nums text-secondary-700 md:pt-1">
        {{ job.fromTo }}
      </p>
      <div>
        <h3 class="text-lg font-bold text-neutral-900">
          {{ job.role }}
          <span class="font-normal text-neutral-600">·</span>
          <a
            :href="job.href"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
            >{{ job.employer
            }}<span class="sr-only"> ({{ $t("career.opensNewTab") }})</span></a
          >
        </h3>
        <p
          v-if="!compact"
          class="mt-3 max-w-prose leading-relaxed text-neutral-700"
        >
          {{ job.description }}
        </p>
      </div>
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useAboutMe from '../../composables/use-about.composable'
import { externalHref } from '../../composables/utils/outbound-links'

export default defineComponent({
  name: 'CareerList',
  props: {
    compact: { type: Boolean, default: false }
  },
  setup() {
    const { aboutMeResume } = useAboutMe()
    const { locale } = useI18n()

    const jobs = computed(() =>
      (aboutMeResume[0] as any)[locale.value === 'en' ? 'en' : 'es'].map(
        (item: {
          title: string;
          description: string;
          url: string;
          fromTo: string;
        }) => {
          const cut = item.title.lastIndexOf(' - ')
          return {
            role: cut === -1 ? item.title : item.title.slice(0, cut),
            employer: cut === -1 ? '' : item.title.slice(cut + 3),
            description: item.description.replace(/\s+/g, ' ').trim(),
            fromTo: item.fromTo,
            href: externalHref(item.url)
          }
        }
      )
    )

    return { jobs }
  }
})
</script>
