<template>
  <div>
    <header class="top-0 w-full border-gray-400 shadow-md shadow-slate-300">
      <nav class="hidden max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto md:grid md:grid-flow-col py-3 sm:py-4 lg:flex justify-between">
        <div class="col-start-1 col-end-2 flex items-center h-12 overflow-hidden">
          <img src="../../assets/img/logo_v3.png">
        </div>
        <ul class="lg:flex col-start-4 col-end-8 text-black-500 items-center">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            :class="[
              isActiveMenu === item.name
                ? 'text-slateMedium-100 border-b-2 border-slateMedium-100'
                : '',
            ]"
            class="px-4 py-2 mx-2 cursor-pointer inline-block
            relative hover:py-1 hover:text-slateMedium-100
            hover:border-b-2 hover:border-slateMedium-100"
            @click="setActiveMenu(item.name)"
          >
            {{ $t(item.i18nKey) }}
          </router-link>
        </ul>
        <div class="font-medium justify-end items-center my-auto">
          <a
            href="https://github.com/eondev-inc"
            target="_blank"
            rel="noopener noreferrer"
          >
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
        <language-selector @changeLanguage="changeLanguage" />
      </nav>
      <mobile-nav
        :nav-items="navItems"
        :is-active-menu="isActiveMenu"
        @setActiveMenu="setActiveMenu"
      />
    </header>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useI18n } from 'vue-i18n'
import LanguageSelector from './LanguageSelector.vue'
import MobileNav from './MobileNav.vue'

export default defineComponent({
  name: 'HeaderView',
  components: {
    LanguageSelector,
    MobileNav
  },
  setup() {
    const isActiveMenu: Ref<string> = ref('')
    const { locale } = useI18n()
    onMounted(() => {
      initFlowbite()
    })

    const navItems = [
      { name: 'home', to: '/', i18nKey: 'header.headerHome' },
      { name: 'about', to: '/about', i18nKey: 'header.headerAbout' },
      { name: 'news', to: '/blog', i18nKey: 'header.headerNews' },
      { name: 'cto', to: '/contact', i18nKey: 'header.headerCTA' }
    ]

    return {
      navItems,
      isActiveMenu,
      setActiveMenu: (name: string) => { isActiveMenu.value = name },
      changeLanguage: (lang: string) => { locale.value = lang }
    }
  }
})
</script>
<style lang="">
</style>
