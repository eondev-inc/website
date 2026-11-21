<template>
  <section class="container-custom py-16 lg:py-20">
    <!-- Encabezado: título, fuente y búsqueda -->
    <div
      class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div class="max-w-2xl">
        <component
          :is="headingTag"
          class="font-display text-3xl lg:text-4xl font-bold text-neutral-900"
        >
          {{ $t("news.title") }}
        </component>
        <p class="mt-3 text-lg text-neutral-600">
          {{ $t("blog.subtitle") }}
        </p>
        <p class="mt-2 text-sm text-neutral-600">
          {{ $t("blog.sourceNote") }}
        </p>
      </div>

      <div class="relative w-full lg:max-w-sm">
        <label for="blog-search" class="sr-only">
          {{ $t("blog.searchPlaceholder") }}
        </label>
        <font-awesome-icon
          icon="search"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
        />
        <input
          id="blog-search"
          v-model="searchQuery"
          type="search"
          :placeholder="$t('blog.searchPlaceholder')"
          class="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg focus:border-primary-600 focus:ring-4 focus:ring-primary-100 placeholder-neutral-500"
        />
      </div>
    </div>

    <!-- Filtro por categoría -->
    <div v-if="categories.length" class="mb-10 flex flex-wrap gap-2">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        :aria-pressed="selectedCategory === category.id"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200',
          selectedCategory === category.id
            ? 'bg-primary-700 border-primary-700 text-white'
            : 'bg-white border-neutral-300 text-neutral-700 hover:border-primary-600 hover:text-primary-700',
        ]"
        :aria-label="`${$t('blog.filterBy')} ${category.name}, ${category.count} ${$t('blog.articles')}`"
        @click="
          selectedCategory =
            selectedCategory === category.id ? null : category.id
        "
      >
        {{ category.name }}
        <span
          :class="
            selectedCategory === category.id ? 'text-white' : 'text-neutral-600'
          "
        >
          · {{ category.count }}
        </span>
      </button>
      <button
        v-if="selectedCategory !== null"
        type="button"
        class="px-3 py-1.5 rounded-full text-sm font-medium text-neutral-700 underline underline-offset-4 hover:text-primary-700"
        @click="selectedCategory = null"
      >
        {{ $t("blog.clear") }}
      </button>
    </div>

    <!-- Cargando -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center py-20"
      role="status"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"
        />
        <p class="text-neutral-600">
          {{
            isRetrying
              ? $t("blog.retryingArticles")
              : $t("blog.loadingArticles")
          }}
        </p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error && !isLoading" class="text-center py-20" role="alert">
      <font-awesome-icon
        icon="exclamation-triangle"
        class="text-4xl text-amber-600 mb-4"
      />
      <h3 class="text-xl font-semibold text-neutral-800 mb-2">
        {{ $t("blog.errorLoadingArticles") }}
      </h3>
      <p class="text-neutral-600 mb-6">{{ error.message }}</p>
      <button
        :disabled="isRetrying"
        class="px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 inline-flex items-center gap-2"
        @click="retryLoad"
      >
        <font-awesome-icon v-if="isRetrying" icon="spinner" spin />
        <font-awesome-icon v-else icon="redo" />
        <span>{{ isRetrying ? $t("blog.retrying") : $t("blog.retry") }}</span>
      </button>
      <p class="mt-4 text-sm text-neutral-600">{{ $t("blog.problems") }}</p>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="filteredPosts.length === 0" class="text-center py-20">
      <h3 class="text-xl font-semibold text-neutral-800 mb-2">
        {{ $t("blog.noArticlesFound") }}
      </h3>
      <p class="text-neutral-600">{{ $t("blog.noResultsHelp") }}</p>
    </div>

    <!-- Artículos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="blog in paginatedPosts"
        :key="blog.id"
        class="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white"
      >
        <img
          v-if="blog.jetpack_featured_media_url"
          :src="blog.jetpack_featured_media_url"
          :alt="blog.title.rendered"
          class="h-48 w-full object-cover"
          loading="lazy"
        />
        <div v-else class="h-48 w-full bg-primary-50" aria-hidden="true" />

        <div class="flex flex-1 flex-col gap-3 p-6">
          <p class="text-sm text-neutral-600">
            <time :datetime="blog.date">{{ formatDate(blog.date) }}</time>
            ·
            {{
              estimateReadingTime(
                blog.content?.rendered || blog.excerpt.rendered,
              )
            }}
            min
            <template v-if="blog.categories && blog.categories.length">
              · {{ getCategoryName(blog.categories[0]) }}
            </template>
          </p>

          <component
            :is="cardHeadingTag"
            class="text-xl font-bold text-neutral-900 line-clamp-2"
          >
            {{ cleanHtml(blog.title.rendered) }}
          </component>

          <p
            class="text-sm leading-relaxed text-neutral-700 line-clamp-3"
            v-html="sanitizeHtml(truncate(blog.excerpt.rendered, 150))"
          />

          <a
            :href="safeExternalUrl(blog.link)"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-700"
            :aria-label="`Leer artículo: ${cleanHtml(blog.title.rendered)}`"
          >
            {{ $t("blog.readArticle") }}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </div>

    <!-- Paginación -->
    <nav
      v-if="totalPages > 1"
      class="flex justify-center items-center mt-12 gap-2"
      aria-label="Paginación"
    >
      <button
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
        aria-label="Anterior"
        @click="currentPage = Math.max(1, currentPage - 1)"
      >
        <font-awesome-icon icon="chevron-left" aria-hidden="true" />
      </button>

      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="typeof page === 'number'"
          :aria-current="currentPage === page ? 'page' : undefined"
          :class="[
            'px-4 py-2 rounded-lg',
            currentPage === page
              ? 'bg-primary-700 text-white'
              : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50',
          ]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 text-neutral-600">{{ page }}</span>
      </template>

      <button
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
        aria-label="Siguiente"
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
      >
        <font-awesome-icon icon="chevron-right" aria-hidden="true" />
      </button>
    </nav>

    <p class="mt-16 text-neutral-700">
      {{ $t("blog.articlesInterest") }}
      <a
        href="https://steemit.com/@seventrust"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-700"
        >{{ $t("blog.viewAllArticles") }} ↗</a
      >
    </p>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import useBlogEnhanced from '@/composables/use-blog-enhanced.composable'
