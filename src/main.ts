import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFacebook,
  faGithub,
  faInstagram,
  faInstagramSquare,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'
import { faDatabase, faCode, faFileCode } from '@fortawesome/free-solid-svg-icons'

library.add(faGithub)
library.add(faFacebook)
library.add(faTwitter)
library.add(faInstagram)
library.add(faDatabase)
library.add(faCode)
library.add(faFileCode)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app')
