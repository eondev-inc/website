<template lang="">
  <div class="container md:mx-auto">
    <div class="flex flex-col-reverse w-full h-100
      justify-around aling-items-center top-0
      md:flex-row md:mt-14"
    >
      <div class="about-me flex flex-col h-full w-[342px] mt-10 justify-center mx-auto">
        <h1 class="font-semibold leading-0 tracking-normal text-2xl">
          {{ $t('home.aboutMe.meTitle') }}
        </h1>
        <h3 class="font-semibold leading-0 tracking-tight text-xl">
          {{ $t('home.aboutMe.meSubs') }}
        </h3>
        <p class="font-mono text-justify">
          {{ $t('home.aboutMe.meDescription') }}
        </p>
        <div class="font-medium justify-center items-center mt-10 mx-auto">
          <router-link to="/about"
            class="font-medium tracking-wide py-2 px-5 sm:px-8 border
          border-lipsing-500 text-slateMedium-500 bg-white-500
            outline-none rounded-l-full rounded-r-full capitalize
          hover:bg-slateMedium-500 hover:text-white md:transition-all md:hover:shadow-2xl">
          {{ $t('home.aboutMe.meButton') }}
          </router-link>
        </div>
      </div>
      <div class="w-96 h-96 relative mt-6 mx-auto">
        <img src="../../assets/img/Coding.png" :alt="$t('home.aboutMe.meAltImage')" title="coding-me" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'about-me'
})
</script>
