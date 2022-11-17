<template lang="">
  <div class="container flex flex-col md:flex-row md:w-full md:mx-4 md:mt-14 md:justify-around">
    <div class="flex flex-col rounded-sm bg-white shadow-md mx-2 mt-5 w-[420px]">
      <div class="py-4 px-6">
        <div class="mx-2 bg-lipsing-400 rounded-full items-center justify-center flex p-2 shadow-md w-16 h-16 m-4">
          <font-awesome-icon icon="fa-solid fa-code" class="icon text-black h-8" />
        </div>
        <h3 class="font-mono leading-0 tracking-normal font-semibold text-lg">NodeJS</h3>
        <p class="text-justify leading-0 tracking-normal font-mono">Experiencia en desarrollo de
          aplicaciones en NodeJS haciendo uso de
          frameworks o librerias tales como <span class="font-semibold">express</span>,
          <span class="font-semibold">NextJS</span>, <span class="font-semibold">Fastify</span>, entre otros.
        </p>
      </div>
    </div>
    <div class="flex flex-col rounded-sm bg-white shadow-md mx-2 mt-5 w-[420px]">
      <div class="py-4 px-6">
        <div class="mx-2 bg-lavender-400 rounded-full items-center justify-center flex p-2 shadow-md w-16 h-16 m-4">
          <font-awesome-icon icon="fa-solid fa-database" class="icon text-black h-8" />
        </div>
        <h3 class="font-mono leading-0 tracking-normal font-semibold text-lg">Base de datos</h3>
        <p class="text-justify leading-0 tracking-normal font-mono">Experiencia en uso de
          base de datos relacionales y no relacionales tales como <span class="font-semibold">MySQL</span>,
          <span class="font-semibold">MongoDB</span>, <span class="font-semibold">DocumentDB</span>, entre otros.
        </p>
      </div>
    </div>

    <div class="flex flex-col rounded-sm bg-white shadow-md mx-2 mt-5 w-[420px]">
      <div class="py-4 px-6">
        <div class="mx-2 bg-green-200 rounded-full items-center justify-center flex p-2 shadow-md w-16 h-16 m-4">
          <font-awesome-icon icon="fa-solid fa-file-code" class="icon text-black h-8" />
        </div>
        <h3 class="font-mono leading-0 tracking-normal font-semibold text-lg">Desarrollo Web</h3>
        <p class="text-justify leading-0 tracking-normal font-mono">Experiencia en uso de
          librerias y/o frameworks para el desarrollo de aplicaciones web, uso de <span class="font-semibold">Angular</span>,
          <span class="font-semibold">Vuejs (v3)</span> y ademas de utilizacion de framework fullstack
          <span class="font-semibold">NuxtJS (v3)</span>, entre otros.
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'experience-pro'
})
</script>
