# Guía de Mensajes de Commit

Este proyecto utiliza [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit estandarizados.

## Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Tipos de Commit

- **feat**: Nueva característica
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (espacios, puntos y comas, etc)
- **refactor**: Refactorización de código (ni fix ni feat)
- **perf**: Mejoras de rendimiento
- **test**: Añadir o corregir tests
- **build**: Cambios en el sistema de build o dependencias
- **ci**: Cambios en la configuración de CI
- **chore**: Tareas de mantenimiento
- **revert**: Revertir commits anteriores

## Ejemplos de Commits Válidos

```bash
# Feature
feat: add user authentication
feat(auth): implement JWT token validation

# Fix
fix: resolve navigation issue on mobile devices
fix(blog): correct pagination calculation

# Documentation
docs: update README with new installation steps
docs(api): add JSDoc comments to utils functions

# Refactoring
refactor: extract blog composable into modules

# Tests
test: add unit tests for date utilities

# Chore
chore: update dependencies
chore(deps): bump vue from 3.2.13 to 3.4.0
```

## Mensajes de commit válidos:

- feat: add user authentication
- fix: resolve navigation bug on mobile
- docs: update README with setup instructions
- style: format code with prettier
- refactor: split blog composable into modules
- test: add unit tests for utilities
- chore: update dependencies

## Mensajes de commit inválidos:

- ❌ "Update code" (falta tipo)
- ❌ "FEAT: add feature" (type debe ser minúscula)
- ❌ "feat: Add feature." (no debe terminar con punto)
- ❌ "fix(scope): Fix bug that was really long and exceeds the maximum header length of 100 characters..." (muy largo)
