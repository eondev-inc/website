<template>
  <div>
    <div class="bg-white-300 pt-44 pb-24">
      <div class="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4 border-t-[1px] border-slate-300">
        <div class="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start">
          <img
            src="../../assets/img/logo_v3.png"
            width="100"
            height="80"
          >
          <p class="mb-4">
            <strong class="font-medium">Eondev Inc</strong>
            {{ $t('footer.mainMessage') }}
          </p>
          <div class="flex w-full mt-2 mb-8 -mx-2">
            <div class="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md cursor-pointer">
              <a
                href="https://steemit.com/@seventrust"
                target="_blank"
                rel="noopener noreferrer"
              >
                <font-awesome-icon
                  icon="fa-solid fa-blog"
                  class="icon text-slateMedium-100"
                />
              </a>
            </div>
            <div class="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md cursor-pointer">
              <a
                href="https://www.linkedin.com/in/yromeroc/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <font-awesome-icon
                  icon="fa-brands fa-linkedin-in"
                  class="icon text-slateMedium-100"
                />
              </a>
            </div>
            <div class="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md cursor-pointer">
              <a
                href="https://github.com/eondev-inc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <font-awesome-icon
                  icon="fa-brands fa-github"
                  class="icon text-slateMedium-100"
                />
              </a>
            </div>
          </div>
          <p class="text-gray-400">
            ©
            {{ new Date().getFullYear() }}
            - Eondev
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterView'
})
</script>
<style lang="">
</style>
