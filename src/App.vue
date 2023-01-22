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
import { defineComponent } from 'vue'
import HeaderView from '@/components/layouts/HeaderView.vue'
import FooterView from '@/components/layouts/FooterView.vue'

export default defineComponent({
  name: 'App',
  components: {
    HeaderView,
    FooterView
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
