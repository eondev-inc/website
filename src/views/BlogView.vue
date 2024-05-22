<template lang="">
  <div>
    <our-blog :articles-number="3" />
  </div>
</template>
<script lang="ts">
import OurBlog from '@/components/base/OurBlog.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlogView',
  components: {
    OurBlog
  }
})
</script>
<style lang="">
</style>
