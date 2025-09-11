<template>
  <!-- Sección de blog avanzada -->
  <section class="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">

    <!-- Header de la sección -->
    <div class="text-center mb-16 animate-fade-in">
      <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
        {{ $t('news.title') }}
      </h2>
      <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
        {{ $t('blog.subtitle') }}
      </p>
      <div class="w-24 h-1 bg-gradient-to-r from-secondary-500 to-primary-400 mx-auto mt-6 rounded-full" />
    </div>

    <!-- Controles avanzados -->
    <div class="mb-12 space-y-6 animate-slide-up">

      <!-- Barra de búsqueda -->
      <div class="max-w-md mx-auto">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <font-awesome-icon icon="search" class="text-neutral-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('blog.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 placeholder-neutral-400"
            @input="debouncedSearch"
          >
          <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              @click="clearSearch"
              class="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>
      </div>
      <!-- Controles de vista -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-neutral-600">Mostrar:</span>
          <select
            v-model="itemsPerPage"
            class="px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-sm"
          >
            <option value="3">{{ $t('blog.articlesCount.3') }}</option>
            <option value="6">{{ $t('blog.articlesCount.6') }}</option>
            <option value="9">{{ $t('blog.articlesCount.9') }}</option>
            <option value="12">{{ $t('blog.articlesCount.12') }}</option>
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-sm text-neutral-600">Vista:</span>
          <div class="flex bg-neutral-100 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded transition-all duration-200',
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
              ]"
            >
              <font-awesome-icon icon="th-large" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded transition-all duration-200',
                viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
              ]"
            >
              <font-awesome-icon icon="list" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p class="text-neutral-600">
          {{ isRetrying ? $t('blog.retryingArticles') : $t('blog.loadingArticles') }}
        </p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error && !isLoading" class="text-center py-20">
      <div class="mb-6">
        <font-awesome-icon icon="exclamation-triangle" class="text-4xl text-amber-500 mb-4" />
        <h3 class="text-xl font-semibold text-neutral-700 mb-2">
          {{ $t('blog.errorLoadingArticles') }}
        </h3>
        <p class="text-neutral-500 mb-1">
          {{ error.message }}
        </p>
        <p class="text-sm text-neutral-400">
          Tipo: {{ error.type }} | {{ formatDate(new Date(error.timestamp).toISOString()) }}
        </p>
      </div>

      <div class="space-y-3">
        <button
          @click="retryLoad"
          :disabled="isRetrying"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <font-awesome-icon v-if="isRetrying" icon="spinner" spin />
          <font-awesome-icon v-else icon="redo" />
          <span>{{ isRetrying ? 'Reintentando...' : 'Reintentar' }}</span>
        </button>

        <p class="text-sm text-neutral-500">
          {{$t('blog.problems')}}
        </p>
      </div>
    </div>

    <!-- No results -->
    <div v-else-if="filteredPosts.length === 0 && !isLoading && !error" class="text-center py-20">
      <div class="mb-4">
        <font-awesome-icon icon="search" class="text-4xl text-neutral-400" />
      </div>
      <h3 class="text-xl font-semibold text-neutral-700 mb-2">{{ $t('blog.noArticlesFound') }}</h3>
      <p class="text-neutral-500">
        Intenta con otros términos de búsqueda o selecciona una categoría diferente
      </p>
    </div>

    <!-- Blog cards grid/list -->
    <div
      v-else
      :class="[
        'transition-all duration-300',
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'space-y-6'
      ]"
    >
      <article
        v-for="(blog, index) in paginatedPosts"
        :key="blog.id"
        :ref="`blogCard-${blog.id}`"
        :class="[
          'group bg-white rounded-3xl shadow-soft transition-all duration-300 overflow-hidden animate-slide-up',
          viewMode === 'list' ? 'flex flex-col md:flex-row max-w-4xl mx-auto' : ''
        ]"
        :style="`animation-delay: ${index * 0.1}s`"
      >

        <!-- Image container -->
        <div :class="['relative overflow-hidden', viewMode === 'list' ? 'md:w-80 h-48 md:h-auto' : '']">
          <img
            v-if="blog.jetpack_featured_media_url"
            :src="blog.jetpack_featured_media_url"
            :alt="blog.title.rendered"
            :class="[
              'object-cover transition-transform duration-500 group-hover:scale-105',
              viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
            ]"
            loading="lazy"
          >

          <!-- Placeholder si no hay imagen -->
          <div
            v-else
            :class="[
              'bg-gradient-to-br from-secondary-100 to-primary-100 flex items-center justify-center',
              viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
            ]"
          >
            <font-awesome-icon icon="newspaper" class="text-4xl text-neutral-400" />
          </div>

          <!-- Overlay gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <!-- Date badge -->
          <div class="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-neutral-700 shadow-soft">
            {{ formatDate(blog.date) }}
          </div>
        </div>

        <!-- Content -->
        <div :class="['p-6 space-y-4', viewMode === 'list' ? 'flex-1' : '']">
          <!-- Category tags -->
          <div v-if="blog.categories && blog.categories.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="categoryId in blog.categories.slice(0, 3)"
              :key="categoryId"
              class="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full font-medium transition-colors duration-200"
              :style="`
                background-color: ${categories.find(c => c.id === categoryId)?.color || '#3b82f6'}15;
                color: ${categories.find(c => c.id === categoryId)?.color || '#3b82f6'};
                border: 1px solid ${categories.find(c => c.id === categoryId)?.color || '#3b82f6'}30;
              `"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :style="`background-color: ${categories.find(c => c.id === categoryId)?.color || '#3b82f6'}`"
              />
              <span>{{ getCategoryName(categoryId) }}</span>
            </span>

            <span
              v-if="blog.categories.length > 3"
              class="px-2 py-1 bg-neutral-100 text-neutral-500 text-xs rounded-full font-medium"
            >
              +{{ blog.categories.length - 3 }}
            </span>
          </div>

          <!-- Title -->
          <h3
            :class="[
              'font-bold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300',
              viewMode === 'list' ? 'text-2xl line-clamp-2' : 'text-xl line-clamp-2'
            ]"
            v-html="blog.title.rendered"
          />

          <!-- Excerpt -->
          <p
            :class="[
              'text-neutral-600 leading-relaxed',
              viewMode === 'list' ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
            ]"
            v-html="cleanHtml(truncate(blog.excerpt.rendered, viewMode === 'list' ? 250 : 150))"
          />

          <!-- Meta information -->
          <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
            <div class="flex items-center space-x-4 text-xs text-neutral-500">
              <span class="flex items-center space-x-1">
                <font-awesome-icon icon="clock" />
                <span>{{ estimateReadingTime(blog.content?.rendered || blog.excerpt.rendered) }} min</span>
              </span>

              <span class="flex items-center space-x-1">
                <font-awesome-icon icon="calendar-alt" />
                <time :datetime="blog.date">{{ formatDate(blog.date) }}</time>
              </span>

              <span
                v-if="blog._cached"
                class="flex items-center space-x-1 text-green-600"
                title="Cargado desde caché"
              >
                <font-awesome-icon icon="bolt" class="text-xs" />
                <span>Rápido</span>
              </span>
            </div>

            <div class="flex items-center space-x-2">
              <!-- Favorite button (moved from image overlay) -->
              <button
                @click="toggleFavorite(blog.id)"
                :class="[
                  'w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center text-xs favorite-heart',
                  favorites.includes(blog.id)
                    ? 'bg-red-500 text-white shadow-soft active'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-red-50 hover:text-red-500'
                ]"
                :aria-label="favorites.includes(blog.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
              >
                <font-awesome-icon icon="heart" />
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-2 flex items-center justify-between">
            <a
              :href="blog.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 group/link"
              :aria-label="`Leer artículo: ${cleanHtml(blog.title.rendered)}`"
            >
              <span>Leer artículo</span>
              <svg
                class="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <button
              @click="shareArticle(blog)"
              class="inline-flex items-center space-x-1 text-neutral-500 hover:text-accent-600 text-sm transition-colors duration-200"
              :aria-label="`Compartir artículo: ${cleanHtml(blog.title.rendered)}`"
            >
              <font-awesome-icon icon="share-alt" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        <!-- Hover border effect -->
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary-400 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-105" />
      </article>
    </div>

    <!-- Filtros de categorías -->
    <div class="flex flex-wrap justify-center gap-3 mt-12">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectedCategory = selectedCategory === category.id ? null : category.id"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 category-tag',
          selectedCategory === category.id
            ? 'text-white shadow-soft'
            : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-primary-50 hover:border-primary-300'
        ]"
        :style="selectedCategory === category.id ? `background-color: ${category.color}` : ''"
        :aria-label="`Filtrar por ${category.name}, ${category.count} artículos`"
      >
        <span class="flex items-center space-x-2">
          <span
            :class="[
              'w-2 h-2 rounded-full',
              selectedCategory !== category.id ? 'opacity-60' : ''
            ]"
            :style="`background-color: ${category.color}`"
          />
          <span>{{ category.name }}</span>
          <span
            :class="[
              'text-xs px-1.5 py-0.5 rounded-full',
              selectedCategory === category.id
                ? 'bg-white/20 text-white'
                : 'bg-neutral-100 text-neutral-500'
            ]"
          >
            {{ category.count }}
          </span>
        </span>
      </button>

      <!-- Botón para limpiar filtros -->
      <button
        v-if="selectedCategory !== null"
        @click="selectedCategory = null"
        class="px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex items-center space-x-1"
        aria-label="Limpiar filtros de categoría"
      >
        <font-awesome-icon icon="times" class="text-xs" />
        <span>Limpiar</span>
      </button>
    </div>
    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 space-x-2">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
      >
        <font-awesome-icon icon="chevron-left" aria-hidden="true" />
      </button>

      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="typeof page === 'number'"
          @click="currentPage = page"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          ]"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 text-neutral-400">{{ page }}</span>
      </template>

      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
      >
        <font-awesome-icon icon="chevron-right" aria-hidden="true" />
      </button>
    </div>

    <!-- Call to action -->
    <div class="text-center mt-16 animate-fade-in-up" style="animation-delay: 0.8s;">
      <p class="text-neutral-600 mb-6">
        {{ $t('blog.articlesInterest') }}
      </p>
      <a
        href="https://steemit.com/@seventrust"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary-600 to-primary-400 text-white rounded-xl hover:from-secondary-700 hover:to-primary-500 transition-all duration-300 shadow-soft hover:shadow-glow hover:-translate-y-0.5"
      >
        <span>{{ $t('blog.viewAllArticles') }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import useBlogEnhanced from '@/composables/use-blog-enhanced.composable'

interface Props {
  articlesNumber: number
}

export default defineComponent({
  name: 'OurBlog',
  props: {
    articlesNumber: {
      type: Number,
      default: 6
    }
  },
  setup(props: Props) {
    // Usar el composable avanzado
    const blogEnhanced = useBlogEnhanced()

    // Configurar el número de artículos basado en las props
    blogEnhanced.itemsPerPage.value = props.articlesNumber

    // Computed para compatibilidad con la plantilla existente
    const blogPost = computed(() => blogEnhanced.posts.value)

    const visiblePages = computed(() => {
      const total = blogEnhanced.totalPages.value
      const current = blogEnhanced.currentPage.value
      const delta = 2
      const pages: (number | string)[] = []

      if (total <= 7) {
        // Si hay 7 o menos páginas, mostrar todas
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // Lógica compleja para páginas con elipsis
        if (current <= delta + 1) {
          for (let i = 1; i <= Math.min(delta * 2 + 2, total); i++) {
            pages.push(i)
          }
          if (total > delta * 2 + 2) {
            pages.push('...')
            pages.push(total)
          }
        } else if (current >= total - delta) {
          pages.push(1)
          if (total > delta * 2 + 2) pages.push('...')
          for (let i = Math.max(total - delta * 2 - 1, 2); i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - delta; i <= current + delta; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }

      return pages
    })

    // Method compatible con el template existente
    const debouncedSearch = () => {
      // Ya manejado internamente por useBlogEnhanced con debounce automático
    }

    // Lifecycle - cargar posts iniciales
    onMounted(async () => {
      await blogEnhanced.loadPosts()
    })

    return {
      // Estados del composable avanzado
      blogPost, // Computed para compatibilidad
      posts: blogEnhanced.posts,
      isLoading: blogEnhanced.isLoading,
      error: blogEnhanced.error,
      isRetrying: blogEnhanced.isRetrying,

      // Filtros y búsqueda
      searchQuery: blogEnhanced.searchQuery,
      selectedCategory: blogEnhanced.selectedCategory,
      viewMode: blogEnhanced.viewMode,
      categories: blogEnhanced.categories,

      // Paginación
      currentPage: blogEnhanced.currentPage,
      itemsPerPage: blogEnhanced.itemsPerPage,
      totalPages: blogEnhanced.totalPages,
      visiblePages,

      // Computed
      filteredPosts: blogEnhanced.filteredPosts,
      paginatedPosts: blogEnhanced.paginatedPosts,

      // Funcionalidades
      favorites: blogEnhanced.favorites,

      // Methods
      debouncedSearch,
      clearSearch: blogEnhanced.clearSearch,
      toggleFavorite: blogEnhanced.toggleFavorite,
      shareArticle: blogEnhanced.shareArticle,
      getCategoryName: blogEnhanced.getCategoryName,
      estimateReadingTime: blogEnhanced.estimateReadingTime,

      // Helpers
      truncate: blogEnhanced.truncate,
      cleanHtml: blogEnhanced.cleanHtml,
      formatDate: blogEnhanced.formatDate,

      // Estados avanzados para manejo de errores
      retryLoad: blogEnhanced.retryLoad,
      lastUpdate: blogEnhanced.lastUpdate
    }
  }
})
</script>

<style scoped>
/* Animaciones para las blog cards */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
  animation-fill-mode: both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
  animation-fill-mode: both;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover effects para los botones */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Efectos de glassmorphism para controles */
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Transiciones suaves para cambios de vista */
.view-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos para paginación */
.pagination-button {
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animación para el corazón de favoritos */
.favorite-heart {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.favorite-heart:hover {
  transform: scale(1.2);
}

.favorite-heart.active {
  animation: pulse-glow 2s infinite;
}

/* Efectos hover para categorías */
.category-tag {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.category-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.category-tag:hover::before {
  left: 100%;
}

/* Loader personalizado */
.custom-loader {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .animate-slide-up {
    animation-delay: 0s !important;
  }

  .line-clamp-4 {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}

/* Focus states for accessibility */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth scrolling for pagination */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
