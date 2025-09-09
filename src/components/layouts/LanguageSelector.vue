<template>
  <div class="flex justify-center relative mr-0" ref="dropdownContainer">
    <button
      @click="toggleDropdown"
      class="font-medium tracking-wide py-2 px-5 sm:px-8 border border-neutral-300 text-neutral-700 bg-white outline-none rounded-full capitalize hover:bg-neutral-700 hover:text-white transition-all duration-300 hover:shadow-lg hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300"
      type="button"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="true"
    >
      <div class="flex items-center space-x-2">
        <span>{{ $t('header.selectLanguage') }}</span>
        <svg
          :class="['w-4 h-4 transition-transform duration-200', isDropdownOpen ? 'rotate-180' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
    <div
      v-show="isDropdownOpen"
      class="absolute top-full mt-2 right-0 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 border border-neutral-200"
    >
      <ul
        class="py-2 text-sm text-neutral-700"
        role="menu"
        aria-orientation="vertical"
      >
        <li role="none">
          <button
            type="button"
            class="inline-flex w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-200 focus:outline-none focus:bg-neutral-50"
            role="menuitem"
            @click="changeLanguage('en')"
          >
            <div class="inline-flex items-center space-x-2">
              <img
                src="../../assets/img/united-kingdom-flag-icon.svg"
                alt="English"
                class="w-4 h-4"
              >
              <span>English</span>
            </div>
          </button>
        </li>
        <li role="none">
          <button
            type="button"
            class="inline-flex w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-200 focus:outline-none focus:bg-neutral-50"
            role="menuitem"
            @click="changeLanguage('es')"
          >
            <div class="inline-flex items-center space-x-2">
              <img
                src="../../assets/img/spain-flag-icon.png"
                alt="Español"
                class="w-4 h-4"
              >
              <span>Español</span>
            </div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'LanguageSelector',
  emits: ['changeLanguage'],
  setup(_, { emit }) {
    const { locale } = useI18n()
    const isDropdownOpen = ref(false)
    const dropdownContainer = ref<HTMLElement>()

    // Cargar idioma desde localStorage al montar
    onMounted(() => {
      const savedLocale = localStorage.getItem('preferred-language')
      if (savedLocale && ['en', 'es'].includes(savedLocale)) {
        locale.value = savedLocale
      }
      document.addEventListener('click', handleClickOutside)
    })

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const closeDropdown = () => {
      isDropdownOpen.value = false
    }

    const changeLanguage = (lang: string) => {
      locale.value = lang
      // Guardar preferencia en localStorage
      localStorage.setItem('preferred-language', lang)
      emit('changeLanguage', lang)
      closeDropdown()
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isDropdownOpen,
      dropdownContainer,
      toggleDropdown,
      changeLanguage
    }
  }
})
</script>
