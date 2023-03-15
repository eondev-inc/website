<template>
  <div class="container mx-auto px-4 md:w-[520px] h-96 mt-6">
    <Form @submit="onSubmit">
      <template v-for="(field, index) in fields" :key="index">
        <div class="mb-4">
          <label :for="field.name" class="block text-gray-700 font-bold mb-2">
            {{ $t(`callToAction.${field.name}`) }}
          </label>
          <Field
            :id="field.name"
            :name="field.name"
            :rules="field.rules"
            :type="field.type"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessage :name="field.name" class="text-red-500" />
        </div>
      </template>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          :class="loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="loading"
        >
          {{ $t('callToAction.send') }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Field, Form, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'
// eslint-disable-next-line import/no-duplicates
import { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'
// eslint-disable-next-line import/no-duplicates
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'CallToActionView',
  components: {
    Field,
    Form,
    ErrorMessage
  },
  setup() {
    const { handleSubmit, errors } = useForm()
    const fields = [
      {
        name: 'name',
        rules: yup.string().min(3).required(),
        type: 'text'
      },
      {
        name: 'email',
        rules: yup.string().email().required(),
        type: 'email'
      },
      {
        name: 'message',
        rules: yup.string().min(10).required(),
        type: 'textarea'
      }
    ]
    const loading = ref(false)

    const dispatchSwal = (scope: string) => {
      const icon: SweetAlertIcon = scope === 'success' ? 'success' : 'error'
      const swalOptions: SweetAlertOptions = {
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        icon,
        title: scope === 'success' ? 'Thanks for your message!' : 'Something went wrong'
      }
      Swal.fire(swalOptions)
    }

    const onSubmit = handleSubmit(async (values: any) => {
      try {
        loading.value = true

        const response = await fetch('https://run.mocky.io/v3/2eb0428f-0525-4779-98a0-23993cb7ebfe', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })

        if (response.status === 200) dispatchSwal('success')
      } catch (error) {
        dispatchSwal('error')
      } finally {
        loading.value = false
      }
    })
    return { onSubmit, errors, fields, loading }
  }
})
</script>
