<!--
  Skeleton Loader Component
  Componente de loading skeleton con diferentes variantes y animaciones fluidas
  para mejorar la percepción de performance durante la carga de contenido.

  @component SkeletonLoader
  @author Yerffrey Romero.
  @version 1.0
  @since 2025-09-05
-->

<template>
  <div :class="containerClasses">
    <!-- Blog Card Skeleton -->
    <template v-if="variant === 'blog-card'">
      <div class="bg-white dark:bg-neutral-800 rounded-3xl shadow-soft overflow-hidden animate-pulse">
        <!-- Image placeholder -->
        <div class="w-full h-48 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 bg-animate" />

        <!-- Content -->
        <div class="p-6 space-y-4">
          <!-- Category tags -->
          <div class="flex gap-2">
            <div class="w-16 h-5 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-full" />
            <div class="w-20 h-5 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-full" />
          </div>

          <!-- Title -->
          <div class="space-y-2">
            <div class="w-full h-6 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-3/4 h-6 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>

          <!-- Excerpt -->
          <div class="space-y-2">
            <div class="w-full h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-full h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-1/2 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>

          <!-- Actions -->
          <div class="pt-4 flex items-center justify-between">
            <div class="w-24 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-16 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>
        </div>
      </div>
    </template>

    <!-- Blog List Skeleton -->
    <template v-else-if="variant === 'blog-list'">
      <div class="bg-white rounded-3xl shadow-soft overflow-hidden animate-pulse flex flex-col md:flex-row max-w-4xl mx-auto">
        <!-- Image placeholder -->
        <div class="md:w-80 h-48 md:h-auto bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate" />

        <!-- Content -->
        <div class="flex-1 p-6 space-y-4">
          <!-- Category tags -->
          <div class="flex gap-2">
            <div class="w-20 h-5 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-full" />
            <div class="w-16 h-5 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-full" />
          </div>

          <!-- Title -->
          <div class="space-y-2">
            <div class="w-full h-7 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-2/3 h-7 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>

          <!-- Excerpt -->
          <div class="space-y-2">
            <div class="w-full h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-full h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-full h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-3/4 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>

          <!-- Actions -->
          <div class="pt-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-24 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
              <div class="w-20 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            </div>
            <div class="w-16 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>
        </div>
      </div>
    </template>

    <!-- Search Controls Skeleton -->
    <template v-else-if="variant === 'search-controls'">
      <div class="space-y-6 animate-pulse">
        <!-- Search bar -->
        <div class="max-w-md mx-auto">
          <div class="w-full h-12 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-xl" />
        </div>

        <!-- Category filters -->
        <div class="flex flex-wrap justify-center gap-3">
          <div v-for="n in 6" :key="n" class="w-24 h-8 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-full" />
        </div>

        <!-- View controls -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-16 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-24 h-8 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-12 h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
            <div class="w-16 h-8 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded" />
          </div>
        </div>
      </div>
    </template>

    <!-- Generic Line Skeleton -->
    <template v-else-if="variant === 'line'">
      <div class="animate-pulse">
        <div :class="['bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded', lineClasses]" />
      </div>
    </template>

    <!-- Generic Rectangle Skeleton -->
    <template v-else-if="variant === 'rectangle'">
      <div class="animate-pulse">
        <div :class="['bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-lg', rectangleClasses]" />
      </div>
    </template>

    <!-- Circle Avatar Skeleton -->
    <template v-else-if="variant === 'circle'">
      <div class="animate-pulse">
        <div :class="['bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-animate rounded-full', circleClasses]" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'

export default defineComponent({
  name: 'SkeletonLoader',
  props: {
    /**
     * Variante del skeleton loader
     */
    variant: {
      type: String as PropType<'blog-card' | 'blog-list' | 'search-controls' | 'line' | 'rectangle' | 'circle'>,
      default: 'blog-card',
      validator: (value: string) =>
        ['blog-card', 'blog-list', 'search-controls', 'line', 'rectangle', 'circle'].includes(value)
    },

    /**
     * Número de elementos skeleton a mostrar
     */
    count: {
      type: Number,
      default: 1,
      validator: (value: number) => value > 0 && value <= 20
    },

    /**
     * Clases adicionales para el contenedor
     */
    containerClass: {
      type: String,
      default: ''
    },

    /**
     * Altura personalizada para variant='line'
     */
    height: {
      type: String,
      default: '4'
    },

    /**
     * Ancho personalizado para variant='line'
     */
    width: {
      type: String,
      default: 'full'
    },

    /**
     * Tamaño para variant='circle'
     */
    size: {
      type: String,
      default: '12'
    }
  },
  setup(props) {
    const containerClasses = computed(() => {
      const baseClasses = props.containerClass

      if (props.variant === 'blog-card' && props.count > 1) {
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${baseClasses}`
      }

      if (props.variant === 'blog-list' && props.count > 1) {
        return `space-y-6 ${baseClasses}`
      }

      return baseClasses
    })

    const lineClasses = computed(() => {
      return `h-${props.height} w-${props.width}`
    })

    const rectangleClasses = computed(() => {
      return `h-${props.height} w-${props.width}`
    })

    const circleClasses = computed(() => {
      return `w-${props.size} h-${props.size}`
    })

    return {
      containerClasses,
      lineClasses,
      rectangleClasses,
      circleClasses
    }
  }
})
</script>

<style scoped>
/* Animación de gradiente para efecto shimmer */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.bg-animate {
  background-image: linear-gradient(
    90deg,
    #f1f5f9 0px,
    #e2e8f0 50px,
    #f1f5f9 100px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite linear;
}

/* Variación para elementos más largos */
.bg-animate-slow {
  background-image: linear-gradient(
    90deg,
    #f1f5f9 0px,
    #e2e8f0 50px,
    #f1f5f9 100px
  );
  background-size: 200px 100%;
  animation: shimmer 2s infinite linear;
}

/* Pulse animation para elementos interactivos */
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .bg-animate {
    animation-duration: 1.2s;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .bg-animate,
  .bg-animate-slow,
  .animate-pulse {
    animation: none;
    background: #e2e8f0;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-animate,
  .bg-animate-slow {
    background: #d1d5db;
    border: 1px solid #9ca3af;
  }
}

/* Dark mode ready */
@media (prefers-color-scheme: dark) {
  .bg-animate,
  .bg-animate-slow {
    background-image: linear-gradient(
      90deg,
      #374151 0px,
      #4b5563 50px,
      #374151 100px
    );
  }
}
</style>
