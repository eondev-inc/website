# 🚀 Portfolio Web - Yerffrey Romero

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/eondev-inc/website)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.2.13-green)](https://vuejs.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](tests/)

> Portfolio profesional y blog personal construido con Vue 3, TypeScript y Tailwind CSS

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#acerca-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Testing](#testing)
- [Git Hooks](#git-hooks)
- [Contribuir](#contribuir)

## 🎯 Acerca del Proyecto

Portfolio web profesional que incluye:

- **Página de inicio** con presentación y estadísticas
- **Timeline de experiencia** profesional
- **Blog** con artículos de TechCrunch integrados
- **Formulario de contacto** validado
- **Multiidioma** (Español/Inglés)
- **Diseño responsive** mobile-first

## 🛠️ Stack Tecnológico

### Frontend

- **[Vue 3](https://vuejs.org/)** (^3.2.13) - Framework JavaScript progresivo
- **[TypeScript](https://www.typescriptlang.org/)** (^5.1.3) - Tipado estático
- **[Vue Router 4](https://router.vuejs.org/)** (^4.0.3) - Enrutamiento SPA
- **[Tailwind CSS](https://tailwindcss.com/)** (^3.1.8) - Framework CSS utility-first
- **[Vue i18n](https://vue-i18n.intlify.dev/)** (v9) - Internacionalización

### Testing & Quality

- **[Jest](https://jestjs.io/)** (^30.2.0) - Framework de testing
- **[Vue Test Utils](https://test-utils.vuejs.org/)** (^2.4.0) - Utilidades para testing Vue
- **[ESLint](https://eslint.org/)** (^8.43.0) - Linter JavaScript/TypeScript
- **[Husky](https://typicode.github.io/husky/)** (^9.1.7) - Git hooks
- **[Commitlint](https://commitlint.js.org/)** - Validación de mensajes de commit

## ✨ Características

### 🎨 Diseño y UX

- ✅ Diseño responsive mobile-first
- ✅ Animaciones suaves con CSS y Vue transitions
- ✅ Tema personalizado con Tailwind CSS
- ✅ Modo de vista grid/lista para blog
- ✅ Skeleton loaders para mejor UX

### ♿ Accesibilidad

- ✅ WCAG 2.1 AA compliance
- ✅ Skip links para navegación por teclado
- ✅ ARIA labels completos
- ✅ Focus management
- ✅ Screen reader support

### 🌐 Internacionalización

- ✅ Soporte para Español e Inglés
- ✅ Cambio dinámico de idioma
- ✅ Traducciones completas de UI

### 📝 Blog

- ✅ Integración con API de TechCrunch
- ✅ Búsqueda en tiempo real
- ✅ Filtros por categoría
- ✅ Paginación configurable
- ✅ Cache inteligente (30 minutos)
- ✅ Tiempo estimado de lectura
- ✅ Compartir en redes sociales

### 🔒 Calidad de Código

- ✅ Tests unitarios con Jest (33+ tests)
- ✅ CI/CD con GitHub Actions
- ✅ Pre-commit hooks con Husky
- ✅ Conventional Commits
- ✅ TypeScript ES2020
- ✅ Coverage >70%

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **Yarn** >= 1.22.x (o npm >= 8.x)
- **Git** >= 2.x

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/eondev-inc/website.git
cd website
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones.

### 4. Iniciar servidor de desarrollo

```bash
yarn serve
```

La aplicación estará disponible en `http://localhost:8080`

## 📜 Scripts Disponibles

### Desarrollo

```bash
# Servidor de desarrollo con hot-reload
yarn serve

# Build de producción
yarn build

# Linting con auto-fix
yarn lint
```

### Testing

```bash
# Ejecutar todos los tests
yarn test

# Tests con coverage
yarn test:unit

# Tests en modo watch
yarn test:watch

# Tests para CI
yarn test:ci
```

## 📁 Estructura del Proyecto

```
website/
├── .github/workflows/       # CI/CD pipelines
├── .husky/                  # Git hooks
├── src/
│   ├── components/
│   │   ├── accessibility/   # Componentes a11y
│   │   ├── base/            # Componentes reutilizables
│   │   └── layouts/         # Layouts
│   ├── composables/
│   │   ├── blog/            # Blog composables
│   │   └── utils/           # Utilidades
│   ├── interfaces/          # TypeScript interfaces
│   ├── locales/             # i18n translations
│   ├── router/              # Vue Router
│   └── views/               # Páginas
├── tests/                   # Tests unitarios
└── docs/                    # Documentación
```

Ver documentación completa de arquitectura en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
yarn test

# Con coverage
yarn test:unit

# Modo watch
yarn test:watch
```

### Coverage

El proyecto mantiene >70% de cobertura en:

- Branches
- Functions
- Lines
- Statements

## 🪝 Git Hooks

### Pre-commit

Ejecuta automáticamente:

- ESLint en archivos .js/.ts/.vue
- Prettier en archivos .css/.scss/.vue/.md

### Commit-msg

Valida mensajes siguiendo [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Válido
feat: add user authentication
fix: resolve navigation bug
docs: update README

# Inválido
Update code         # ❌ Sin tipo
FEAT: add feature   # ❌ Mayúsculas
feat: Add feature.  # ❌ Termina con punto
```

Ver [.husky/COMMIT_CONVENTION.md](.husky/COMMIT_CONVENTION.md) para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías

- Sigue Conventional Commits
- Escribe tests para nuevas funcionalidades
- Mantén coverage >70%
- Documenta funciones públicas

Ver [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) para más detalles.

## 📊 Métricas del Proyecto

- **Componentes**: 15+
- **Composables**: 12+
- **Tests**: 33+
- **Coverage**: >70%
- **Bundle Size**: ~520KB

## 👤 Autor

**Yerffrey Romero**

- Website: [eondev.site](https://eondev.site)
- Email: [hola@eondev.site](mailto:hola@eondev.site)
- LinkedIn: [@yerom](https://linkedin.com/in/yerom)
- GitHub: [@eondev-inc](https://github.com/eondev-inc)

---

⭐️ Made with ❤️ by [Yerffrey Romero](https://github.com/eondev-inc)
