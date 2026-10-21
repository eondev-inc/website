# Feature: ux-flat-refactor

**Rama**: `refactor/ux-flat-5-loaders` — cadena de 8 commits sobre `master` @ `50ad1a2`
**Origen**: pedido del usuario de eliminar gradientes y efectos sobre gradientes del sitio, conservando la paleta corporativa y el tono profesional.
**Fecha**: 2026-09-30
**Estado**: COMPLETADA

## Contexto

El sitio usaba 113 ocurrencias de gradiente en 9 archivos. El degradado dominante era
`secondary-500 (#d946ef, magenta) → primary-400 (#14b8a6, turquesa)`: dos colores
complementarios compitiendo dentro del mismo elemento, aplicados a titulares, botones,
iconos, fondos de sección y barras decorativas.

Dos problemas medidos, no estéticos:

1. **Accesibilidad.** El texto degradado incumplía AA en uno de sus dos extremos.
   Contraste sobre blanco: `secondary-500` = 3.46:1, `primary-500` = 2.49:1,
   `primary-400` ≈ 2.4:1. AA exige 4.5:1 para texto normal. Los `.text-gradient*`
   cubrían 5 titulares del sitio.
2. **Jerarquía sustituida por ambiente.** 18 elementos `blur-2xl/3xl` animados y 15 usos
   de `backdrop-blur` hacían de fondo lo que debería hacer la estructura: retícula,
   tipografía, bordes y espaciado.

Además había colores fuera de paleta: `Experience.bgGradient` usaba green/blue/purple, y
`OurBlog`, `ErrorState` y `SkipLink` usaban azul `#3b82f6`.

## Decisiones de producto (confirmadas por el usuario)

1. **Magenta = acento puntual.** `secondary-600/700` solo en badges, subrayado del nav
   activo y un detalle por sección. Nunca en superficies grandes, nunca junto al turquesa
   en el mismo elemento.
2. **Blur fuera.** Se eliminaron los blobs difusos y todo `backdrop-blur`. El header pasó
   a ser sólido con `border-b`; la profundidad se expresa con capas de neutro (0/50/100).
3. **Entrega en 5 PRs encadenados**, una rama y un commit por unidad de trabajo.

## Reglas duras del sistema resultante

1. Un color por superficie. Prohibido `bg-gradient-*`, `linear-gradient`,
   `radial-gradient`, `conic-gradient`, `bg-clip-text text-transparent`.
2. ~92% de la pantalla en neutro. El turquesa solo donde hay acción o estado.
3. La estructura se dibuja con borde de 1px y una sola escala de sombra (`soft` →
   `medium` en hover). Eliminados `shadow-glow`, `shadow-glow-lg` y `shadow-2xl`.
4. Sin blur decorativo.
5. Contraste verificado: texto blanco sobre turquesa usa `primary-700` (5.47:1).
   `primary-600` (3.74:1) y `primary-500` (2.49:1) fallan AA para texto normal; solo son
   aceptables en iconos y texto ≥24px, donde la exigencia baja a 3:1.
6. Movimiento con propósito: transiciones de opacidad/posición 150–300 ms. Eliminados
   `animate-float`, `animate-pulse-soft`, `shimmer` y los barridos de brillo.

## Tareas

### T1 — Guard de regresión (RED primero)

- **Archivo**: `tests/unit/no-gradient-guard.spec.ts`
- **Qué**: escanea `src/**/*.{vue,css}` y `tailwind.config.js` y falla si aparece
  `gradient`, `bg-clip-text`, `backdrop-blur`, `blur-sm|md|lg|xl|2xl|3xl`, `shadow-glow`
  y, solo en plantillas `.vue`, el azul fuera de paleta `#3b82f6` / `rgba(59,130,246)`.
- **Por qué**: el proyecto no tenía tests que asertaran clases CSS, así que el invariante
  "diseño plano" no tenía ninguna protección: la suite podía quedar 100% verde con un
  degradado reintroducido en un titular.
