# ODD: Corrección de vulnerabilidades OWASP + migración a Vite

> Alcance acordado: **todo incluida migración a Vite** (opción 3).
> Feature branch sugerida: `feat/security-vite-migration`

## Contexto

Revisión de seguridad documentada en `docs/SECURITY-REVIEW.md` (2026-09-25).
Hallazgos críticos: XSS vía `v-html` con contenido de WP REST, bypass en
`cleanHtml`, ausencia de headers/CSP, cadena de build insegura, y toolchain
`@vue/cli-service@5` con 19 advisories (solo dev). La migración a Vite elimina
la toolchain vulnerable y habilita el uso correcto de variables `VITE_*`.

## Objetivo

1. Migrar el build de Vue CLI 5 a Vite.
2. Corregir todos los hallazgos de seguridad de P1, P2 y P3.
3. Dejar CI/Docker endurecidos y reproducibles.
4. Validar con pruebas manuales en browser que la aplicación sigue funcionando.

## Tareas

### T1 — Spike: Vite config mínima y build verde

- [x] Crear `vite.config.ts` equivalente a la configuración actual (alias `@`, Vue, TypeScript, SCSS, Tailwind).
- [x] Migrar `public/index.html` a `index.html` en root (script `src/main.ts`, `<base>` si es necesario).
- [x] Ajustar `package.json`: scripts `dev`, `build`, `preview`, `test`, `test:ci`; eliminar dependencias de Vue CLI.
- [x] Ejecutar `npm install` y `npm run build` sin errores.
- [x] Ejecutar `npm run test:ci` y lograr que pase.

**Evidencia de cierre**: build exitoso + tests pasan. Commit `17e55ba`. Se migró de `yarn` a `npm` porque `yarn` no está instalado en el entorno.

### T2 — Variables de entorno y URL de la API unificada

- [x] Renombrar variables `VUE_APP_*` a `VITE_*` y actualizar `.env.example`.
- [x] Crear `src/config/api.ts` con validación de origen.
- [x] Reemplazar todos los `fetch` hardcodeados por la config central.
- [x] Ajustar `vite.config.ts` para inyectar `process.env.VITE_*` y mantener compatibilidad con Jest.
- [x] Actualizar tests que usaban `VITE_API_BLOG_URL`.

**Evidencia de cierre**: `grep -r "techcrunch.com/wp-json" src/` solo devuelve la config y el default. Commit `19461ed`.

### T2 — Variables de entorno y URL de la API unificada

- [ ] Renombrar variables `VUE_APP_*` a `VITE_*` y actualizar `.env.example`.
- [ ] Crear `src/config/api.ts` con validación de origen:
  - Leer `import.meta.env.VITE_API_BASE_URL`.
  - Validar contra allowlist de hosts permitidos.
  - Default a `https://techcrunch.com/wp-json/wp/v2`.
- [ ] Reemplazar todos los `fetch` hardcodeados (`use-blogs.composable.ts`, `use-blog-categories.composable.ts`) por la config central.

**Evidencia de cierre**: `grep -r "techcrunch.com/wp-json" src/` solo devuelve la config y el default.

### T3 — Fix XSS y saneado (F1 + F2)

- [x] `src/composables/utils/html-utils.ts`:
  - Corregir orden de `cleanHtml` (decode primero, strip después).
  - Implementar `sanitizeHtml` con DOMPurify allowlist (`p`, `br`, `strong`, `em`, `a`).
- [x] `src/components/base/OurBlog.vue`:
  - Cambiar `v-html="blog.title.rendered"` a interpolación `{{ cleanHtml(...) }}`.
  - Usar `sanitizeHtml` para el excerpt.
- [x] Tests de regresión en `tests/unit/composables/utils/html-utils.spec.ts`.

**Evidencia de cierre**: tests nuevos pasan, no quedan `v-html` alimentados por la API. Commit `a38cb30`.

### T4 — Validación de enlaces y navegación segura (F3 + F9)

- [ ] Crear helper `src/composables/utils/url-utils.ts`:
  - `isAllowedExternalUrl(url)` → solo `https:` y host en allowlist.
