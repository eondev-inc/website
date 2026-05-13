<template lang="">
  <div class="container flex flex-col w-full mt-10 space-y-4">
    <div class="mx-auto">
      <div class="font-mono font-bold text-2xl text-center">
        {{
          $t('errors.under_construction.title')
        }}
      </div>
      <div class="w-80 h-80 items-center mx-auto mt-10">
        <img
          src="@/assets/img/construction.png"
          alt="under-construction"
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UnderConstruction'
})
</script>
<style lang="">

</style>