import { safeExternalUrl } from '@/composables/utils/url-utils'

interface Props {
  articlesNumber: number;
  headingTag: string;
}

export default defineComponent({
  name: 'OurBlog',
  props: {
    articlesNumber: {
      type: Number,
      default: 6
    },
    // El título de la sección es el h1 de la página en /blog y un h2 en la home.
    headingTag: {
      type: String,
      default: 'h2'
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

    // El título de la sección es h1 en /blog; los artículos bajan un nivel
    const cardHeadingTag = computed(() =>
      props.headingTag === 'h1' ? 'h2' : 'h3'
    )

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
      categories: blogEnhanced.categories,

      // Paginación
      currentPage: blogEnhanced.currentPage,
      totalPages: blogEnhanced.totalPages,
      visiblePages,
      cardHeadingTag,

      // Computed
      filteredPosts: blogEnhanced.filteredPosts,
      paginatedPosts: blogEnhanced.paginatedPosts,

      // Methods
      getCategoryName: blogEnhanced.getCategoryName,
      estimateReadingTime: blogEnhanced.estimateReadingTime,

      // Helpers
      truncate: blogEnhanced.truncate,
      cleanHtml: blogEnhanced.cleanHtml,
      sanitizeHtml: blogEnhanced.sanitizeHtml,
      safeExternalUrl,
      formatDate: blogEnhanced.formatDate,

      // Estados avanzados para manejo de errores
      retryLoad: blogEnhanced.retryLoad,
      lastUpdate: blogEnhanced.lastUpdate
    }
  }
})
</script>

<style scoped>
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
</style>
