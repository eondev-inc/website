import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
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

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app')