- **RED observado**: 204 violaciones antes del primer cambio de estilo.
- **Estado**: COMPLETADA — commit `d605fe2`.
- **Extensión posterior**: el caso del azul en plantillas se añadió en `d9c7191` tras la
  verificación independiente, que detectó `#3b82f6` en `SkipLink.vue` escapando del guard
  original (el guard solo miraba clases, no hex sueltos).

### T2 — Tokens de sistema

- **Archivos**: `src/assets/style.css`, `tailwind.config.js`
- **Qué**: eliminados `backgroundImage.gradient-*`, `boxShadow.glow`/`glow-lg`, `.glass*`,
  `.card-glass`, `.text-gradient*`, `.bg-gradient-*`, `.divider*`, `.shimmer`, `.hover-glow`;
  botones reescritos como fills planos; añadidos `.accent-bar` y (luego retirado)
  `.surface-primary`; enlaces y foco de formularios a `primary-700`; paleta sin tocar.
- **Estado**: COMPLETADA — commit `29d16bd`. `style.css` perdió 102 líneas.
- **Nota**: `.hover-glow` (`@apply hover:shadow-glow`) tuvo que salir también, o el build
  rompía al eliminar `boxShadow.glow`.

### T3 — Shell (header, nav, footer)

- **Archivos**: `src/components/layouts/HeaderView.vue`, `FooterView.vue`
- **Qué**: header blanco sólido con `border-b neutral-200` y sin el `backdrop-filter`
  reimplementado a mano en el `<style scoped>`; footer `neutral-900` plano con
  `border-t neutral-800`; eliminados el wash magenta, los dos blobs y el CTA degradado.
- **Estado**: COMPLETADA — commit `d94d767`.
- **Efecto colateral controlado**: `HeaderView.spec.ts` distinguía los dos estados de
  scroll por opacidad de fondo (`bg-white/95` vs `bg-white/50`). Al ser ambos planos, el
  spec pasó a distinguirlos por borde y sombra.

### T4 — Hero y About

- **Archivos**: `src/components/base/AboutMe.vue`, `src/views/AboutView.vue`
- **Qué**: fondos a `neutral-50`, eliminados 8 blobs, el patrón `radial-gradient` y los
  marcos `-inset-*`; titulares `text-primary-700`; timeline con línea `neutral-200` y nodos
  `primary-600`; tarjetas blancas sólidas con una sola escala de sombra.
- **Estado**: COMPLETADA — commit `c299e74`. 90 líneas eliminadas, 25 añadidas.

### T5 — Bloques de contenido

- **Archivos**: `Experience.vue`, `OurBlog.vue`, `CallToAction.vue`, `ErrorState.vue`
- **Qué**: los tres iconos de `Experience` pasan a un único tono plano
  (`bgGradient` → `tone`), eliminando el uso de green/blue/purple fuera de paleta;
  `OurBlog` pierde el overlay degradado, el badge con blur, el anillo glow y el barrido de
  las categorías, y todo su azul pasa a `#0f766e`; `CallToAction` pierde su fondo de tres
  capas, los tres círculos flotantes y `backdrop-blur`, y sus tres overlays de foco
  degradados se sustituyen por un ring en el wrapper; `ErrorState` pierde el barrido blanco.
- **Estado**: COMPLETADA — commits `96faf21` y `da6e53a`.

### T6 — Loaders y purga

- **Archivos**: `SkeletonLoader.vue`, `tailwind.config.js`
- **Qué**: 31 utilidades `bg-gradient-*` por skeleton → una sola clase plana `.bg-animate`
  sobre `neutral-200` con el pulso ya existente. Eliminados `@keyframes shimmer`,
  `.bg-animate-slow`, el bloque `prefers-color-scheme: dark` (pintaba losas oscuras en una
  página clara para quien tiene el SO en modo oscuro) y del config las animaciones/keyframes
  sin uso (`float`, `pulse-soft`, `shimmer`, `bounce-soft`) y `backdropBlur`.
