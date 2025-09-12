<template>
  <div>
    <!-- Header elegante y minimalista -->
    <header
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-700 shadow-sm'
          : 'bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm'
      ]"
    >
      <nav class="max-w-6xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-18">
          <!-- Logo elegante y simple -->
          <router-link
            to="/"
            class="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            @click="setActiveMenu('home')"
          >
            <div class="relative">
              <img
                src="../../assets/img/logo_v1.png"
                alt="EonDev Logo"
                class="h-18 w-auto"
              >
            </div>
            <div class="hidden sm:flex flex-col">
              <span class="text-lg font-bold text-neutral-800 dark:text-neutral-200 leading-tight">Y|R</span>
              <span class="text-xs text-neutral-500 dark:text-neutral-400 -mt-1">Portfolio</span>
            </div>
          </router-link>

          <!-- Navegación central elegante -->
          <div class="hidden lg:flex items-center">
            <div class="flex items-center bg-neutral-50/80 rounded-full p-1 border border-neutral-200/50">
              <router-link
                v-for="item in navItems"
                :key="item.name"
                :to="item.to"
                :class="[
                  'relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300',
                  isActiveMenu === item.name || $route.name === item.name
                    ? 'bg-white dark:bg-neutral-800 text-primary-700 dark:text-primary-400 shadow-soft'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-white/50 dark:hover:bg-neutral-800/50'
                ]"
                @click="setActiveMenu(item.name)"
              >
                {{ $t(item.i18nKey) }}
              </router-link>
            </div>
          </div>

          <!-- Área derecha con CTA y controles -->
          <div class="flex items-center space-x-3">
            <!-- GitHub link elegante -->
            <a
              href="https://github.com/eondev-inc"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden sm:flex items-center space-x-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-full hover:bg-primary-700 dark:hover:bg-primary-400 transition-all duration-300 hover:shadow-soft hover:scale-105"
            >
              <font-awesome-icon
                icon="fa-brands fa-github"
                class="w-4 h-4"
              />
              <span class="hidden md:inline">GitHub</span>
            </a>

            <!-- Language Selector minimalista -->
            <div class="relative">
              <language-selector
                @changeLanguage="changeLanguage"
              />
            </div>

            <!-- Theme Toggle -->
            <div class="relative">
              <theme-toggle :simple-toggle="false" />
            </div>

            <!-- Mobile menu button elegante -->
            <button
              @click="toggleMobileNav"
              class="lg:hidden relative w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
            >
              <div class="w-4 h-4 flex flex-col justify-center items-center space-y-1">
                <span
                  :class="[
                    'block h-0.5 w-4 bg-current transition-all duration-300 rounded-full',
                    isMobileNavOpen ? 'rotate-45 translate-y-1.5' : ''
                  ]"
                />
                <span
                  :class="[
                    'block h-0.5 w-4 bg-current transition-all duration-300 rounded-full',
                    isMobileNavOpen ? 'opacity-0' : 'opacity-100'
                  ]"
                />
                <span
                  :class="[
                    'block h-0.5 w-4 bg-current transition-all duration-300 rounded-full',
                    isMobileNavOpen ? '-rotate-45 -translate-y-1.5' : ''
                  ]"
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Navigation elegante -->
      <div
        :class="[
          'lg:hidden transition-all duration-300 overflow-hidden',
          isMobileNavOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        ]"
      >
        <div class="bg-white/98 dark:bg-neutral-900/98 backdrop-blur-xl border-t border-neutral-100 dark:border-neutral-700">
          <div class="max-w-6xl mx-auto px-6 py-8">
            <div class="space-y-2">
              <router-link
                v-for="item in navItems"
                :key="item.name"
                :to="item.to"
                :class="[
                  'block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200',
                  isActiveMenu === item.name || $route.name === item.name
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                ]"
                @click="setActiveMenu(item.name); isMobileNavOpen = false"
              >
                {{ $t(item.i18nKey) }}
              </router-link>

              <!-- Separador sutil -->
              <div class="my-4 h-px bg-neutral-200" />

              <!-- GitHub link para mobile -->
              <a
                href="https://github.com/eondev-inc"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-primary-700 transition-all duration-300"
              >
                <font-awesome-icon icon="fa-brands fa-github" class="w-5 h-5" />
                <span>{{ $t('header.viewOnGithub') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Spacer ajustado -->
    <div class="h-18" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, onUnmounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useI18n } from 'vue-i18n'
import LanguageSelector from './LanguageSelector.vue'
import ThemeToggle from './ThemeToggle.vue'

export default defineComponent({
  name: 'HeaderView',
  components: {
    LanguageSelector,
    ThemeToggle
  },
  setup() {
    const isActiveMenu: Ref<string> = ref('')
    const isScrolled: Ref<boolean> = ref(false)
    const isMobileNavOpen: Ref<boolean> = ref(false)
    const { locale } = useI18n()

    // Scroll effect para glassmorphism
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 20
    }

    onMounted(() => {
      initFlowbite()
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Check initial scroll position
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
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
      isScrolled,
      isMobileNavOpen,
      setActiveMenu: (name: string) => {
        isActiveMenu.value = name
      },
      changeLanguage: (lang: string) => {
        locale.value = lang
      },
      toggleMobileNav: () => {
        isMobileNavOpen.value = !isMobileNavOpen.value
      }
    }
  }
})
</script>

<style scoped>
/* Estilos elegantes y minimalistas */
.h-18 {
  height: 4.5rem;
}

/* Mejorar backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Shadow effects */
.shadow-soft {
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
}

/* Hover effects para mobile nav */
.max-h-0 {
  max-height: 0;
}

.max-h-80 {
  max-height: 20rem;
}
</style>
