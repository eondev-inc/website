# Revisión de Seguridad — OWASP Top 10 (2021)

> Documento vivo. Cada hallazgo tiene un check de estado. Marcar solo cuando el
> fix esté aplicado **y** el criterio de aceptación verificado.

| Campo            | Valor                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Proyecto         | Portfolio Web — Vue 3 + TypeScript + Tailwind CSS                                                                  |
| Revisión inicial | 2026-09-25                                                                                                         |
| Revisado en      | `master` @ `5b452c4` (2026-08-19)                                                                                  |
| Alcance          | SPA frontend, build/deploy, CI, dependencias. Sin backend propio.                                                  |
| Método           | Revisión estática de fuentes, config de build/deploy, workflows y auditoría de dependencias. Sin testing dinámico. |
| Autor            | el Gentleman (revisión asistida)                                                                                   |

## Superficie de ataque

No hay backend, ni autenticación, ni base de datos, ni sesiones. El único flujo de
datos no confiable es el contenido de **WP REST de un tercero**
(`https://techcrunch.com/wp-json/wp/v2`) que se renderiza en el cliente y se
cachea en `localStorage`. Por eso **A03 (Injection) es el único riesgo con
impacto demostrable** y el resto del reporte es endurecimiento.

---

## Resumen ejecutivo

| OWASP                         | Estado           | Hallazgos                                                 |
| ----------------------------- | ---------------- | --------------------------------------------------------- |
| A01 Broken Access Control     | N/A              | Sin recursos protegidos; ver F7                           |
| A02 Cryptographic Failures    | OK               | Todo HTTPS, sin secretos ni cripto propia                 |
| A03 Injection                 | **Riesgo real**  | F1, F2, F3, F8, F9                                        |
| A04 Insecure Design           | Bajo             | F7                                                        |
| A05 Security Misconfiguration | Medio            | F4, F5                                                    |
| A06 Vulnerable Components     | Medio (solo dev) | F6                                                        |
| A07 Identification & Auth     | Bajo             | F7                                                        |
| A08 Software & Data Integrity | Medio            | F5, F10                                                   |
| A09 Logging & Monitoring      | Informativo      | Sin telemetría de seguridad (aceptable en sitio estático) |
| A10 SSRF                      | N/A              | Sin código server-side                                    |

**Dependencias**: producción **0 vulnerabilidades**. Toolchain de desarrollo:
19 advisories (6 high, 11 moderate, 2 low). Ver F6.

---

## Hallazgos

### F1 — XSS vía `v-html` con HTML de terceros sin sanear

- [ ] Corregido
- **Severidad**: Alta · **Categoría**: A03 Injection
- **Evidencia**: `src/components/base/OurBlog.vue:225`

```html
<h3 class="..." v-html="blog.title.rendered"></h3>
```

- **Cadena del riesgo**:
  1. Origen no confiable — `src/composables/use-blogs.composable.ts:3` apunta a `https://techcrunch.com/wp-json/wp/v2/posts`.
  2. Sin validación de esquema — `src/composables/blog/use-blog-core.composable.ts:58` hace `data.map((post: BlogPost) => ...)`; es un _cast_ de TypeScript, no una validación en runtime. Lo que devuelva la API se acepta como `BlogPost`.
  3. Persistencia — `src/composables/utils/cache-utils.ts:45` guarda la respuesta en `localStorage` por 30 minutos. Un payload malicioso **sobrevive a las recargas**.
- **Impacto**: ejecución de JavaScript arbitrario en el navegador del visitante. Si el upstream se ve comprometido, o si un día la URL de la API se vuelve configurable (`VITE_API_BLOG_URL`, ver nota en F11), el vector es directo.
- **Fix propuesto**: para un **título** no hace falta HTML. Eliminar el sink:

```html
<!-- OurBlog.vue:225 -->
<h3 class="...">{{ cleanHtml(blog.title.rendered) }}</h3>
```

Si en algún caso se necesita HTML enriquecido, usar un helper saneado:

