<template>
  <div>
    <header class="top-0 w-full border-gray-400 shadow-md shadow-slate-300">
      <nav class="hidden max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4 lg:flex">
        <!---->
        <div class="col-start-1 col-end-2 flex items-center">
          <img src="../../assets/img/logo.png" class="h-12 w-16" />
        </div>
        <div class="flex flex-wrap h-12 items-end justify-between">
          <ul class="lg:flex col-start-4 col-end-8 text-black-500  items-center">
            <a
              class="px-4 py-2 mx-2 cursor-pointer inline-block relative hover:py-1 hover:text-slateMedium-100 hover:border-b-2 hover:border-slateMedium-100">Home</a>
            <a
              class="px-4 py-2 mx-2 cursor-pointer inline-block relative hover:py-1 text-black-500 hover:text-slateMedium-100 hover:border-b-2 hover:border-slateMedium-100">About</a>
            <a
              class="px-4 py-2 mx-2 cursor-pointer inline-block relative hover:py-1 text-black-500 hover:text-slateMedium-100 hover:border-b-2 hover:border-slateMedium-100">News</a>
            <a
              class="px-4 py-2 mx-2 cursor-pointer inline-block relative hover:py-1 text-black-500 hover:text-slateMedium-100 hover:border-b-2 hover:border-slateMedium-100">Call to action</a>
          </ul>
        </div>
        <div class="font-medium flex justify-end items-center ml-0">
          <button
            class="font-medium tracking-wide py-2 px-5 sm:px-8 border border-lipsing-500 text-slateMedium-500 bg-white-500 outline-none rounded-l-full rounded-r-full capitalize hover:bg-slateMedium-500 hover:text-white transition-all hover:shadow-2xl">
            <!-- -->
            <font-awesome-icon icon="fa-solid fa-user-secret" />Github Repo
          </button>
        </div>
      </nav>
      <nav class="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
        <div class="bg-white-500 sm:px-3">
          <ul class="flex w-full justify-between items-center text-black-500">
            <a
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all   border-slateMedium-100 text-slateMedium-100"><svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>About
            </a>
            <a
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all  border-transparent ">
              <svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9">
                </path>
              </svg>Feature
            </a>
            <a
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all  border-transparent ">
              <svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>Pricing
            </a>
            <a
              class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all  border-transparent ">
              <svg
                class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
              </svg>Testimonial
            </a>
          </ul>
        </div>
      </nav>
    </header>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'

export default defineComponent({
  name: 'header-view',
  setup() {
    const isActiveMenu: Ref<boolean> = ref(true)

    return {
      setActiveMenu: () => { return isActiveMenu }
    }
  }
})
</script>
<style lang="">
</style>
