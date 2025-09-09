<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <our-blog :articles-number="3" />
    </div>
  </div>
</template>
<script lang="ts">
import OurBlog from '@/components/base/OurBlog.vue'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'BlogView',
  components: {
    OurBlog
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
</script>
<style lang="">
</style>