```ts
// src/composables/utils/html-utils.ts
import DOMPurify from "dompurify";

export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
```

`dompurify@3.4.14` **ya es dependencia** y hoy solo se usa en
`src/router/index.ts:108`; no hay que agregar nada al `package.json`.

- **Criterio de aceptación**: no queda ningún `v-html` alimentado por la respuesta de la API. Test unitario en `tests/unit/components/base/OurBlog.spec.ts` que renderiza un post con `title.rendered = '<img src=x onerror="window.__xss=1">'` y afirma que `window.__xss` sigue `undefined` y que el DOM no contiene `<img>`.

### F2 — Bypass del saneado en `cleanHtml` (strip-then-decode)

- [ ] Corregido
- **Severidad**: Alta · **Categoría**: A03 Injection
- **Evidencia**: `src/composables/utils/html-utils.ts:22`

```ts
export const cleanHtml = (html: string): string => {
  const cleaned = html.replace(/<[^>]*>/g, ""); // 1) quita tags
  return decodeHtmlEntities(cleaned).trim(); // 2) decodifica DESPUÉS
};
```

- **Impacto**: los pasos están **invertidos**, y eso convierte al sanitizador en un bypass. Con `title/excerpt.rendered = '&lt;img src=x onerror=alert(1)&gt;'`:

  - el regex no matchea (no hay `<` literal),
  - `decode()` produce `<img src=x onerror=alert(1)>` **real**,
  - ese string se inyecta en `v-html` (`OurBlog.vue:234`).

  El resultado es el opuesto de lo que la función promete.

- **Fix propuesto**: eliminar el regex (nunca es saneado válido) y delegar en DOMPurify:

```ts
import DOMPurify from "dompurify";

/** Texto plano seguro desde HTML (títulos, labels, aria-label). */
export const cleanHtml = (html: string): string =>
  DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();

/** HTML enriquecido permitido (excerpts). */
export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "a"],
    ALLOWED_ATTR: ["href"],
  });
```

`decodeHtmlEntities` puede mantenerse como utilidad independiente, pero **nunca**
después de sanitizar.

- **Criterio de aceptación**: test de regresión en `tests/unit/composables/utils/html-utils.spec.ts` con el payload entero-encoded (arriba) que afirme que la salida **no** contiene `<img`, `onerror` ni ningún `<`. Incluir también el caso `<script>alert(1)</script>` y `<img src=x onerror=1>` directo.

### F3 — `:href` sin validar esquema

- [ ] Corregido
- **Severidad**: Media · **Categoría**: A03 Injection
- **Evidencia**: `src/components/base/OurBlog.vue:280` → `:href="blog.link"`

- **Impacto**: `blog.link` viene de la API sin validar. Un valor `"javascript:alert(1)"` se ejecuta al hacer clic. El `target="_blank" rel="noopener noreferrer"` que ya está presente (correcto) **no** protege de esto.
- **Fix propuesto**: validar el protocolo antes de renderizar el enlace.

```ts
const safeLink = (raw: string): string => {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : "#";
  } catch {
    return "#";
  }
};
```

- **Criterio de aceptación**: test que pasa `link: 'javascript:alert(1)'` y afirma que el `href` renderizado es `#` (o que el `<a>` no se renderiza).

### F4 — Cero headers de seguridad

- [ ] Corregido
- **Severidad**: Media · **Categoría**: A05 Security Misconfiguration
- **Evidencia**: `vercel.json` solo define `rewrites`. No existe definición alguna de CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` ni `Permissions-Policy` en todo el repositorio (verificado con grep sobre `*.json`, `*.yml`, `*.html`, `*.js`, `*.conf`).

- **Impacto**: sin CSP, un fallo de saneado (F1/F2) se convierte directamente en ejecución de código. La CSP es la **defensa en profundidad** que corta el impacto aunque el saneado falle.
- **Fix propuesto**: agregar a `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data: https://*.techcrunch.com; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://techcrunch.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        { "key": "X-Frame-Options", "value": "DENY" },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

