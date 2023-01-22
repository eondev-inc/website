<template lang="">
  <div class="container flex flex-col items-center p-2 mt-10 w-full md:justify-between mx-auto">
    <div class="mx-auto mb-4">
      <h1 class="text-2xl font-bold font-mono leading-0 tracking-normal">
        Blog y noticias destacadas
      </h1>
    </div>
    <div class="flex flex-col px-2 md:flex-row">
      <div
        class="flex flex-col shadow-sm shadow-slate-600 h-[580px] w-full rounded-sm
        transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-80 duration-300
        my-3 md:mx-8 md:h-[580px]"
        v-for="(blog, index) in blogEntries" :key="index"
      >
      <img :src="getPic(blog.images.title)" alt="blog-title"/>
      <div class="h-10 w-[160px] rounded-full bg-lavender-500 -mt-5 ml-4 p-2">Fecha estimada</div>
      <div class="flex flex-col p-4 space-y-2">
        <span id="title" class="font-mono text-left text-slateMedium-300
        text-lg leading-0 tracking-normal">{{blog.title}}</span>

        <span id="title" class="font-sans text-left text-black
        text-lg leading-0 tracking-normal">{{blog.resume}}</span>

        <span id="goto" class="text-slateMedium-400 underline"><router-link :to="'blogs/'+blog.slug">Leer más</router-link></span>
      </div>
    </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useBlogs from '@/composables/use-blogs.composable'

export default defineComponent({
  name: 'our-blog',
  setup() {
    const { blogEntries } = useBlogs()

    return {
      blogEntries,
      getPic: (pic: string) => require('../../assets/img/' + pic)
    }
  }
})
</script>
<style lang="">
</style>
