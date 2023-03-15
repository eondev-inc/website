<template>
  <div>
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex-shrink-0">
              <img class="h-8 w-8" src="/logo.svg" alt="Logo" />
            </router-link>
          </div>
          <div class="-mr-2 flex md:hidden">
            <button @click="isOpen = !isOpen" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-300 focus:outline-none focus:bg-gray-100 focus:text-white">
              <svg :class="isOpen ? 'hidden' : 'block'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg :class="isOpen ? 'block' : 'hidden'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div :class="isOpen ? 'block' : 'hidden'" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link :to="{ name: 'home' }" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-gray-200 focus:outline-none focus:text-white focus:bg-gray-300">Home</router-link>
          <router-link :to="{ name: 'about' }" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-gray-300 focus:outline-none focus:text-white focus:bg-gray-300">About</router-link>
          <router-link :to="{ name: 'contact' }" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-gray-300 focus:outline-none focus:text-white focus:bg-gray-300">Contact</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MobileNav',
  data() {
    return {
      isOpen: false
    }
  }
})
</script>