**Verificar antes de desplegar**: `style-src 'unsafe-inline'` es necesario por los
estilos inline de Tailwind/flowbite. Si el build final no inyecta scripts inline,
`script-src 'self'` alcanza; si inyecta, hay que usar hash o nonce en lugar de
habilitar `'unsafe-inline'`. Probar en preview de Vercel con la consola abierta.

- **Criterio de aceptación**: `curl -sI https://<deploy>/ | grep -i "content-security-policy"` devuelve el header, y la consola del navegador no reporta violaciones de CSP en home, blog y about.

### F5 — Integridad de la cadena de build

- [ ] Corregido
- **Severidad**: Media · **Categoría**: A08 Software and Data Integrity Failures / A05
- **Evidencia**:

| Archivo                    | Problema                                                                   |
| -------------------------- | -------------------------------------------------------------------------- |
| `.github/workflows/ci.yml` | `actions/checkout@v3`, `actions/setup-node@v3` — tags **mutables**, no SHA |
| `.github/workflows/ci.yml` | `actions/upload-artifact@v3` — deprecado/deshabilitado por GitHub          |
| `.github/workflows/ci.yml` | `node-version: '18'` — Node 18 EOL (abril 2025)                            |
| `Dockerfile`               | `RUN yarn install` sin `--frozen-lockfile` → resolución no reproducible    |
| `Dockerfile`               | `yarn global add http-server` sin versión fija                             |
| `Dockerfile`               | El stage final no declara `USER` → corre como **root**                     |
| `Dockerfile`               | `node:lts-alpine` flotante                                                 |
| `.github/dependabot.yml`   | Cubre `npm` pero **no** `github-actions`                                   |

- **Lo que ya está bien**: `yarn.lock` v1 con 1346 hashes `integrity sha512`, y `--frozen-lockfile` **sí** está en los tres jobs de CI.
- **Fix propuesto**:
  1. Pinear las acciones por SHA de commit (`actions/checkout@<sha> # v4`), con Dependabot actualizando.
  2. `upload-artifact@v4`.
  3. Node 20 o 22 en CI (alineado con `engines` si se agrega).
  4. `RUN yarn install --frozen-lockfile` en ambos Dockerfiles.
  5. `yarn global add http-server@<version>` o, mejor, servir con `nginx:alpine` (menos superficie).
  6. `USER node` + `chown` del directorio en el stage final.
  7. Agregar `package-ecosystem: "github-actions"` a `dependabot.yml`.
- **Criterio de aceptación**: `docker build .` dos veces sobre el mismo lock produce el mismo `node_modules`; `docker run --rm <img> id` no devuelve `uid=0`; en el workflow no queda ninguna acción referenciada por tag.

### F6 — Dependencias vulnerables (solo toolchain de desarrollo)

- [ ] Revisado / decisión registrada
- **Severidad**: Media · **Categoría**: A06 Vulnerable and Outdated Components
- **Evidencia** (auditoría sobre árbol resuelto desde `package.json`, 2026-09-25):

```
producción  → 0 (low 0, moderate 0, high 0, critical 0)
total       → 19 (low 2, moderate 11, high 6, critical 0)   ← todas devDependencies
```

Concentradas en `@vue/cli-service@5` y su cadena:

| Paquete                                                                                                                | Severidad | Advisory                                                                          |
| ---------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------- |
| `serialize-javascript`                                                                                                 | high      | RCE vía `RegExp.flags` / `Date.prototype.toISOString` (GHSA-5c6j-r48x-rmvq)       |
| `postcss`                                                                                                              | high      | XSS sin escapar `</style>` + lectura arbitraria de archivos (GHSA-qx2v-qp2m-jg93) |
| `cross-spawn`                                                                                                          | high      | ReDoS (GHSA-3xgq-45jj-v275)                                                       |
| `execa` / `yorkie`                                                                                                     | high      | vía `cross-spawn`                                                                 |
| `webpack-dev-server`                                                                                                   | moderate  | Robo de código fuente (GHSA-9jgg-88mc-972h)                                       |
| `uuid`, `sockjs`, `copy-webpack-plugin`, `css-minimizer-webpack-plugin`, `vue-loader`, `@vue/component-compiler-utils` | moderate  | varios                                                                            |
| `vue` (2.7.16)                                                                                                         | low       | ReDoS en `parseHTML` (GHSA-5j4c-8p2g-v4jx)                                        |