- [x] `OurBlog.vue`: usar helper para `blog.link`; si no es válido, mostrar `#`.
- [x] `AboutView.vue`: `window.open(url, '_blank', 'noopener,noreferrer')`.
- [x] Tests unitarios para el helper.

**Evidencia de cierre**: `grep -r "window.open" src/` muestra `noopener,noreferrer`. Commit `cfc04e7`.

### T5 — CSP y headers de seguridad (F4)

- [x] Actualizar `vercel.json` con bloque `headers`:
  - `Content-Security-Policy`.
  - `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- [ ] Verificar en preview de Vercel que no hay violaciones de CSP en la consola (pendiente de deploy manual).

**Evidencia de cierre**: `vercel.json` actualizado. Commit `3c7d5a7`.

### T6 — Hardening CI y Docker (F5)

- [ ] `.github/workflows/ci.yml`:
  - Node 22 (o 20).
  - Acciones punteadas por SHA (con comentario `# v4`).
  - `actions/upload-artifact@v4`.
  - `yarn install --frozen-lockfile`.
  - Agregar paso de `yarn audit --level moderate` (con posibilidad de allowlist).
- [ ] `Dockerfile`:
  - Versión explícita de Node (`node:22-alpine`).
  - `yarn install --frozen-lockfile`.
  - `USER node` en stage final.
  - Servir con `nginx:alpine` en lugar de `http-server` global (menos superficie); o al menos pinear `http-server@<version>`.
- [ ] `Dockerfile.dev`: mismo tratamiento para dev.
- [x] `.github/dependabot.yml`: agregar `package-ecosystem: "github-actions"`.

**Evidencia de cierre**: CI actualizado a Node 22, acciones por SHA, upload-artifact@v4, `npm ci`, audit en build. Commit `e6b8618`. (Build de Docker no probado localmente por permisos.)

### T7 — Mailto seguro y autenticación decorativa (F7 + F8)

- [x] `CallToAction.vue`: `encodeURIComponent(values.email)` en `cc=`.
- [x] `router/index.ts`: documentar que `requiresAuth` es decorativo.

**Evidencia de cierre**: test unitario verifica codificación del `cc`. Commit `b1e42c3`.

### T8 — Higiene (F10 + F11)

- [x] `git rm src/composables/use-blog-enhanced.composable.ts.backup`.
- [x] Verificar que `.gitignore` cubra backups comunes (`*.backup`, `*.bak`).

**Evidencia de cierre**: `git ls-files | grep -i backup` vacío. Commit `d5c0861`.

### T9 — Dependencias y limpieza post-migración

- [x] Eliminar `@vue/cli-*`, `webpack`, `copy-webpack-plugin`, etc. del `package.json`.
- [x] Revisar `package-lock.json` residual: no debe quedar `@vue/cli-service` ni sus transitivas críticas.
- [x] Ejecutar `npm audit` y documentar resultado.

**Evidencia de cierre**: `npm audit` (all): 0 vulns; `npm audit --omit=dev`: 0 vulns. Se eliminó `vue-select` y `@types/vue-select` (no usados y arrastraban Vue 2 con advisory low). Se agregó `.npmrc` con `legacy-peer-deps=true` y `prettier` como devDependency (faltaba para husky). Commit `38257e4`.

### T10 — Pruebas manuales en browser

- [x] Ejecutar smoke test en `npm run preview` (build de producción local): `/` redirige a `/website/` y `/website/` devuelve HTML 200 con los assets correctos.
- [ ] Ejecutar el plan completo en el deploy preview de Vercel (para validar headers/CSP).
- [x] Plan de pruebas manuales documentado en este archivo.

**Evidencia de cierre**: smoke test local exitoso. Validación de headers/CSP pendiente de deploy en Vercel.

### T11 — Cierre

- [x] Commits con mensajes convencionales (9 work-unit commits en `feat/security-vite-migration`).
- [x] Actualizar `docs/SECURITY-REVIEW.md`: marcar checks corregidos y agregar entrada en bitácora.
- [x] Actualizar el mirror de Engram.

## Plan de pruebas manuales en browser

