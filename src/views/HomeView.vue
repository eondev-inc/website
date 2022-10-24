<template>
  <div>
    <header-view />
    <footer-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FooterView from '@/components/layouts/FooterView.vue'
import HeaderView from '@/components/layouts/HeaderView.vue'

export default defineComponent({
  name: 'HomeView',
  components: { FooterView, HeaderView }
})
</script>
