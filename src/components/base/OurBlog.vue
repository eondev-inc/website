<template>
  <div class="container flex flex-col items-center p-2 mt-10 w-full mx-auto">
    <div class="mx-auto mb-4">
      <h1 class="text-2xl font-bold font-mono leading-0 tracking-normal">
        {{ $t('news.title') }}
      </h1>
    </div>
    <div class="flex flex-col px-2 space-y-4 md:flex-row md:space-x-8 md:space-y-0">
      <div
        class="flex flex-col shadow-sm shadow-slate-600 h-[580px] w-full rounded-sm
        transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-80 duration-300
        my-3 md:w-[420px]"
        v-for="(blog, index) in blogPost" :key="index"
      >
        <img :src="blog.jetpack_featured_media_url" alt="blog-title" class="object-cover h-2/5 w-full rounded-t-sm" />
        <div class="h-10 w-[160px] rounded-full bg-lavender-500 -mt-5 ml-4 p-2">{{new Date(blog.date).toDateString()}}</div>
        <div class="flex flex-col p-4 space-y-2">
          <span id="title" class="font-mono text-left text-slateMedium-300
          text-xl leading-0 tracking-normal" v-html="blog.title.rendered"></span>

          <span id="title" class="font-sans text-left text-black
          text-base leading-0 tracking-normal" v-html="truncate(blog.excerpt.rendered, 200)"></span>

          <span id="goto" class="text-slateMedium-400 underline"><a :href="blog.link" target="_blank">Leer más</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import useBlogs from '@/composables/use-blogs.composable'

export default defineComponent({
  name: 'our-blog',
  props: {
    articlesNumber: {
      type: Number,
      default: 3
    }
  },
  setup(props, context) {
    const { retrievePost } = useBlogs()
    const blogPost = ref()

    onMounted(async () => {
      const res = await retrievePost(props.articlesNumber)
      blogPost.value = await res.json()
    })

    return {
      blogPost,
      truncate: (str: string, length: number) => {
        return str.length > length
          ? str.substring(0, length) + ' [...]'
          : str
      }
    }
  }
})
</script>
