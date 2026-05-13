/**
 * Composable para funcionalidades adicionales del blog (favoritos, compartir)
 * @module use-blog-features
 */

import { ref, onMounted } from 'vue'
import type { BlogPost, ShareData } from '@/interfaces/blog.interface'
import { cleanHtml } from '@/composables/utils/html-utils'

export default function useBlogFeatures() {
  // Estado de favoritos
  const favorites = ref<number[]>([])

  /**
   * Toggle favorito con persistencia en localStorage
   * @param postId - ID del post
   */
  const toggleFavorite = (postId: number): void => {
    const index = favorites.value.indexOf(postId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(postId)
    }

    // Persistir en localStorage
    try {
      localStorage.setItem('blog-favorites', JSON.stringify(favorites.value))
    } catch (err) {
      console.warn('No se pudieron guardar los favoritos:', err)
    }
  }

  /**
   * Verifica si un post es favorito
   * @param postId - ID del post
   * @returns true si es favorito
   */
  const isFavorite = (postId: number): boolean => {
    return favorites.value.includes(postId)
  }

  /**
   * Compartir artículo con API nativa y fallbacks
   * @param post - Post a compartir
   */
  const shareArticle = async (post: BlogPost): Promise<void> => {
    const shareData: ShareData = {
      title: cleanHtml(post.title.rendered),
      text: cleanHtml(post.excerpt.rendered).substring(0, 100) + '...',
      url: post.link
    }

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(post.link)
        console.log('URL copiada al portapapeles')
      } else {
        // Fallback final: abrir en nueva ventana
        window.open(
          `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`
        )
      }
    } catch (err) {
      console.error('Error compartiendo artículo:', err)
    }
  }

  /**
   * Obtiene los posts favoritos
   * @param allPosts - Todos los posts disponibles
   * @returns Posts marcados como favoritos
   */
  const getFavoritePosts = (allPosts: BlogPost[]): BlogPost[] => {
    return allPosts.filter(post => favorites.value.includes(post.id))
  }

  // Cargar favoritos desde localStorage al montar
  onMounted(() => {
    try {
      const savedFavorites = localStorage.getItem('blog-favorites')
      if (savedFavorites) {
        favorites.value = JSON.parse(savedFavorites)
      }
    } catch (err) {
      console.warn('No se pudieron cargar los favoritos:', err)
    }
  })

  return {
    // Estado
    favorites,

    // Métodos
    toggleFavorite,
    isFavorite,
    shareArticle,
    getFavoritePosts
  }
}
