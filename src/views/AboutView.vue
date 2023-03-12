<template lang="">
  <div class="container md:mx-auto">
    <div class="flex flex-col-reverse w-full h-100
      justify-around aling-items-center top-0
      md:flex-row-reverse md:mt-14"
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
      </div>
      <div class="w-96 h-96 relative mt-6 mx-auto">
        <img src="../assets/img/Coding.png" alt="coding" title="coding-me" />
      </div>
    </div>
    <div class="mt-11 flex">
      <h3 class="text-2xl font-bold mb-6 text-gray-700 mr-4 hidden md:flex">Experiencia profesional</h3>
      <ol class="border-l-2 border-slateMedium-200 ml-4">
        <li v-for="(about, index) in localizedAboutMe[0]" :key="index">
          <div class="md:flex flex-start mr-4">
            <div
              class="bg-slateMedium-200 w-6 h-6 flex
              items-center justify-center rounded-full
              -ml-3 m-4"
            >
              <svg aria-hidden="true" focusable="false" data-prefix="fas" class="text-white w-3 h-3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
              </svg>
            </div>
            <div class="block p-6 rounded-lg shadow-lg bg-gray-50 w-full ml-6 mb-10 mx-10">
              <div class="flex justify-between mb-4">
                <a
                  href="#!"
                  class="font-medium text-slateMedium-200
                  hover:text-purple-700 focus:text-slateMedium-100
                  duration-300 transition ease-in-out text-sm"
                >
                  {{ about.title }}
                </a>
                <a href="#!"
                  class="font-medium text-slateMedium-200
                hover:text-purple-700 focus:text-slateMedium-100
                  duration-300 transition ease-in-out text-sm"
                >
                  {{ about.fromTo }}
                </a>
              </div>
              <p class="text-gray-700 mb-6 font-mono md:text-justify">
                {{ about.description }}
              </p>
              <button type="button"
                @click="toOutside(about.url)"
                class="inline-block px-4 py-1.5
                bg-slateMedium-200 text-white font-medium
                text-xs leading-tight uppercase rounded shadow-md
                hover:bg-purple-700 hover:shadow-lg
                focus:bg-purple-700 focus:shadow-lg focus:outline-none
                focus:ring-0 active:bg-slateMedium-100 active:shadow-lg
                transition duration-150 ease-in-out" data-mdb-ripple="true"
              >
                {{ $t('home.aboutMe.meSeeMore') }}
              </button>
            </div>
          </div>
        </li>
        <li>
          <div class="md:flex flex-start mr-4">
            <div
              class="bg-slateMedium-200 w-6 h-6 flex
              items-center justify-center rounded-full
              -ml-3 m-4"
            >
              <svg aria-hidden="true" focusable="false" data-prefix="fas" class="text-white w-3 h-3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
              </svg>
            </div>
            <div class="block p-6 rounded-lg shadow-lg bg-gray-50 w-full ml-6 mb-10 mx-10">
              <button type="button"
                @click="toOutside('https://www.linkedin.com/in/yromeroc')"
                class="inline-block px-4 py-1.5
                bg-slateMedium-200 text-white font-medium
                text-xs leading-tight uppercase rounded shadow-md
                hover:bg-purple-700 hover:shadow-lg
                focus:bg-purple-700 focus:shadow-lg focus:outline-none
                focus:ring-0 active:bg-slateMedium-100 active:shadow-lg
                transition duration-150 ease-in-out" data-mdb-ripple="true"
              >
              Linked
              <font-awesome-icon icon="fa-brands fa-linkedin-in" class="icon text-white" />
              </button>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useAboutMe from '../composables/use-about.composable'

export default defineComponent({
  name: 'about-me',
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
