<template lang="">
  <div>
    <call-to-action-view />
  </div>
</template>
<script lang="ts">
import CallToActionView from '@/components/base/CallToAction.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlogView',
  components: {
    CallToActionView
  }
})
</script>
<style lang="">
</style>
