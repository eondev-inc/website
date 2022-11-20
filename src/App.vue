<template>
  <div>
    <header-view />
    <router-view class="flex-grow" />
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
<style lang="scss">
</style>
