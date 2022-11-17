<template>
  <div>
    <header-view />
    <about-me />
    <experience />
    <footer-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FooterView from '@/components/layouts/FooterView.vue'
import HeaderView from '@/components/layouts/HeaderView.vue'
import AboutMe from '@/components/base/AboutMe.vue'
import Experience from '@/components/base/Experience.vue'
export default defineComponent({
  name: 'HomeView',
  components: { FooterView, HeaderView, AboutMe, Experience }
})
</script>
