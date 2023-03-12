import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Form, Field, ErrorMessage, configure } from 'vee-validate'
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
import { createI18n } from 'vue-i18n'
import messages from './locales/messages'

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

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'es',
  messages
})

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('Field', Field)
  .component('Form', Form)
  .component('ErrorMessage', ErrorMessage)
  .use(router)
  .use(i18n)
  .mount('#app')
