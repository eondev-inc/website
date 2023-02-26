<template>
  <div class="container mx-auto">
    <Form @submit="onSubmit">
      <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="name">
          Name
          </label>
          <Field
          id="name"
          name="name"
          type="text"
          :class="{'border-red-500': errors.has('name')}"
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessage name="name" class="text-red-500" />
      </div>
      <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
          Email
          </label>
          <Field
          id="email"
          name="email"
          type="email"
          :class="{'border-red-500': errors.has('email')}"
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessage name="email" class="text-red-500" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="message">
          Message
        </label>
        <Field
          id="message"
          name="message"
          type="text"
          :class="{'border-red-500': errors.has('message')}"
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <ErrorMessage name="message" class="text-red-500" />
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
          Submit
        </button>
      </div>
    </Form>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Field, Form, ErrorMessage, useForm } from 'vee-validate'

export default defineComponent({
  name: 'CallToAction',
  components: {
    Field,
    Form,
    ErrorMessage
  },
  setup() {
    const { handleSubmit, errors } = useForm()

    const onSubmit = handleSubmit(async (values: any) => {
      try {
        const response = await fetch('http://your-endpoint.com/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        console.log(response.status)
        console.log(await response.json())
      } catch (error) {
        console.error(error)
      }
    })
    return { onSubmit, errors }
  }
})
</script>
  