<template>
  <div>
    <header class="top-0 w-full border-gray-400 shadow-md shadow-slate-300">
      <nav
        class="hidden max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto md:grid md:grid-flow-col py-3 sm:py-4 lg:flex justify-between">
        <!--Desktop-->
        <div class="col-start-1 col-end-2 flex items-center h-12 overflow-hidden">
          <img src="../../assets/img/logo_v3.png" />
        </div>
        <div class="flex flex-wrap h-12 items-end justify-between">
          <ul class="lg:flex col-start-4 col-end-8 text-black-500  items-center">
            <router-link
              to="/"
              @click="setActiveMenu('home')"
              :class="[ isActiveMenu === 'home' ? 'text-slateMedium-100 border-b-2 border-slateMedium-100' : '']"
              class="px-4 py-2 mx-2 cursor-pointer inline-block
              relative hover:py-1 hover:text-slateMedium-100
              hover:border-b-2 hover:border-slateMedium-100"
            >
              {{ $t('header.headerHome') }}
            </router-link>
            <router-link
              to="/about"
              @click="setActiveMenu('about')"
              :class="[ isActiveMenu === 'about' ? 'text-slateMedium-100 border-b-2 border-slateMedium-100' : '']"
              class="px-4 py-2 mx-2 cursor-pointer inline-block
              relative hover:py-1 text-black-500 hover:text-slateMedium-100
              hover:border-b-2 hover:border-slateMedium-100"
            >
              {{ $t('header.headerAbout') }}
            </router-link>
            <router-link
              to="/blog"
              @click="setActiveMenu('news')"
              :class="[ isActiveMenu === 'news' ? 'text-slateMedium-100 border-b-2 border-slateMedium-100' : '']"
              class="px-4 py-2 mx-2 cursor-pointer inline-block
              relative hover:py-1 text-black-500 hover:text-slateMedium-100
              hover:border-b-2 hover:border-slateMedium-100"
            >
              {{ $t('header.headerNews') }}
            </router-link>
            <router-link
              to="/contact"
              @click="setActiveMenu('cto')"
              :class="[ isActiveMenu === 'cto' ? 'text-slateMedium-100 border-b-2 border-slateMedium-100' : '']"
              class="px-4 py-2 mx-2 cursor-pointer inline-block
              relative hover:py-1 text-black-500 hover:text-slateMedium-100
              hover:border-b-2 hover:border-slateMedium-100"
            >
              {{ $t('header.headerCTA') }}
            </router-link>
          </ul>
        </div>
        <div class="font-medium justify-end items-center my-auto">
          <a href="https://github.com/eondev-inc" target="_blank" rel="noopener noreferrer">
            <div
              class="font-medium tracking-wide py-2 px-5 sm:px-8 border
              border-lipsing-500 text-slateMedium-500 bg-white-500
              outline-none rounded-l-full rounded-r-full capitalize
              hover:bg-slateMedium-500 hover:text-white md:transition-all
              hover:shadow-2xl"
            >
              <font-awesome-icon icon="fa-brands fa-github" /> Github Repo
            </div>
          </a>
        </div>
        <div class="flex justify-center relative mr-0">
          <button id="states-button" data-dropdown-toggle="dropdown-states"
          class="font-medium tracking-wide py-2 px-5 sm:px-8 border
              border-lipsing-500 text-slateMedium-500 bg-white-500
              outline-none rounded-l-full rounded-r-full capitalize
              hover:bg-slateMedium-500 hover:text-white md:transition-all
              hover:shadow-2xl" type="button"
          >
            Language
          </button>
          <div id="dropdown-states" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
              <li>
                <button type="button"
                  class="inline-flex w-full px-4 py-2 text-sm
                text-gray-700 hover:bg-gray-100 dark:text-gray-400
                dark:hover:bg-gray-600 dark:hover:text-white"
                @click="changeLanguage('en')"
                >
                  <div class="inline-flex items-center">
                    <img
                      src="../../assets/img/united-kingdom-flag-icon.svg"
                      alt="United Kingdom"
                      class="w-4 h-4"
                    />
                      &nbsp; English
                  </div>
                </button>
              </li>
              <li>
                <button type="button"
                  class="inline-flex w-full px-4 py-2 text-sm
                  text-gray-700 hover:bg-gray-100 dark:text-gray-400
                  dark:hover:bg-gray-600 dark:hover:text-white"
                  @click="changeLanguage('es')"
                >
                  <div class="inline-flex items-center">
                    <img
                      src="../../assets/img/spain-flag-icon.png"
                      alt="Spain"
                      class="w-4 h-4"
                    />
                    &nbsp; Spanish
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- Mobile -->
      <nav class="fixed md:hidden bottom-0 left-0 right-0 z-50 px-4 sm:px-8 shadow-t bg-white">
        <div class="bg-white-500 sm:px-3">
          <ul class="flex w-full justify-between items-center text-black-500">
            <router-link
              to="/"
              @click="setActiveMenu('home')"
              :class="[isActiveMenu === 'home' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs  transition-all   hover:border-slateMedium-100 hover:text-slateMedium-100">
              <svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ $t('header.headerHome') }}
            </router-link>
            <router-link
              to="/about"
              @click="setActiveMenu('about')"
              :class="[isActiveMenu === 'about' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs transition-all  hover:border-slateMedium-100 hover:text-slateMedium-100 ">
              <svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9">
                </path>
              </svg>
                {{ $t('header.headerAbout') }}
            </router-link>
            <router-link
              to="/blog"
              @click="setActiveMenu('news')"
              :class="[isActiveMenu === 'news' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs transition-all  hover:border-slateMedium-100 hover:text-slateMedium-100 ">
              <svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
              {{ $t('header.headerNews') }}
            </router-link>
            <router-link
              to="/contact"
              @click="setActiveMenu('cto')"
              :class="[isActiveMenu === 'cto' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs transition-all  hover:border-slateMedium-100 hover:text-slateMedium-100 ">
              <svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
              </svg>
              {{ $t('header.headerCTA') }}
            </router-link>
          </ul>
        </div>
      </nav>
    </header>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'header-view',
  setup() {
    const isActiveMenu: Ref<string> = ref('')
    const { locale } = useI18n()
    onMounted(() => {
      initFlowbite()
    })

    return {
      isActiveMenu,
      setActiveMenu: (name: string) => { isActiveMenu.value = name },
      changeLanguage: (lang: string) => { locale.value = lang }
    }
  }
})
</script>
<style lang="">
</style>