- **Aclaraciones importantes**:
  - El patrón de "fix disponible" que reporta `npm audit` (`@vue/cli-plugin-eslint@3.12.1`) es un **falso positivo de resolución**: ninguna versión de Vue CLI 5.0.x elimina estos advisories. La salida real es migrar de Webpack/Vue CLI a **Vite**, no un `upgrade` puntual.
  - El advisory de `vue` afecta **solo a 2.x**. El runtime es `vue@3.5.21`; el 2.7.16 del árbol lo arrastra el peer Vue 2 de `vue-select@3.20.4`.
  - **Riesgo real**: CI y `Dockerfile.dev` (webpack-dev-server expuesto como `8080:8080` contra el host). **No** afecta el bundle de producción.
- **Fix propuesto**: registrar esto como deuda técnica planificada. Corto plazo: no exponer `8080` fuera de localhost en `docker-compose.yml` (`127.0.0.1:8080:8080`). Mediano plazo: migración a Vite.
- **Criterio de aceptación**: `npm audit --omit=dev` sigue en 0 y existe un issue/tarea que rastrea la migración a Vite con fecha objetivo.

### F7 — `requiresAuth` decorativo

- [ ] Corregido o documentado
- **Severidad**: Baja · **Categoría**: A04 Insecure Design / A07 Identification and Authentication Failures
- **Evidencia**: `src/router/index.ts` — todas las rutas declaran `requiresAuth: false` y el guard `beforeEach` solo actualiza `document.title` y la meta description; **nunca evalúa autorización**.

- **Impacto**: hoy no hay nada que proteger, así que no es una vulnerabilidad activa. El riesgo es de diseño: si en el futuro se "protege" una ruta con ese flag, el control quedaría en el cliente y sería trivialmente evadible. Un control de acceso en el frontend no es un control de acceso.
- **Fix propuesto**: eliminar los `requiresAuth` (ruido, falsa sensación de seguridad) o, si se mantienen, dejar explícito en un comentario que cualquier autorización real debe resolverse en el servidor y que el flag solo puede usarse para ocultar UI.
- **Criterio de aceptación**: existe un comentario en `router/index.ts` que lo declara, o los flags no están.

### F8 — Inyección de parámetros en `mailto`

- [ ] Corregido
- **Severidad**: Baja · **Categoría**: A03 Injection
- **Evidencia**: `src/components/base/CallToAction.vue:323`

