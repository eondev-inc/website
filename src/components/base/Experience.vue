<template lang="">
  <div class="container flex flex-col w-full mx-auto space-y-8 md:flex-row md:w-full md:mt-14 md:justify-around md:first-letter ">
    <div class="flex flex-col rounded-sm bg-white shadow-md mx-2 mt-5 md:w-[420px]">
      <div class="py-4 px-6">
        <div class="mx-2 bg-lipsing-400 rounded-full items-center justify-center flex p-2 shadow-md w-16 h-16 m-4">
          <font-awesome-icon icon="fa-solid fa-code" class="icon text-black h-8" />
        </div>
        <h3 class="font-mono leading-0 tracking-normal font-semibold text-lg">
          {{ $t('experiences.node.title') }}
        </h3>
        <p class="text-justify leading-0 tracking-normal font-mono">
          {{ $t('experiences.node.description') }}
        </p>
      </div>
    </div>
    <div class="flex flex-col rounded-sm bg-white shadow-md mx-2 mt-5 md:w-[420px]">
      <div class="py-4 px-6">
        <div class="mx-2 bg-lavender-400 rounded-full items-center justify-center flex p-2 shadow-md w-16 h-16 m-4">
          <font-awesome-icon icon="fa-solid fa-database" class="icon text-black h-8" />
        </div>
        <h3 class="font-mono leading-0 tracking-normal font-semibold text-lg">
          {{ $t('experiences.database.title') }}
        </h3>
        <p class="text-justify leading-0 tracking-normal font-mono">
          {{ $t('experiences.database.description') }}
        </p>
      </div>
    </div>

    <div class="flex flex-col rounded-sm bg-white shadow-md mx-2 mt-5 md:w-[420px]">
      <div class="py-4 px-6">
        <div class="mx-2 bg-green-200 rounded-full items-center justify-center flex p-2 shadow-md w-16 h-16 m-4">
          <font-awesome-icon icon="fa-solid fa-file-code" class="icon text-black h-8" />
        </div>
        <h3 class="font-mono leading-0 tracking-normal font-semibold text-lg">
          {{ $t('experiences.webdevelopment.title') }}
        </h3>
        <p class="text-justify leading-0 tracking-normal font-mono">
          {{ $t('experiences.webdevelopment.description') }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'experience-pro'
})
</script>
