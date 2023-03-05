<template>
  <div class="container mx-auto w-[520px] h-96 mt-6">
    <Form @submit="onSubmit">
      <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="name">
            {{ $t('callToAction.name') }}
          </label>
          <Field
            id="name"
            name="name"
            :rules="nameRules"
            type="text"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessage name="name" class="text-red-500" />
      </div>
      <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            {{ $t('callToAction.email') }}
          </label>
          <Field
            id="email"
            name="email"
            :rules="emailRules"
            type="email"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessage name="email" class="text-red-500" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="message">
          {{ $t('callToAction.message') }}
        </label>
        <Field
          id="message"
          name="message"
          :rules="messageRules"
          type="textarea"
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <ErrorMessage name="message" class="text-red-500" />
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          :class="loading? 'opacity-50 cursor-not-allowed' : 'opacity-100'"
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
    const nameRules = yup.string().min(3).required()
    const emailRules = yup.string().email().required()
    const messageRules = yup.string().min(10).required()
    const loading = ref(false)

    const dispatchSwal = (scope: string) => {
      if (scope === 'success') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
      } else if (scope === 'error') {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 1500
        })
      }
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
    return { onSubmit, errors, nameRules, emailRules, messageRules, loading }
  }
})
</script>
