<template lang="">
    <div>
      <our-blog :solo-view="true"/>
    </div>
</template>
<script lang="ts">
import OurBlog from '@/components/base/OurBlog.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'blog-view',
  components: {
    OurBlog
  }
})
</script>
<style lang="">
</style>
