import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { configure } from 'vee-validate'
import { extend } from 'vee-validate'
import { required } from 'vee-validate'
import './assets/style.css'
import 'animate.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faGithub,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons'
import {
  faDatabase,
  faCode,
  faFileCode,
  faBlog
} from '@fortawesome/free-solid-svg-icons'

library.add(faGithub)
library.add(faLinkedinIn)
library.add(faDatabase)
library.add(faCode)
library.add(faFileCode)
library.add(faBlog)

configure({
  generateMessage: ({ field, rule }) => {
    const messages: any = {
      required: `The ${field} field is required`
    }
    if (rule) return messages
  }
})

extend('required', required)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('Field', Field)
  .component('Form', Form)
  .component('ErrorMessage', ErrorMessage)
  .use(router)
  .mount('#app')