> Ejecutar con **build de producción local** (`yarn build && yarn preview`) y con **preview de Vercel**.

### Navegación general

1. Abrir `/` (home). Verificar que carga sin errores en consola.
2. Navegar a `/about`, `/blog`, `/contact`. Verificar que no hay errores 404 ni CSP.
3. Usar el selector de idioma (es/en). Verificar que cambia el contenido y persiste tras recargar.
4. Refrescar cada ruta directamente (`F5`). Verificar que no hay 404 (history mode funciona).

### Blog y contenido de terceros

5. En `/blog`, verificar que se listan posts con título, excerpt e imagen.
6. Inspeccionar un título: debe renderizarse como texto plano, no como `v-html`. No debe haber ejecutado scripts.
7. Hacer clic en "Leer artículo". Verificar que abre el post original en TechCrunch en pestaña nueva y que la pestaña original no es manipulable (`noopener`).
8. Verificar que un post con HTML en el título (si existe) muestra el texto decodificado pero sin tags ejecutables.
9. Cambiar a vista lista / vista grid. Verificar que el excerpt sigue mostrándose correctamente.

### Favoritos y cache

10. Marcar/desmarcar favoritos. Verificar que persiste tras recargar.
11. Desconectar internet (o bloquear la URL de la API) y recargar `/blog`. Verificar que muestra cache (si aún no venció) o mensaje de error controlado.

### Formulario de contacto

12. En `/` o `/contact`, completar el formulario con datos válidos y enviar. Verificar que se abre el cliente de correo con `mailto:` correcto.
13. En el campo email, probar `x@y.com&bcc=evil@example.com`. Verificar que el cliente de correo no agrega `bcc` (debe estar codificado como parte del email).

### Seguridad / headers

14. En Vercel preview, abrir DevTools → Network → recargar. Verificar que la respuesta HTML incluye:
    - `content-security-policy`
    - `strict-transport-security`
    - `x-content-type-options: nosniff`
    - `x-frame-options: deny` (o similar)
15. En consola no deben aparecer errores de CSP como `Refused to execute inline script`.

### About / enlaces externos

16. En `/about`, hacer clic en enlaces a LinkedIn/GitHub/Steemit. Verificar que abren en pestaña nueva con `noopener`.

### Regresión visual

17. Comparar visualmente home, about y blog contra la versión anterior (o screenshots previos). No deben romperse layouts ni faltar íconos de FontAwesome.

## Estrategia de commits

Crear feature branch desde `master`:

```bash
git checkout -b feat/security-vite-migration
```

Commits sugeridos (uno por tarea cerrada):

1. `build: migrate from Vue CLI 5 to Vite`
2. `config: unify API base URL and migrate env vars to VITE_*`
3. `fix(security): sanitize HTML inputs and replace v-html title sink`
4. `fix(security): validate external URLs and harden window.open`
5. `fix(security): add security headers and CSP to vercel.json`
6. `ci: harden GitHub Actions and Dockerfiles`
7. `fix(security): encode mailto parameters and document auth flags`
8. `chore: remove backup composable and update gitignore`
9. `chore(deps): remove Vue CLI toolchain and run audit`
10. `test: add regression tests for html-utils and url-utils`
11. `docs: update SECURITY-REVIEW with remediation status`

## Riesgos y mitigaciones

| Riesgo                                      | Mitigación                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Tests de Vue CLI dejan de funcionar en Vite | Migrar config de Jest o evaluar Vitest; validar en T1 antes de seguir.  |
| CSP rompe scripts inline de build           | Probar en preview; ajustar `script-src` a hashes/nonce si es necesario. |
| Imágenes de TechCrunch bloqueadas por CSP   | Incluir `img-src` con el dominio correcto.                              |
| Docker con nginx cambia el puerto/comando   | Actualizar `docker-compose.yml` y README.                               |

## Notas

- Mantener los nombres de archivo y componentes existentes salvo que la migración lo exija.
- No agregar nuevas dependencias de runtime si stdlib/Vite ya lo resuelve.
- Cualquier decisión que modifique el alcance se registra en este archivo y en Engram.
