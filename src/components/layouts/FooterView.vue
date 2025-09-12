<template>
  <footer class="bg-gradient-to-t from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-white relative overflow-hidden">

    <!-- Background decorativo -->
    <div class="absolute inset-0 bg-gradient-to-br from-secondary-900/20 via-transparent to-primary-900/20 pointer-events-none" />
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
    <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />

    <div class="relative max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">

      <!-- Main footer content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        <!-- Brand section -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Logo y marca -->
          <div class="flex items-center space-x-3">
            <img
              src="../../assets/img/logo_v1.png"
              alt="EonDev Logo"
              class="h-11 w-auto bg-white p-2 rounded-lg"
            >
            <div class="flex flex-col">
              <span class="text-xl font-bold text-white">Y|R</span>
              <span class="text-sm text-neutral-400">Portfolio</span>
            </div>
          </div>

          <!-- Descripción -->
          <p class="text-neutral-300 text-lg leading-relaxed max-w-md">
            {{ $t('footer.mainMessage') }}
          </p>

          <!-- Social links modernos -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-neutral-400 font-medium">{{ $t('footer.followMe') }}</span>
            <div class="flex space-x-3">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                  'bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white',
                  'hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/10'
                ]"
                :title="social.name"
              >
                <font-awesome-icon :icon="social.icon" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <!-- Navigation links -->
        <div class="lg:col-span-4 grid grid-cols-2 gap-8">
          <!-- Navegación -->
          <div class="space-y-4">
            <h3 class="text-white font-semibold text-lg">{{ $t('footer.navigation') }}</h3>
            <ul class="space-y-3">
              <li v-for="item in navItems" :key="item.name">
                <router-link
                  :to="item.to"
                  class="text-neutral-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  {{ $t(item.i18nKey) }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Tecnologías -->
          <div class="space-y-4">
            <h3 class="text-white font-semibold text-lg">{{ $t('footer.technologies') }}</h3>
            <ul class="space-y-3">
              <li v-for="tech in technologies" :key="tech">
                <span class="text-neutral-300 text-sm">{{ tech }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact info -->
        <div class="lg:col-span-3 space-y-4">
          <h3 class="text-white font-semibold text-lg">{{ $t('footer.contact') }}</h3>
          <div class="space-y-3">
            <p class="text-neutral-300 text-sm">
              {{ $t('footer.projectInMind') }}
            </p>
            <router-link
              to="/contact"
              class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary-600 to-primary-400 text-white rounded-xl hover:from-secondary-700 hover:to-primary-500 transition-all duration-300 shadow-soft hover:shadow-glow hover:-translate-y-0.5 text-sm font-medium"
            >
              <span>{{ $t('footer.letsChat') }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/10 mt-12 pt-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">

          <!-- Copyright -->
          <div class="flex items-center space-x-4">
            <p class="text-neutral-400 text-sm">
              © {{ new Date().getFullYear() }} EonDev. {{ $t('footer.allRightsReserved') }}.
            </p>
          </div>

          <!-- Status indicator -->
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span class="text-neutral-400 text-sm">{{ $t('footer.availableForProjects') }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterView',
  setup() {
    const socialLinks = [
      {
        name: 'GitHub',
        url: 'https://github.com/eondev-inc',
        icon: ['fab', 'fa-github']
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/yromeroc/',
        icon: ['fab', 'fa-linkedin-in']
      },
      {
        name: 'Blog',
        url: 'https://steemit.com/@seventrust',
        icon: ['fas', 'fa-blog']
      }
    ]

    const navItems = [
      { name: 'home', to: '/', i18nKey: 'header.headerHome' },
      { name: 'about', to: '/about', i18nKey: 'header.headerAbout' },
      { name: 'blog', to: '/blog', i18nKey: 'header.headerNews' },
      { name: 'contact', to: '/contact', i18nKey: 'header.headerCTA' }
    ]

    const technologies = [
      'Vue.js 3',
      'TypeScript',
      'Node.js',
      'TailwindCSS',
      'MongoDB',
      'PostgreSQL'
    ]

    return {
      socialLinks,
      navItems,
      technologies
    }
  }
})
</script>
<style lang="">
</style>
