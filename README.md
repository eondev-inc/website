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
- **npm** >= 8.x
- **Git** >= 2.x
- **Make** >= 4.x (opcional, para los objetivos de `make`)
- **Docker** + Docker Compose (opcional, para el entorno en contenedor)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/eondev-inc/website.git
cd website
```

### 2. Instalar dependencias

```bash
make install
```

Equivale a `npm ci` y a crear `.env.local` a partir de `.env.example`.

### 3. Configurar variables de entorno

`make install` ya genera `.env.local`. Para hacerlo manualmente:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones.

### 4. Iniciar servidor de desarrollo

```bash
make dev
```

La aplicación estará disponible en `http://localhost:5173`.

O con Docker (mismo servidor de Vite, puerto 8080):

```bash
make docker-up
```

### 5. Ver los objetivos disponibles

```bash
make help
```

## 📜 Scripts Disponibles

### Vía Make (recomendado)

```bash
make install     # Instala dependencias y prepara .env.local
make dev         # Servidor de desarrollo con hot-reload (0.0.0.0:5173)
make build       # Build de producción en dist/
make preview     # Sirve el build de producción
make test        # Tests con Jest
make test-watch  # Tests en modo watch
make test-ci     # Tests en modo CI con coverage
make lint        # ESLint sobre src/ y tests/
make lint-fix    # ESLint con auto-corrección
make typecheck   # tsc --noEmit
make check       # lint + typecheck + tests con coverage
make clean       # Limpia dist/, coverage/ y cachés de build
```

### Docker

```bash
make docker-up          # Levanta el stack de desarrollo (http://localhost:8080)
make docker-logs        # Logs del stack
make docker-down        # Detiene el stack y resetea el volumen node_modules
make docker-prod-build  # Construye la imagen de producción (nginx)
make docker-prod-up     # Levanta la imagen de producción (http://localhost:8081/website/)
```

### Vía npm

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Vista previa del build
npm run lint       # ESLint
npm test           # Tests
npm run test:ci    # Tests en modo CI con coverage
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
make test

# Con coverage
make coverage

# Modo watch
make test-watch
```

### Coverage

El proyecto mantiene los umbrales definidos en `jest.config.js`:

- Branches: 78%
- Functions: 90%
- Lines: 90%
- Statements: 90%

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
