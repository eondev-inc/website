# Guía de Contribución

Gracias por tu interés en contribuir al proyecto! Esta guía te ayudará a comenzar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Mensajes de Commit](#mensajes-de-commit)
- [Testing](#testing)
- [Documentación](#documentación)

## 📜 Código de Conducta

Este proyecto y todos sus participantes se rigen por nuestro Código de Conducta. Al participar, se espera que mantengas este código. Por favor, reporta comportamientos inaceptables a [hola@eondev.site](mailto:hola@eondev.site).

## 🤝 Cómo Contribuir

### Reportar Bugs

Los bugs se rastrean como [GitHub issues](https://github.com/eondev-inc/website/issues). Para reportar un bug:

1. **Usa una etiqueta clara y descriptiva** para el issue
2. **Describe los pasos exactos** para reproducir el problema
3. **Proporciona ejemplos específicos**
4. **Describe el comportamiento observado y esperado**
5. **Incluye capturas de pantalla** si es relevante
6. **Especifica tu entorno**:
   - Versión de Node.js
   - Versión del navegador
   - Sistema operativo

### Sugerir Mejoras

Las mejoras también se rastrean como [GitHub issues](https://github.com/eondev-inc/website/issues). Para sugerir una mejora:

1. **Usa una etiqueta clara y descriptiva**
2. **Proporciona una descripción detallada** de la mejora sugerida
3. **Explica por qué** esta mejora sería útil
4. **Proporciona ejemplos** de cómo funcionaría

### Tu Primera Contribución de Código

¿No estás seguro por dónde empezar? Puedes buscar issues etiquetados como:

- `good first issue` - issues adecuados para principiantes
- `help wanted` - issues donde necesitamos ayuda

## 🔄 Flujo de Trabajo

### 1. Fork del Repositorio

```bash
# Fork en GitHub, luego clona tu fork
git clone https://github.com/TU-USUARIO/website.git
cd website

# Añade el repositorio original como remote
git remote add upstream https://github.com/eondev-inc/website.git
```

### 2. Crea una Rama

```bash
# Asegúrate de tener la última versión de main
git checkout main
git pull upstream main

# Crea una nueva rama feature
git checkout -b feature/mi-nueva-feature

# O una rama de fix
git checkout -b fix/arreglar-bug
```

**Nomenclatura de ramas:**

- `feature/descripcion` - Para nuevas características
- `fix/descripcion` - Para corrección de bugs
- `docs/descripcion` - Para cambios en documentación
- `refactor/descripcion` - Para refactorización
- `test/descripcion` - Para añadir tests

### 3. Desarrolla

```bash
# Instala dependencias
yarn install

# Inicia el servidor de desarrollo
yarn serve

# Haz tus cambios...
```

### 4. Prueba

```bash
# Ejecuta tests
yarn test

# Verifica el linting
yarn lint

# Verifica el build
yarn build
```

### 5. Commit

```bash
# Añade tus cambios
git add .

# Commit siguiendo Conventional Commits
git commit -m "feat: add amazing feature"
```

Los mensajes de commit se validan automáticamente con commitlint.

### 6. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/mi-nueva-feature
```

Luego abre un Pull Request en GitHub.

## 🎨 Estándares de Código

### TypeScript

```typescript
// ✅ Bueno
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = (id: number): Promise<User> => {
  // ...
};

// ❌ Malo
const getUser = (id: any): any => {
  // ...
};
```

**Reglas:**

- Usa `interface` sobre `type` cuando sea posible
- Evita `any`, usa `unknown` si necesitas un tipo genérico
- Usa `const` sobre `let` cuando sea posible
- Documenta funciones públicas con JSDoc

### Vue

```vue
<!-- ✅ Bueno -->
<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  title: string;
  count?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  update: [value: number];
}>();

const localCount = ref(props.count ?? 0);
const doubleCount = computed(() => localCount.value * 2);
</script>

<!-- ❌ Malo -->
<script>
export default {
  props: ["title", "count"],
  data() {
    return {
      localCount: this.count || 0,
    };
  },
};
</script>
```

**Reglas:**

- Usa Composition API (`<script setup>`)
- Tipado fuerte con TypeScript
- Props y eventos tipados
- Componentes SFC de archivo único

### CSS/Tailwind

```vue
<!-- ✅ Bueno -->
<template>
  <div
    class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
  >
    <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
  </div>
</template>

<!-- ❌ Malo -->
<template>
  <div class="container">
    <h2>{{ title }}</h2>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
```

**Reglas:**

- Prefiere Tailwind classes sobre CSS custom
- Usa `scoped` para estilos de componente
- Mobile-first approach
- Variables CSS para temas

## 📝 Mensajes de Commit

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo, puntos y comas, etc
- `refactor`: Refactorización
- `perf`: Mejoras de rendimiento
- `test`: Añadir o corregir tests
- `build`: Cambios en el sistema de build
- `ci`: Cambios en CI
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
# Feature
feat: add user authentication
feat(auth): implement JWT token validation

# Fix
fix: resolve navigation issue on mobile
fix(blog): correct pagination calculation

# Docs
docs: update installation instructions
docs(api): add JSDoc comments to utils

# Refactor
refactor: extract blog logic into composables
refactor(types): improve TypeScript interfaces

# Test
test: add unit tests for date utilities
test(blog): add integration tests for filters
```

### Reglas

1. **Tipo en minúsculas**: `feat` no `Feat`
2. **Sin punto final**: `feat: add feature` no `feat: add feature.`
3. **Imperativo**: `add` no `added` o `adds`
4. **Máximo 100 caracteres** en el header
5. **Body opcional** pero recomendado para cambios complejos
6. **Footer opcional** para breaking changes o referencias

## 🧪 Testing

### Escribir Tests

```typescript
// tests/unit/composables/utils/text-utils.spec.ts
import { truncate } from "@/composables/utils/text-utils";

describe("text-utils", () => {
  describe("truncate", () => {
    it("should not truncate short strings", () => {
      const text = "Short";
      expect(truncate(text, 10)).toBe("Short");
    });

    it("should truncate long strings", () => {
      const text = "This is a very long string";
      const result = truncate(text, 10);
      expect(result).toContain("...");
      expect(result.length).toBeLessThanOrEqual(13);
    });
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests
yarn test

# Tests específicos
yarn test text-utils

# Con coverage
yarn test:unit

# En modo watch
yarn test:watch
```

### Coverage

- Mantén el coverage >70%
- Escribe tests para:
  - Nuevas funcionalidades
  - Bug fixes
  - Casos edge
  - Lógica compleja

## 📚 Documentación

### JSDoc

```typescript
/**
 * Trunca un string a una longitud específica
 * @param str - String a truncar
 * @param length - Longitud máxima
 * @returns String truncado con '...' si es necesario
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "...";
};
```

### README y Docs

- Actualiza el README.md si añades features
- Añade ejemplos de uso
- Documenta cambios breaking
- Actualiza screenshots si cambias la UI

## ✅ Checklist antes de PR

Antes de crear un Pull Request, verifica que:

- [ ] El código sigue los estándares del proyecto
- [ ] Todos los tests pasan (`yarn test`)
- [ ] El linting pasa (`yarn lint`)
- [ ] El build funciona (`yarn build`)
- [ ] Has añadido tests para nuevas funcionalidades
- [ ] Has actualizado la documentación si es necesario
- [ ] Los mensajes de commit siguen Conventional Commits
- [ ] No hay conflictos con la rama main
- [ ] Has probado la funcionalidad manualmente

## 🎉 Reconocimientos

Los contribuidores serán listados en el README y en los release notes.

## 💬 Necesitas Ayuda?

- Abre un [Discussion](https://github.com/eondev-inc/website/discussions)
- Contacta a [hola@eondev.site](mailto:hola@eondev.site)
- Únete a nuestro Discord (próximamente)

---

¡Gracias por contribuir! 🎉
