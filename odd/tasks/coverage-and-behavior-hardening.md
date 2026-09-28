# Feature: coverage-and-behavior-hardening

**Rama**: `fix/coverage-and-behavior-hardening` (desde `master` @ `d94395a`)
**Origen**: verificación de cobertura solicitada tras el merge de seguridad/OWASP (`d94395a`)
**Fecha**: 2026-09-25

## Contexto

La suite no está "vacía": 29 suites / 174 tests en verde, 93.45% stmts / 79.37% branch.
El problema real es que ese porcentaje se mide contra un denominador reducido
(`collectCoverageFrom` = solo `src/composables/**` + `src/components/**`) y que dos
defectos reales viven justo debajo de la línea que el número no ve.

## Tareas

### T1 — `date-utils`: matar el `catch` muerto y dejar el contrato real

- **Problema**: `new Date('x').toLocaleDateString()` devuelve el string `"Invalid Date"`,
  no lanza. El `catch { return 'Fecha inválida' }` de `formatDate` y `formatDateShort`
  es inalcanzable, y el fallback nunca dispara.
- **Impacto visible**: `OurBlog.vue:223,317` renderiza `formatDate(blog.date)`. Con una
  fecha malformada de la API WP el usuario lee `"Invalid Date"` (inglés) dentro de una UI
  en español.
- **Peor detalle**: el spec actual (`date-utils.spec.ts`) acepta _ambos_ comportamientos
  (`result === 'Fecha inválida' || result === 'Invalid Date'`), así que es un test que
  no puede fallar y blinda el bug.
- **Fix**: guard `Number.isNaN(date.getTime())` → `'Fecha inválida'`. Endurecer el assert
  a un valor exacto.
- **Estado**: COMPLETADA — `date-utils.ts` 80→100 stmts, 75→100 lines. Guard aplicado en
  ambas funciones. Spec endurecido a valor exacto + caso `formatDateShort('')`.
  **Mutación verificada**: revirtiendo el guard, 4 tests fallan. El test tiene dientes.

### T2 — `AboutView.toOutside`: cerrar el `window.open` sin validar

- **Problema**: el commit `cfc04e7` creó `isAllowedExternalUrl` / `safeExternalUrl` en
  `url-utils.ts` (hoy 100% cubierto), pero `AboutView.vue:384` sigue llamando
  `window.open(url, '_blank', 'noopener,noreferrer')` sin validar.
- **Riesgo actual**: BAJO — los URLs están hardcodeados en `use-about.composable.ts`.
  Es defensa en profundidad inconsistente, no una vulnerabilidad activa.
- **Por qué importa**: la función acepta cualquier string y `AboutView` tiene 0 tests,
  así que nada vigila que mañana entre un dato no confiable.
- **Fix**: pasar por `safeExternalUrl` + test de regresión.
- **Estado**: COMPLETADA — `toOutside` movido a export de módulo y envuelto con
  `safeExternalUrl` + constante `ALLOWED_ORIGINS` (8 orígenes, cubre los 6 hosts de
  `use-about.composable.ts` + techcrunch + linkedin). Sigue en el `return` de `setup()`,
  el template no se rompe. `tests/unit/views/AboutView.spec.ts` nuevo, importa la función
  real (no un mock). **Mutación verificada**: evitando `safeExternalUrl`, 3 tests fallan.
  **Corrección post-review (R3-003)**: el test original solo probaba ausencia (el string
  del atacante no fue reenviado). Eso pasa igual si `safeExternalUrl` lanza y
  `window.open` nunca se llama — no distingue "guard funciona" de "guard no hace nada".
  Reescrito para afirmar el reemplazo exacto (`'#'`) y `toHaveBeenCalledTimes(1)`, más
  un `it.each` con los 8 links reales del portfolio para que el guard no los rompa en
  silencio. **Mutación verificada**: no-op silencioso → 12/12 tests fallan (antes pasaban).

### T3 — `accessibility-utils`: cubrir ramas reales de a11y

- **Problema**: 62.5% branch, el peor del repo. Existe spec pero parcial.
- **Gaps exactos**:
  - `handleArrowNavigation`: faltan `ArrowDown`, `ArrowUp`, `ArrowLeft`, el
    wrap-around de `ArrowUp` en índice 0, y el `default: return` (línea 183).
  - `skipToMain`: solo se ejercita la rama `<main>`. Faltan la prioridad de
    `#main-content`, el fallback `[role="main"]`, el no-op cuando no hay main,
    y la limpieza del `tabindex` en `blur`.
- **Estado**: COMPLETADA — 11 tests nuevos. `accessibility-utils.ts` branch 62.5→92.5,
  stmts 89.47→98.94, funcs 94.11→100.

### T4 — `jest.config.js`: honestidad del denominador

