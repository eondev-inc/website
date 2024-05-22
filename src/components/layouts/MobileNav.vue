<template>
  <nav class="fixed md:hidden bottom-0 left-0 right-0 z-50 px-4 sm:px-8 shadow-t bg-white">
    <div class="bg-white-500 sm:px-3">
      <ul class="flex w-full justify-between items-center text-black-500">
        <router-link
          to="/"
          :class="[isActiveMenu === 'home' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
          class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs  transition-all   hover:border-slateMedium-100 hover:text-slateMedium-100"
          @click="setActiveMenu('home')"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ $t('header.headerHome') }}
        </router-link>
        <router-link
          to="/about"
          :class="[isActiveMenu === 'about' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
          class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs transition-all  hover:border-slateMedium-100 hover:text-slateMedium-100 "
          @click="setActiveMenu('about')"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          {{ $t('header.headerAbout') }}
        </router-link>
        <router-link
          to="/blog"
          :class="[isActiveMenu === 'news' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
          class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs transition-all  hover:border-slateMedium-100 hover:text-slateMedium-100 "
          @click="setActiveMenu('news')"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ $t('header.headerNews') }}
        </router-link>
        <router-link
          to="/contact"
          :class="[isActiveMenu === 'cto' ? 'text-slateMedium-100 border-t-2 border-slateMedium-100' : '']"
          class="mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs transition-all  hover:border-slateMedium-100 hover:text-slateMedium-100 "
          @click="setActiveMenu('cto')"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {{ $t('header.headerCTA') }}
        </router-link>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const isActiveMenu = ref('home')
    const setActiveMenu = (menu: string) => {
      isActiveMenu.value = menu
    }

    return { isActiveMenu, setActiveMenu }
  }
})
</script>
