<template>
  <div class="container mx-auto md:mt-14">
    <div class="flex flex-col-reverse items-center justify-around w-full h-100 md:flex-row">
      <div class="about-me flex flex-col items-center justify-center h-full w-[342px] mt-10">
        <h1 class="text-2xl font-semibold leading-none tracking-normal">
          {{ $t('home.aboutMe.meTitle') }}
        </h1>
        <h3 class="text-xl font-semibold leading-none tracking-tight">
          {{ $t('home.aboutMe.meSubs') }}
        </h3>
        <p class="font-mono text-justify">
          {{ $t('home.aboutMe.meDescription') }}
        </p>
        <div class="mt-10">
          <router-link
            to="/about"
            class="px-5 py-2 md:px-8 font-medium tracking-wide border border-lipsing-500 text-slateMedium-500 bg-white-500 rounded-full capitalize hover:bg-slateMedium-500 hover:text-white md:transition-all md:hover:shadow-2xl"
          >
            {{ $t('home.aboutMe.meButton') }}
          </router-link>
        </div>
      </div>
      <div class="relative w-96 h-96 mt-6">
        <img
          src="../../assets/img/Coding.png"
          :alt="$t('home.aboutMe.meAltImage')"
          title="coding-me"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutMe'
})
</script>
