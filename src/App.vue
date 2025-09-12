<template>
  <div
    :class="[
      'min-h-screen',
      'bg-white dark:bg-neutral-900',
      'text-neutral-900 dark:text-neutral-100',
      'transition-colors duration-300'
    ]"
  >
    <header-view />
    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
    <footer-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import HeaderView from '@/components/layouts/HeaderView.vue'
import FooterView from '@/components/layouts/FooterView.vue'
import useTheme from '@/composables/use-theme.composable'

export default defineComponent({
  name: 'App',
  components: {
    HeaderView,
    FooterView
  },
  setup() {
    // Inicializar el sistema de temas
    const { isDarkMode, resolvedTheme } = useTheme()

    return {
      isDarkMode,
      resolvedTheme
    }
  }
})
</script>
<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
</style>
