import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

/**
 * Definición de todas las rutas de la aplicación
 * Cada ruta incluye lazy loading, meta información para SEO y chunk names optimizados
 */
const routes: Array<RouteRecordRaw> = [
  // Página principal del portfolio
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home-page" */ '../views/HomeView.vue'),
    meta: {
      title: 'Inicio - Mi Portfolio',
      description: 'Bienvenido a mi portfolio profesional. Desarrollador especializado en Vue.js y tecnologías web modernas.',
      requiresAuth: false
    }
  },
  // Información personal y profesional
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about-page" */ '../views/AboutView.vue'),
    meta: {
      title: 'Acerca de Mí - Mi Portfolio',
      description: 'Conoce más sobre mi experiencia profesional, habilidades técnicas y trayectoria como desarrollador.',
      requiresAuth: false
    }
  },
  // Blog con artículos técnicos
  {
    path: '/blog',
    name: 'blog',
    component: () => import(/* webpackChunkName: "blog-page" */ '../views/BlogView.vue'),
    meta: {
      title: 'Blog - Artículos y Tutoriales',
      description: 'Artículos técnicos, tutoriales y reflexiones sobre desarrollo web, Vue.js y las últimas tecnologías.',
      requiresAuth: false
    }
  },
  // Formulario de contacto
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact-page" */ '../views/ContactMeView.vue'),
    meta: {
      title: 'Contacto - Trabajemos Juntos',
      description: 'Ponte en contacto conmigo para discutir proyectos, colaboraciones o oportunidades profesionales.',
      requiresAuth: false
    }
  },
  // Ruta catch-all para páginas no encontradas (404)
  // IMPORTANTE: Esta debe ser siempre la última ruta
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "error-pages" */ '../components/errors/UnderConstructionView.vue'),
    meta: {
      title: 'Página No Encontrada - 404',
      description: 'La página que estás buscando no existe o ha sido movida.',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/website/' : '/'),
  routes,
  // Comportamiento de scroll personalizado
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada (navegación con back/forward), usarla
    if (savedPosition) {
      return savedPosition
    }
    // Si hay un hash en la URL, hacer scroll al elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Por defecto, hacer scroll al top con animación suave
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Actualizar el título de la página basado en los meta datos
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string
  } else {
    document.title = 'Mi Portfolio' // Título por defecto
  }

  // Actualizar meta description si existe
  if (to.meta && to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', to.meta.description as string)
  }
  next()
})

export default router
