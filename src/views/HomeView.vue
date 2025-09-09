<template>
  <div>
    <about-me />
    <experience />
    <our-blog :articles-number="3"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AboutMe from '../components/base/AboutMe.vue'
import Experience from '../components/base/Experience.vue'
import OurBlog from '../components/base/OurBlog.vue'

export default defineComponent({
  name: 'HomeView',
  components: { AboutMe, Experience, OurBlog }
})
</script>
