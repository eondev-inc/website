<template>
  <div class="container flex flex-col w-full mx-auto space-y-8 md:flex-row md:w-full md:mt-14 md:justify-around md:first-letter md:space-y-0 md:space-x-8">
    <div v-for="(experience, index) in experiences" :key="index" class="flex flex-col rounded-sm bg-white shadow-md mx-2 mt-5 md:w-[420px]">
      <div class="py-4 px-6">
        <div :class="`mx-2 ${experience.bgColor} rounded-full items-center justify-center flex p-2 shadow-md w-16 h-16 m-4`">
          <font-awesome-icon :icon="experience.icon" class="icon text-black h-8" />
        </div>
        <h3 class="font-mono leading-0 tracking-normal font-semibold text-lg">
          {{ $t(`experiences.${experience.key}.title`) }}
        </h3>
        <p class="text-justify leading-0 tracking-normal font-mono">
          {{ $t(`experiences.${experience.key}.description`) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'experience-pro',
  data() {
    return {
      experiences: [
        {
          key: 'node',
          bgColor: 'bg-lipsing-400',
          icon: ['fa-solid', 'fa-code']
        },
        {
          key: 'database',
          bgColor: 'bg-lavender-400',
          icon: ['fa-solid', 'fa-database']
        },
        {
          key: 'webdevelopment',
          bgColor: 'bg-green-200',
          icon: ['fa-solid', 'fa-file-code']
        }
      ]
    }
  }
})
</script>