- **Problema**: `src/config/api.ts` (allowlist de seguridad OWASP) y `src/router/index.ts`
  **están testeados pero no se cuentan**. El 93% reportado omite código que sí importa.
- **Riesgo aceptado y resuelto**: al agregar `src/router/**` las funciones **cayeron** de
  93.38 a 90.78 contra un umbral de 90 — margen de 0.78pp, frágil. **No se bajó el
  umbral**: se subió la cobertura. Causa: los 5 lazy loaders `() => import(...)` nunca se
  invocaban (`router.resolve()` no los llama; el `push` sí). Cubiertos → router funcs
  50→100.
- **Hallazgo colateral**: `tests/unit/router.meta-sanitize.spec.ts` testea una **copia** del
  guard de producción, no el guard real. Mismo antipatrón que T1. Agregado un bloque en
  `router.spec.ts` que ejerce el guard real via `addRoute`/`removeRoute`.
- **Fuera de alcance por decisión previa del usuario**: `src/views/**`, `src/main.ts`,
  `src/locales/**` siguen excluidos. `AboutView.vue` confirmado ausente del denominador.
- **Estado**: COMPLETADA — denominador ampliado. `api.ts` 100/100/100/100,
  `router/index.ts` 96.29/81.25/100/96.29.

## Resultado final

| Métrica        | Antes    | Después  |
| -------------- | -------- | -------- |
| Statements     | 93.45    | 95.38    |
| Branches       | 79.37    | 87.16    |
| Functions      | 93.38    | 94.77    |
| Lines          | 93.58    | 95.42    |
| Suites / tests | 29 / 174 | 30 / 206 |

Verificaciones: suite completa verde · lint en baseline (26, cero agregados) ·
`vite build` OK · 4 pruebas de mutación ejecutadas.

## Review nativo — 3 transacciones, ninguna aprobó

| Linaje                    | Resultado                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `review-572af8059562ee53` | stop terminal `native_stop_required` (`insufficient_evidence`); el refuter no emitió veredicto |
| `review-25e2da5270082495` | `correction_required` — R3-001 BLOCKER determinista; corrección aplicada en T2                 |
| `review-c97fac1f72610c0b` | `consent-declined-this-candidate`; sin linaje creado                                           |

El trabajo quedó verificado por tooling propio (suite, build, lint, mutaciones), no
por el reviewer: la corrección de R3-001 nunca pasó por una segunda ronda.

| Hallazgo          | Veredicto                                                                                                                                                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R3-001 (1ª ronda) | refutado — el guard de `AboutView` sí funciona                                                                                                                                                                                                                                                                                                  |
| R3-002 (1ª ronda) | refutado — el bloqueo de `javascript:` sí funciona                                                                                                                                                                                                                                                                                              |
| R3-003            | **BLOCKER legítimo** — aceptado y corregido (ver T2)                                                                                                                                                                                                                                                                                            |
| R3-004            | texto **no recuperable**; solo el ID consta en la escalación                                                                                                                                                                                                                                                                                    |
| R3-001 (2ª ronda) | **BLOCKER determinista**, `causal_disposition: introduced`. Exportar `toOutside` como named export de un SFC no es un contrato estable: el spec lo importaba con `@ts-expect-error` y se rompería en silencio ante cualquier cambio de vue-loader o de TypeScript. Corregido en T2 sacando el guard a `src/composables/utils/outbound-links.ts` |

R3-004 no fue un hallazgo de esta sesión que se pudiera leer: su texto no está
persistido en ningún artifact legible, solo digests. No se adivina.

### Falso positivo verificado

`ast-grep:no-open-redirect` marcó la línea de `window.open` en `outbound-links.ts`.
Es un **falso positivo**: la regla es de firma y no ve la validación que ocurre un
nivel abajo. Bloquea los 8 payloads probados, incluido el bypass de allowlist por
sufijo (`https://www.linkedin.com.evil.com/`), `//evil.com`, `data:` y `HtTpS://evil.com`.
La prueba concluyente: la regla **no** marca
`src/composables/blog/use-blog-features.composable.ts:62`, que llama `window.open`
con un `mailto:` interpolado y **sin** validación alguna. Señala la línea segura y
deja pasar la desprotegida. No se agregó una segunda capa de validación: duplicaría
lógica sin sumar protección.

## Evidencia de commits

Entregado en tres PRs encadenados, cada uno bajo el presupuesto de 400 líneas.

| Tarea                                        | Commit    | PR  |
| -------------------------------------------- | --------- | --- |
| T1 — `date-utils`                            | `e666a41` | 1   |
| T2 — `AboutView` outbound links              | `cf3bb05` | 1   |
| Ancla `rel="noopener noreferrer"` (JD-A-001) | `a45c4ce` | 1   |
| T3 — cobertura de accesibilidad              | `c426deb` | 2   |
| T4 — denominador de cobertura                | `442e5b7` | 2   |
| Este registro ODD                            | —         | 3   |