```ts
const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}&cc=${values.email}`;
```

`subject` y `body` van con `encodeURIComponent`; **`values.email` no**.

- **Impacto**: un valor como `x@y.com&bcc=atacante@evil.com` agrega destinatarios ocultos al cliente de correo. Auto-infligido (el atacante es quien escribe el formulario), de ahí la severidad baja; es el mismo patrón de falta de encoding.
- **Fix propuesto**: `&cc=${encodeURIComponent(values.email)}`, y validar con yup que el campo sea un email válido antes de construir la URL (el schema ya existe, extenderlo).
- **Criterio de aceptación**: test que llama a `onSubmit({ email: 'x@y.com&bcc=evil@x.com', ... })` y afirma que el `mailto:` resultante contiene `%26bcc%3D` y ningún `&bcc=` literal.

### F9 — Reverse tabnabbing en `window.open`

- [ ] Corregido
- **Severidad**: Baja · **Categoría**: A03 Injection
- **Evidencia**: `src/views/AboutView.vue:259` → `window.open(url, '_blank')`

- **Impacto**: la ventana abierta conserva `window.opener` y puede redirigir la pestaña original. Aquí las URLs son estáticas (`about.url` sale de `use-about.composable.ts`), así que el riesgo es bajo; se corrige por consistencia — el resto del código sí usa `rel="noopener noreferrer"`.
- **Fix propuesto**: `window.open(url, '_blank', 'noopener,noreferrer')`.
- **Criterio de aceptación**: grep sin resultados para `window.open(` que no incluya `noopener`.

### F10 — Archivo backup versionado

- [ ] Corregido
- **Severidad**: Baja · **Categoría**: A08 (higiene de artefactos)
- **Evidencia**: `src/composables/use-blog-enhanced.composable.ts.backup` — 775 líneas / 21 KB, **trackeado en git** (confirmado con `git ls-files`).

- **Impacto**: no entra al bundle (nadie lo importa), por lo que no es explotable. Es un problema de mantenimiento: duplica la lógica de cache y favoritos, queda fuera de tests y de lint, y puede quedar desactualizado o ser importado por error. Contradice el `.gitignore`, que sí excluye `*-output.*` y `AGENTS.*`.
- **Fix propuesto**: `git rm` del archivo. La historia ya está en git si hace falta recuperarlo.
- **Criterio de aceptación**: `git ls-files | grep -i backup` no devuelve nada.

### F11 — Nota de configuración: `VITE_*` no existe en Vue CLI

- [ ] Decidido
- **Severidad**: Informativa · **Categoría**: A05
- **Evidencia**: `src/composables/use-blogs.composable.ts:3`

```ts
const baseUrl =
  process.env.VITE_API_BLOG_URL || "https://techcrunch.com/wp-json/wp/v2/posts";
```

- **Detalle**: Vue CLI (Webpack) solo expone al cliente las variables con prefijo **`VUE_APP_`**. `VITE_API_BLOG_URL` **nunca** se inyecta (ese prefijo es de Vite). La expresión siempre cae al fallback hardcodeado. Además, `.env.example` documenta `VUE_APP_API_BASE_URL`, que el código no lee: hay drift entre config y código. Y `use-blog-categories.composable.ts:136` hardcodea la misma URL, ignorando el env por completo.
- **Por qué importa en seguridad**: hoy el destino es fijo, así que no hay riesgo. Pero si alguien "arregla" esto y el valor llegara alguna vez por query param o localStorage, se convierte en un redirect/SSRF client-side. Vale la pena dejarlo consistente:
  1. Elegir `VUE_APP_API_BASE_URL` (Webpack) como único nombre, o migrar a Vite y usar `VITE_*` de forma consistente.
  2. Leer siempre de una única fuente (`src/config/api.ts`), nunca de env + hardcode mezclados.
  3. Validar el valor contra una allowlist de orígenes al iniciar.
- **Criterio de aceptación**: existe un único lugar que resuelve la base URL de la API, sin fallbacks duplicados, y `.env.example` coincide con el prefijo real del bundler.

---

## Checklist de remediación por prioridad

### P1 — Mismo PR (riesgo real)

- [ ] F1: eliminar `v-html` del título; `sanitizeHtml` para excerpt
- [ ] F2: corregir `cleanHtml` (DOMPurify, sin regex)
- [ ] Tests de regresión de XSS en `html-utils.spec.ts` y `OurBlog.spec.ts`
- [ ] F4: headers de seguridad en `vercel.json` + verificación en preview

### P2 — Endurecimiento barato, diffs chicos

- [ ] F3: validar esquema en `blog.link`
- [ ] F5: acciones por SHA, `upload-artifact@v4`, Node 20/22, `--frozen-lockfile`, `USER node`, Dependabot para `github-actions`
- [ ] F8: `encodeURIComponent` en `cc=` + validación de email
- [ ] F9: `noopener,noreferrer` en `window.open`

### P3 — Deuda técnica, sin exposición actual

- [ ] F6: cerrar `8080` a localhost; abrir tarea de migración a Vite
- [ ] F7: eliminar o documentar `requiresAuth`
- [ ] F10: `git rm` del `.backup`
- [ ] F11: unificar la resolución de la base URL de la API

### Complementario

- [ ] Agregar SCA/SAST al CI (`osv-scanner` o `trivy`, `gitleaks`, `semgrep`). Hoy no hay ninguno instalado.
- [ ] Revisar rama protegida y secret scanning del lado de GitHub (fuera del alcance de esta revisión).

---

## Áreas verificadas sin hallazgos

No son supuestos: se verificaron y salieron limpias.

- **A02 Criptografía**: sin secretos en el repositorio ni en el historial (`git log` sobre `.env`/`.env.local`, grep de `api_key|secret|token|password|private_key`). `.env` está en `.gitignore`, `.env.example` solo contiene valores públicos. Todo el tráfico es HTTPS. No hay criptografía propia.
- **A03 injection clásica**: cero `eval`, `new Function`, `document.write` y `setTimeout` con string.
- **A10 SSRF**: no hay código server-side; el único destino de red es una URL fija.
- **Almacenamiento local**: `localStorage` guarda preferencia de idioma, favoritos y cache de API. Sin tokens, sin PII, sin credenciales. Aceptable para este proyecto.
- **Validación de locale**: `src/components/layouts/LanguageSelector.vue:84` valida contra allowlist `['en', 'es']` antes de usar el valor. Correcto.
- **Enlaces externos**: todos los `target="_blank"` del template usan `rel="noopener noreferrer"` (excepto el `window.open` de F9).
- **Integridad del lockfile**: `yarn.lock` v1 con hashes `integrity sha512`.
- **Dependencias de producción**: 0 advisories.

---

## Cómo re-verificar

```bash
# Dependencias (yarn no está instalado en este entorno; se resuelve en /tmp)
mkdir -p /tmp/secaudit && cd /tmp/secaudit
cp /home/seventrust/Projects/website/package.json .
npm install --package-lock-only --ignore-scripts --legacy-peer-deps
npm audit --omit=dev          # producción — debe seguir en 0
npm audit                     # total, esperado: 19 (solo devDependencies)

# Sinks de XSS
cd /home/seventrust/Projects/website
grep -rnE "v-html|innerHTML|document\.write" src/
grep -rnE "cleanHtml|sanitizeHtml" src/

# Secretos
git grep -nEi "(api[_-]?key|secret|token|password|private[_-]?key)\s*[:=]\s*['\"][A-Za-z0-9/_+-]{12,}" -- .
git log --all --diff-filter=A -- .env .env.local

# Headers (tras desplegar)
curl -sI https://<deploy>/ | grep -iE "content-security-policy|strict-transport|x-content-type|referrer-policy|x-frame"

# Widgets de la cadena de build
grep -n "uses:" .github/workflows/ci.yml
grep -nE "yarn install|USER |http-server" Dockerfile
```

Notas del entorno: la auditoría se hizo con `npm` sobre un árbol resuelto desde
los rangos de `package.json` (yarn 1 no está instalado aquí). Los números exactos
pueden diferir 1–2 patches respecto del `yarn.lock` real.

---

## Fuera de alcance / límites

1. **Sin testing dinámico**: no se probaron payloads reales contra el sitio desplegado, ni se hizo pentest.
2. **Sin revisión de infraestructura**: configuración de GitHub (branch protection, secret scanning, permisos de Actions) y de Vercel/CDN quedan pendientes.
3. **Sin análisis de composición del bundle final** (`dist/`): no se verificó si dependencias de desarrollo terminan incluidas.
4. **Estado del árbol de trabajo** al momento de la revisión: `.gitignore` modificado, y `.codegraph/` y `.pi/` sin trackear (estado local de herramientas, sin impacto de seguridad).
5. La revisión cubre el Top 10 de OWASP 2021. No incluye ASVS completo, ni privacidad, ni cumplimiento normativo.

## Bitácora

| Fecha      | Cambio                                                               |
| ---------- | -------------------------------------------------------------------- |
| 2026-09-25 | Revisión inicial sobre `5b452c4`. Hallazgos F1–F11, 0 en producción. |
