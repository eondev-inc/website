<template>
  <div>
    <header-view />
    <router-view class="flex-grow" />
    <footer-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default defineComponent({
  name: 'App',
  components: {
    HeaderView: () => import(/* webpackChunkName: "header" */'@/components/layouts/HeaderView.vue'),
    FooterView: () => import(/* webpackChunkName: "footer" */'@/components/layouts/FooterView.vue'),
    FontAwesomeIcon
  }
})
</script>
<style lang="scss">
</style>
