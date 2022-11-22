<template lang="">
  <div>
    <under-construction-view />
  </div>
</template>
<script lang="ts">
import UnderConstructionView from '@/components/errors/UnderConstructionView.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'blog-view',
  components: {
    UnderConstructionView
  }
})
</script>
<style lang="">
</style>
