# Estrategia de Implementación - Plan de Mejoras

## Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estrategia de Ramas Feature](#estrategia-de-ramas-feature)
3. [Detalles de Implementación por Feature](#detalles-de-implementación-por-feature)
4. [Orden de Implementación Recomendado](#orden-de-implementación-recomendado)
5. [Checklist por Feature](#checklist-por-feature)
6. [Comandos Útiles](#comandos-útiles)

---

## Resumen Ejecutivo

Este documento describe la estrategia detallada para implementar las 10 mejoras identificadas en el code review. Cada mejora se implementará en una rama feature independiente para:

- ✅ Evitar conflictos entre cambios
- ✅ Facilitar code reviews específicos
- ✅ Permitir rollback individual si es necesario
- ✅ Mantener el proyecto funcional durante el desarrollo
- ✅ Facilitar testing aislado de cada mejora

---

## Estrategia de Ramas Feature

### Nomenclatura de Ramas

```
feature/<descripcion-corta>
```

**Ejemplos:**
- `feature/refactor-blog-composable`
- `feature/add-testing-suite`
- `feature/setup-ci-cd`

### Workflow de Ramas

```
main (rama protegida)
  │
  ├── feature/refactor-blog-composable
  │   ├── Commit 1: Extract utility functions
  │   ├── Commit 2: Split composable into modules
  │   ├── Commit 3: Update imports
  │   └── Commit 4: Add documentation
  │
  ├── feature/add-testing-suite
  │   ├── Commit 1: Install testing dependencies
  │   ├── Commit 2: Configure Jest
  │   ├── Commit 3: Add utility tests
  │   ├── Commit 4: Add component tests
  │   └── Commit 5: Add composable tests
  │
  └── ... (otras features)
```

### Reglas de las Ramas

1. **Una rama = Una mejora específica**
2. **Base siempre desde `main` actualizada**
3. **Tests deben pasar localmente antes de push**
4. **Pull Request obligatorio para merge**
5. **Code review requerido**
6. **Delete branch después de merge**

---

## Detalles de Implementación por Feature

### Feature 1: Refactorizar Blog Composable

**Rama:** `feature/refactor-blog-composable`
**Prioridad:** 🔴 ALTA
**Tiempo Estimado:** 4-6 horas
**Dependencias:** Ninguna

#### Paso 1: Crear estructura de directorios

```bash
mkdir -p src/composables/blog
mkdir -p src/composables/utils
```

#### Paso 2: Extraer utilidades

**Archivo: `src/composables/utils/html-utils.ts`**
```typescript
/**
 * Utilidades para manejo de HTML
 */

export interface HtmlEntities {
  [key: string]: string
}

const htmlEntities: HtmlEntities = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&ldquo;': '"',
  '&rdquo;': '"'
}

/**
 * Decodifica entidades HTML
 */
export const decodeHtmlEntities = (text: string): string => {
  let decoded = text
  for (const [entity, char] of Object.entries(htmlEntities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }
  return decoded
}

/**
 * Limpia HTML y decodifica entidades
 */
export const cleanHtml = (html: string): string => {
  const cleaned = html.replace(/<[^>]*>/g, '')
  return decodeHtmlEntities(cleaned)
}
```

**Archivo: `src/composables/utils/text-utils.ts`**
```typescript
/**
 * Utilidades para manejo de texto
 */

import { cleanHtml } from './html-utils'

const READING_WPM = 200

/**
 * Trunca texto a una longitud específica
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

/**
 * Estima el tiempo de lectura en minutos
 */
export const estimateReadingTime = (content: string): number => {
  const cleanContent = cleanHtml(content)
  const wordCount = cleanContent.split(/\s+/).length
  return Math.ceil(wordCount / READING_WPM)
}
```

**Archivo: `src/composables/utils/date-utils.ts`**
```typescript
/**
 * Utilidades para manejo de fechas
 */

/**
 * Formatea una fecha para mostrar
 */
export const formatDate = (dateString: string, locale = 'es-ES'): string => {
  try {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}
```

**Archivo: `src/composables/utils/cache-utils.ts`**
```typescript
/**
 * Utilidades para manejo de cache
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Obtiene datos del cache si están vigentes
 */
export const getCacheData = <T>(key: string, duration: number): T | null => {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached) as CacheEntry<T>
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch {
    return null
  }
}

/**
 * Guarda datos en el cache
 */
export const setCacheData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (err) {
    console.warn('Error guardando en cache:', err)
  }
}
```

#### Paso 3: Dividir el composable principal

**Archivo: `src/composables/blog/use-blog-core.composable.ts`**
```typescript
/**
 * Composable principal para manejo del blog
 */

import { ref, onMounted } from 'vue'
import type { BlogPost, BlogError } from '@/interfaces/blog.interface'
import useBlogs from '@/composables/use-blogs.composable'
import { getCacheData, setCacheData } from '@/composables/utils/cache-utils'

const CACHE_DURATION = 30 * 60 * 1000

export default function useBlogCore() {
  const posts = ref<BlogPost[]>([])
  const isLoading = ref(false)
  const isRetrying = ref(false)
  const error = ref<BlogError | null>(null)
  const lastUpdate = ref<Date | null>(null)

  const { retrievePost } = useBlogs()

  const loadPosts = async (itemsPerPage: number): Promise<void> => {
    const cacheKey = `posts-${itemsPerPage}`
    const cached = getCacheData<BlogPost[]>(cacheKey, CACHE_DURATION)

    if (cached) {
      posts.value = cached
      lastUpdate.value = new Date()
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const response = await retrievePost(Math.max(itemsPerPage, 12))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      posts.value = data
      lastUpdate.value = new Date()

      setCacheData(cacheKey, data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      error.value = {
        type: 'network',
        message: errorMessage,
        timestamp: Date.now()
      }
      console.error('Error cargando posts:', err)
    } finally {
      isLoading.value = false
      isRetrying.value = false
    }
  }

  const retryLoad = async (itemsPerPage: number): Promise<void> => {
    isRetrying.value = true
    await loadPosts(itemsPerPage)
  }

  return {
    posts,
    isLoading,
    isRetrying,
    error,
    lastUpdate,
    loadPosts,
    retryLoad
  }
}
```

**Archivo: `src/composables/blog/use-blog-filters.composable.ts`**
```typescript
/**
 * Composable para filtros y búsqueda del blog
 */

import { ref, computed, watch } from 'vue'
import type { BlogPost, ViewMode } from '@/interfaces/blog.interface'
import { cleanHtml } from '@/composables/utils/html-utils'

const ITEMS_PER_PAGE = 6

export default function useBlogFilters(posts: Ref<BlogPost[]>) {
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)
  const viewMode = ref<ViewMode>('grid')
  const currentPage = ref(1)
  const itemsPerPage = ref(ITEMS_PER_PAGE)

  const filteredPosts = computed(() => {
    let filtered = posts.value.slice()

    // Filtro por búsqueda
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(post => {
        const titleText = cleanHtml(post.title.rendered).toLowerCase()
        const excerptText = cleanHtml(post.excerpt.rendered).toLowerCase()
        return titleText.includes(query) || excerptText.includes(query)
      })
    }

    // Filtro por categoría
    if (selectedCategory.value !== null) {
      filtered = filtered.filter(post =>
        post.categories?.includes(selectedCategory.value!)
      )
    }

    return filtered
  })

  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPosts.value.slice(start, end)
  })

  const totalPages = computed(() =>
    Math.ceil(filteredPosts.value.length / itemsPerPage.value)
  )

  const clearSearch = (): void => {
    searchQuery.value = ''
  }

  // Reset página cuando cambian filtros
  watch([searchQuery, selectedCategory, itemsPerPage], () => {
    currentPage.value = 1
  })

  return {
    searchQuery,
    selectedCategory,
    viewMode,
    currentPage,
    itemsPerPage,
    filteredPosts,
    paginatedPosts,
    totalPages,
    clearSearch
  }
}
```

**Archivo: `src/composables/blog/use-blog-categories.composable.ts`**
```typescript
/**
 * Composable para manejo de categorías del blog
 */

import { ref } from 'vue'
import type { Category, TechCrunchCategory, CategoryCacheEntry } from '@/interfaces/blog.interface'

const CACHE_DURATION = 30 * 60 * 1000

const categoryColors: Record<string, string> = {
  Tecnología: '#3b82f6',
  Startups: '#10b981',
  'Inteligencia Artificial': '#8b5cf6',
  // ... resto de colores
}

export default function useBlogCategories() {
  const categories = ref<Category[]>([])
  const categoriesCache = ref<CategoryCacheEntry | null>(null)

  const loadCategories = async (): Promise<void> => {
    // Verificar cache
    if (categoriesCache.value &&
        (Date.now() - categoriesCache.value.timestamp) < CACHE_DURATION) {
      categories.value = categoriesCache.value.data
      return
    }

    try {
      const response = await fetch('https://techcrunch.com/wp-json/wp/v2/categories?per_page=100')

      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status}`)
      }

      const data: TechCrunchCategory[] = await response.json()

      const transformed: Category[] = data
        .filter(cat => cat.count > 0)
        .map(cat => ({
          id: cat.id,
          name: cat.name,
          count: cat.count,
          color: categoryColors[cat.slug] || '#6b7280'
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20)

      categories.value = transformed
      categoriesCache.value = {
        data: transformed,
        timestamp: Date.now()
      }
    } catch (err) {
      console.error('Error cargando categorías:', err)
      // Fallback
      categories.value = [
        { id: 1, name: 'Tecnología', count: 10, color: '#3b82f6' },
        { id: 2, name: 'Startups', count: 8, color: '#10b981' }
      ]
    }
  }

  const getCategoryName = (categoryId: number): string => {
    return categories.value.find(c => c.id === categoryId)?.name || 'Sin categoría'
  }

  return {
    categories,
    loadCategories,
    getCategoryName
  }
}
```

#### Paso 4: Actualizar el composable principal

**Archivo: `src/composables/use-blog-enhanced.composable.ts` (Nueva versión)**
```typescript
/**
 * Enhanced Blog Composable (Refactorizado)
 * Ahora orquesta los módulos especializados
 */

import { onMounted } from 'vue'
import useBlogCore from './blog/use-blog-core.composable'
import useBlogFilters from './blog/use-blog-filters.composable'
import useBlogCategories from './blog/use-blog-categories.composable'
import { estimateReadingTime } from './utils/text-utils'
import { formatDate } from './utils/date-utils'
import { cleanHtml, decodeHtmlEntities } from './utils/html-utils'
import { truncate } from './utils/text-utils'

export default function useBlogEnhanced() {
  // Usar composables modulares
  const core = useBlogCore()
  const filters = useBlogFilters(core.posts)
  const categories = useBlogCategories()

  // Cargar datos al montar
  onMounted(async () => {
    await categories.loadCategories()
    await core.loadPosts(filters.itemsPerPage.value)
  })

  return {
    // Estado del core
    ...core,

    // Filtros y búsqueda
    ...filters,

    // Categorías
    ...categories,

    // Utilidades exportadas
    estimateReadingTime,
    formatDate,
    cleanHtml,
    decodeHtmlEntities,
    truncate
  }
}
```

#### Paso 5: Actualizar imports en componentes

```vue
<script setup lang="ts">
// Los componentes que usan el composable no necesitan cambios
// porque la API pública sigue siendo la misma
import useBlogEnhanced from '@/composables/use-blog-enhanced.composable'

const {
  posts,
  isLoading,
  loadPosts,
  // ... resto igual
} = useBlogEnhanced()
</script>
```

#### Checklist de la Feature

- [ ] Crear estructura de directorios
- [ ] Extraer utilidades HTML
- [ ] Extraer utilidades de texto
- [ ] Extraer utilidades de fecha
- [ ] Extraer utilidades de cache
- [ ] Crear composable core
- [ ] Crear composable de filtros
- [ ] Crear composable de categorías
- [ ] Actualizar composable principal
- [ ] Verificar que componentes funcionan
- [ ] Ejecutar linter
- [ ] Crear tests unitarios
- [ ] Documentar cambios
- [ ] Crear PR

---

### Feature 2: Suite de Tests

**Rama:** `feature/add-testing-suite`
**Prioridad:** 🔴 ALTA
**Tiempo Estimado:** 6-8 horas
**Dependencias:** Ninguna (pero recomendado después de Feature 1)

#### Paso 1: Instalar dependencias

```bash
yarn add -D @vue/test-utils jest @types/jest ts-jest vue-jest
yarn add -D @testing-library/vue @testing-library/jest-dom
```

#### Paso 2: Configurar Jest

**Archivo: `jest.config.js`**
```javascript
module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
    '**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.ts',
    '!src/router/index.ts',
    '!**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

#### Paso 3: Actualizar package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

#### Paso 4: Crear tests de utilidades

**Archivo: `tests/unit/composables/utils/html-utils.spec.ts`**
```typescript
import { decodeHtmlEntities, cleanHtml } from '@/composables/utils/html-utils'

describe('html-utils', () => {
  describe('decodeHtmlEntities', () => {
    it('should decode common HTML entities', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&')
      expect(decodeHtmlEntities('&lt;')).toBe('<')
      expect(decodeHtmlEntities('&gt;')).toBe('>')
      expect(decodeHtmlEntities('&quot;')).toBe('"')
    })

    it('should decode multiple entities in a string', () => {
      const input = 'AT&amp;T &quot;Innovation&quot; &lt;2024&gt;'
      const expected = 'AT&T "Innovation" <2024>'
      expect(decodeHtmlEntities(input)).toBe(expected)
    })

    it('should handle strings without entities', () => {
      const input = 'Plain text'
      expect(decodeHtmlEntities(input)).toBe(input)
    })
  })

  describe('cleanHtml', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong></p>'
      expect(cleanHtml(html)).toBe('Hello world')
    })

    it('should remove tags and decode entities', () => {
      const html = '<p>AT&amp;T &quot;Company&quot;</p>'
      expect(cleanHtml(html)).toBe('AT&T "Company"')
    })

    it('should handle empty strings', () => {
      expect(cleanHtml('')).toBe('')
    })

    it('should handle nested tags', () => {
      const html = '<div><p>Text <span>nested</span></p></div>'
      expect(cleanHtml(html)).toBe('Text nested')
    })
  })
})
```

**Archivo: `tests/unit/composables/utils/text-utils.spec.ts`**
```typescript
import { truncate, estimateReadingTime } from '@/composables/utils/text-utils'

describe('text-utils', () => {
  describe('truncate', () => {
    it('should not truncate short strings', () => {
      const text = 'Short'
      expect(truncate(text, 10)).toBe('Short')
    })

    it('should truncate long strings', () => {
      const text = 'This is a very long string that needs truncation'
      const result = truncate(text, 20)
      expect(result.length).toBeLessThanOrEqual(23) // 20 + '...'
      expect(result).toContain('...')
    })

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncate(text, 20)).toBe(text)
    })
  })

  describe('estimateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const content = 'word '.repeat(200) // 200 palabras = 1 minuto
      expect(estimateReadingTime(content)).toBe(1)
    })

    it('should round up partial minutes', () => {
      const content = 'word '.repeat(250) // 250 palabras = 1.25 minutos
      expect(estimateReadingTime(content)).toBe(2)
    })

    it('should handle HTML content', () => {
      const content = '<p>' + 'word '.repeat(200) + '</p>'
      expect(estimateReadingTime(content)).toBe(1)
    })
  })
})
```

#### Paso 5: Tests de componentes

**Archivo: `tests/unit/components/base/AboutMe.spec.ts`**
```typescript
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AboutMe from '@/components/base/AboutMe.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  messages: {
    es: {
      home: {
        greeting: 'Hola',
        name: 'Yerffrey Romero'
      }
    }
  }
})

describe('AboutMe.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(AboutMe, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.text()).toContain('Yerffrey Romero')
  })

  it('should display statistics', () => {
    const wrapper = mount(AboutMe, {
      global: {
        plugins: [i18n]
      }
    })
    // Verificar que se muestran estadísticas
    expect(wrapper.find('.stat').exists()).toBe(true)
  })
})
```

#### Checklist de la Feature

- [ ] Instalar dependencias de testing
- [ ] Configurar Jest
- [ ] Actualizar scripts en package.json
- [ ] Crear tests de utilidades HTML
- [ ] Crear tests de utilidades de texto
- [ ] Crear tests de utilidades de fecha
- [ ] Crear tests de utilidades de cache
- [ ] Crear tests de composables
- [ ] Crear tests de componentes base
- [ ] Ejecutar tests y verificar coverage >70%
- [ ] Configurar CI para ejecutar tests
- [ ] Documentar cómo ejecutar tests
- [ ] Crear PR

---

### Feature 3: CI/CD Pipeline

**Rama:** `feature/setup-ci-cd`
**Prioridad:** 🔴 ALTA
**Tiempo Estimado:** 3-4 horas
**Dependencias:** Feature 2 (tests)

#### Paso 1: Crear workflow principal

**Archivo: `.github/workflows/ci.yml`**
```yaml
name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run ESLint
        run: yarn lint

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run tests
        run: yarn test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json

  build:
    name: Build Project
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build
        run: yarn build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7

  typecheck:
    name: TypeScript Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Type check
        run: npx vue-tsc --noEmit
```

#### Paso 2: Workflow de deployment

**Archivo: `.github/workflows/deploy.yml`**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

#### Paso 3: Dependency review

**Archivo: `.github/workflows/dependency-review.yml`**
```yaml
name: Dependency Review

on:
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Dependency Review
        uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: high
```

#### Checklist de la Feature

- [ ] Crear workflow de CI
- [ ] Crear workflow de deployment
- [ ] Crear workflow de dependency review
- [ ] Configurar secrets en GitHub (VERCEL_TOKEN, CODECOV_TOKEN)
- [ ] Probar workflows con PR
- [ ] Verificar que todos los jobs pasan
- [ ] Configurar branch protection rules
- [ ] Documentar proceso de CI/CD
- [ ] Crear PR

---

## Orden de Implementación Recomendado

### Semana 1
1. ✅ Feature 1: Refactorizar blog composable
2. ✅ Feature 2: Suite de tests
3. ✅ Feature 3: CI/CD

### Semana 2
4. ✅ Feature 4: Actualizar TypeScript
5. ✅ Feature 5: Variables de entorno
6. ✅ Feature 8: Pre-commit hooks

### Semana 3
7. ✅ Feature 6: Accesibilidad
8. ✅ Feature 9: Dependabot
9. ✅ Feature 10: Documentación

### Semana 4
10. ✅ Feature 7: Optimizar assets

---

## Comandos Útiles

### Gestión de Ramas

```bash
# Crear y cambiar a nueva rama feature
git checkout -b feature/nombre-feature

# Actualizar rama con cambios de main
git fetch origin main
git rebase origin/main

# Push de rama feature
git push -u origin feature/nombre-feature

# Eliminar rama local después de merge
git branch -d feature/nombre-feature

# Eliminar rama remota
git push origin --delete feature/nombre-feature
```

### Testing

```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests con coverage
yarn test:unit

# Ejecutar tests en modo watch
yarn test:watch

# Ejecutar tests de un archivo específico
yarn test path/to/file.spec.ts
```

### Linting

```bash
# Ejecutar linter
yarn lint

# Ejecutar linter y auto-fix
yarn lint --fix
```

### Build

```bash
# Build de desarrollo
yarn serve

# Build de producción
yarn build

# Preview de build de producción
yarn preview
```

---

## Notas Finales

- Cada feature debe poder ser implementada independientemente
- Si una feature depende de otra, esperar a que se mergee primero
- Mantener PRs pequeños y enfocados
- Escribir descripciones claras en los PRs
- Incluir screenshots/videos cuando sea relevante
- Actualizar este documento si se encuentran problemas

---

**Última actualización:** 2026-01-14
**Mantenido por:** Equipo de Desarrollo
