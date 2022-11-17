<template lang="">
  <div class="container">
    <div class="flex flex-col-reverse w-full h-100 justify-around aling-items-center top-0">
      <div class="about-me flex flex-col h-full w-[342px] mt-7 justify-center mx-auto">
        <h1 class="font-semibold leading-0 tracking-normal text-2xl">
          Hola! Soy Yerffrey Romero
        </h1>
        <h3 class="font-semibold leading-0 tracking-tight text-xl">
          Desarrollador Fullstack
        </h3>
        <p class="font-mono text-justify">
          Ingeniero en Computación, con 7+ años de experiencia,
          trabajando en empresas como Starken, Izit, Tu Clase, tu país e I-Med.
          centrado en el desarrollo de aplicaciones Web con stack tecnológico
          NodeJS
        </p>
      </div>
      <div class="w-80 h-80 relative mt-6 mx-auto">
        <img src="../../assets/img/Coding.png" alt="coding" title="coding-me" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'about-me'
})
</script>
