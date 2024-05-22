<template>
  <div class="flex justify-center relative mr-0">
    <button
      id="states-button"
      data-dropdown-toggle="dropdown-states"
      class="font-medium tracking-wide py-2 px-5 sm:px-8 border border-lipsing-500 text-slateMedium-500 bg-white-500 outline-none rounded-l-full rounded-r-full capitalize hover:bg-slateMedium-500 hover:text-white md:transition-all hover:shadow-2xl"
      type="button"
    >
      Language
    </button>
    <div
      id="dropdown-states"
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="states-button"
      >
        <li>
          <button
            type="button"
            class="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
            @click="changeLanguage('en')"
          >
            <div class="inline-flex items-center">
              <img
                src="../../assets/img/united-kingdom-flag-icon.svg"
                alt="United Kingdom"
                class="w-4 h-4"
              >
              &nbsp; English
            </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            class="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
            @click="changeLanguage('es')"
          >
            <div class="inline-flex items-center">
              <img
                src="../../assets/img/spain-flag-icon.png"
                alt="Spain"
                class="w-4 h-4"
              >
              &nbsp; Spanish
            </div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'LanguageSelector',
  setup() {
    const { locale } = useI18n()

    return {
      changeLanguage: (lang: string) => {
        locale.value = lang
      }
    }
  }
})
</script>
