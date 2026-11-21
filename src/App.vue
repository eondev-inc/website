<template>
  <div>
    <header-view />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <footer-view />
  </div>
</template>
<script lang="ts">
import { defineComponent, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HeaderView from '@/components/layouts/HeaderView.vue'
import FooterView from '@/components/layouts/FooterView.vue'

export default defineComponent({
  name: 'App',
  components: {
    HeaderView,
    FooterView
  },
  setup() {
    const { locale, t, te } = useI18n()
    const route = useRoute()

    // El idioma y el título siguen la preferencia del visitante y la ruta.
    watchEffect(() => {
      document.documentElement.lang = locale.value
      const key = `pageTitle.${String(route.name ?? '')}`
      if (te(key)) document.title = t(key)
    })
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