- **Hallazgo**: `.bg-animate` no era una clase muerta — estaba definida en el `<style scoped>`
  del propio componente como shimmer `#f1f5f9`/`#e2e8f0`, un gris azulado fuera de la paleta
  cálida. El spec que asertaba `.bg-animate` se mantiene válido: la clase existe, ahora pinta.
- **Estado**: COMPLETADA — commit `6cfb012`.

## Verificación

Gate independiente (`gentle-ai-verify`, read-only) sobre `master..HEAD`: veredicto inicial
**BLOCK** por 6 combinaciones de contraste bajo AA y un azul fuera de paleta. Remediation en
`d9c7191`, tras la cual:

| Check                                        | Resultado                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| Guard `tests/unit/no-gradient-guard.spec.ts` | PASS 2/2 (era 204 violaciones en RED)                                         |
| Barrido propio de gradientes/blur            | 0 hits en `src/**/*.{vue,css}`                                                |
| Integridad de paleta                         | los 10 grupos de color idénticos byte a byte en `tailwind.config.js`          |
| Suite completa                               | 32 suites / 210 tests PASS                                                    |
| Cobertura                                    | 95.38 stmts / 87.16 branch / 94.77 funcs / 95.42 lines (umbrales 90/78/90/90) |
| Build                                        | PASS, `dist/assets/index-*.css` 173 kB (gzip 20.9 kB)                         |
| Lint                                         | 0 errores, 25 warnings preexistentes (`label-has-for`, `no-explicit-any`)     |
| Contraste                                    | todo texto normal ≥4.5:1; iconos y texto ≥24px ≥3:1                           |

**Sobre el tamaño del diff**: `.husky/pre-commit` ejecuta `lint-staged` con `prettier --write`
sobre los `.vue`/`.css`/`.md` tocados, así que cada commit reformatea el archivo completo.
El diff de 748 inserciones / 757 eliminaciones incluye esa normalización, no solo la
reducción semántica (neto: −9 líneas).

## Lecciones

- `primary-700` (#0f766e) es el **único** turquesa válido para texto normal o fill con texto
  blanco. `primary-600` (3.74:1) se lee aceptable a ojo y falla AA: la tentación de usarlo es
  alta, por eso quedó prohibido en la tabla de reglas.
- Un guard basado en clases no atrapa un hex suelto. Se necesita el barrido de color además
  del de utilidades.
- El escape más caro fueron las clases que Tailwind ya no compila: tras T2, `bg-gradient-*` y
  `shadow-glow` no renderizaban **nada**, así que cada fase intermedia dejó la UI rota de
  forma silenciosa hasta que se migró cada componente. El orden correcto — tokens primero y
  componentes inmediatamente después — evita que ese estado viva en `master`.

## Follow-ups (no bloqueantes, fuera de alcance)

1. Clases de componente con 0 usos preexistentes en `style.css`: `.btn-secondary`,
   `.btn-accent`, `.btn-ghost`, `.card`, `.card-hover`, `.skeleton`, `.hover-lift`,
   `.scrollbar-thin`. Candidatas a purga; se dejaron para no inflar este diff.
2. `.surface-primary` se añadió como token y quedó con 0 usos: retirado en `d9c7191`.
3. `src/assets/img/first-post.svg` y `third-post.svg` son SVG con `linearGradient` que ninguna
   plantilla referencia. Fuera de la superficie de estilo y sin uso: borrar cuando se confirme.
4. `use-blog-categories.composable.ts` define colores de categoría fuera de paleta
   (`#8b5cf6`, `#a855f7`, `#10b981`, `#f59e0b`). Es dato, no estilo: decisión de producto.
5. 25 warnings de ESLint preexistentes (`label-has-for`, `no-explicit-any`) en componentes
   tocados por esta rama. No introducidos aquí.
