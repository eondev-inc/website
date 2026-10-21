# Feature: ux-flat-refactor

**Rama**: `refactor/ux-flat-0-guard` (desde `master` @ `50ad1a2`), encadenada hasta `refactor/ux-flat-5-loaders`
**Origen**: pedido del usuario de eliminar gradientes y efectos sobre gradientes del sitio, conservando la paleta corporativa y el tono profesional.
**Fecha**: 2026-09-30

## Contexto

El sitio usa 113 ocurrencias de gradiente en 9 archivos. El degradado dominante es
`secondary-500 (#d946ef, magenta) → primary-400 (#14b8a6, turquesa)`: dos colores
complementarios compitiendo dentro del mismo elemento, aplicados a titulares, botones,
iconos, fondos de sección y barras decorativas.

Dos problemas medidos, no estéticos:

1. **Accesibilidad.** El texto degradado incumple AA en uno de sus dos extremos.
   Contraste sobre blanco: `secondary-500` = 3.46:1, `primary-500` = 2.49:1,
   `primary-400` ≈ 2.4:1. AA exige 4.5:1 para texto normal. Los `.text-gradient*`
   cubren 5 titulares del sitio.
2. **Jerarquía sustituida por ambiente.** 18 elementos `blur-2xl/3xl` animados y 15 usos
   de `backdrop-blur` hacen de fondo lo que debería hacer la estructura: retícula,
   tipografía, bordes y espaciado.

Además hay colores fuera de paleta: `Experience.bgGradient` usa green/blue/purple, y
`OurBlog`, `ErrorState` y `SkipLink` usan azul `#3b82f6`.

## Decisiones de producto (confirmadas por el usuario)

1. **Magenta = acento puntual.** `secondary-600/700` solo en badges, subrayado del nav
   activo y un detalle por sección. Nunca en superficies grandes, nunca junto al turquesa
   en el mismo elemento.
2. **Blur fuera.** Se eliminan los blobs difusos y todo `backdrop-blur`. El header pasa a
   ser sólido con `border-b`; la profundidad se expresa con capas de neutro (0/50/100).
3. **Entrega en 5 PRs encadenados**, una rama y un commit por unidad de trabajo.

## Reglas duras del sistema resultante

1. Un color por superficie. Prohibido `bg-gradient-*`, `linear-gradient`,
   `radial-gradient`, `conic-gradient`, `bg-clip-text text-transparent`.
2. ~92% de la pantalla en neutro. El turquesa solo donde hay acción o estado.
3. La estructura se dibuja con borde de 1px y una sola escala de sombra (`soft` →
   `medium` en hover). Se eliminan `shadow-glow`, `shadow-glow-lg` y `shadow-2xl`.
4. Sin blur decorativo.
5. Contraste verificado: texto blanco sobre turquesa usa `primary-700` (5.47:1).
   `primary-600` (3.74:1) y `primary-500` (2.49:1) fallan AA.
6. Movimiento con propósito: transiciones de opacidad/posición 150–300 ms. Se eliminan
   `animate-float`, `animate-pulse-soft`, `shimmer` y los barridos de brillo.

## Tareas

### T1 — Guard de regresión (RED primero)

- **Archivo**: `tests/unit/no-gradient-guard.spec.ts`
- **Qué**: escanea `src/**/*.{vue,css}` y `tailwind.config.js` y falla si aparece
  `gradient`, `bg-clip-text`, `backdrop-blur`, `shadow-glow` o `blur-2xl/3xl`.
- **Por qué**: el proyecto no tiene tests que aserten clases CSS, así que el invariante
  "diseño plano" no tiene ninguna protección. La suite existente no puede fallar si
  alguien reintroduce un degradado.
- **Estado**: PENDIENTE

### T2 — Tokens de sistema

- **Archivos**: `src/assets/style.css`, `tailwind.config.js`
- **Qué**: eliminar `backgroundImage.gradient-radial/conic/mesh/hero/card`, `boxShadow.glow`
  y `glow-lg`; reescribir `.btn-primary/secondary/accent` planos con fills `*-700`;
  eliminar `.text-gradient*`, `.bg-gradient-*`, `.glass*`, `.shimmer`; `.divider` sólido;
  añadir `.surface-primary`; purgar `animate-float`, `pulse-soft`, `bounce-soft`, `shimmer`.
- **Estado**: PENDIENTE

### T3 — Shell (header, nav, footer)

- **Archivos**: `src/components/layouts/HeaderView.vue`, `MobileNav.vue`, `FooterView.vue`,
  `LanguageSelector.vue`
- **Qué**: header blanco sólido con `border-b neutral-200`; quitar `backdrop-blur-xl/sm`;
  footer `neutral-900` plano con `border-t neutral-800`; quitar wash magenta; CTA del
  footer plano en `primary-700`.
- **Estado**: PENDIENTE

### T4 — Hero y About

- **Archivos**: `src/components/base/AboutMe.vue`, `src/views/AboutView.vue`
- **Qué**: fondo neutro, eliminación de los 8 blobs difusos, titular plano
  (`neutral-900` + énfasis `primary-700`), timeline con línea sólida `neutral-200` y nodos
  `primary-600`, tarjetas blancas con borde.
- **Estado**: PENDIENTE

### T5 — Bloques de contenido

- **Archivos**: `src/components/base/Experience.vue`, `OurBlog.vue`, `CallToAction.vue`,
  `ErrorState.vue`
- **Qué**: iconos de `Experience` a `bg-primary-50/text-primary-700/border-primary-100`
  (elimina el bug de paleta ajena); `OurBlog` sin overlay degradado ni `#3b82f6`;
  `CallToAction` sobre `neutral-50` con borde y CTA plano; `ErrorState` sin barrido blanco.
- **Estado**: PENDIENTE

### T6 — Loaders y purga

- **Archivos**: `src/components/base/SkeletonLoader.vue`, resto de `src/`
- **Qué**: 35 shimmer → `animate-pulse bg-neutral-200`; purga de animaciones y utilidades
  sin uso; verificación de que no queda CSS muerto en `style.css`.
- **Estado**: PENDIENTE

## Verificación por fase

| Check     | Comando                                         | Criterio                                                     |
| --------- | ----------------------------------------------- | ------------------------------------------------------------ |
| Guard     | `npx jest tests/unit/no-gradient-guard.spec.ts` | RED en T1, GREEN desde T6                                    |
| Regresión | `npx jest`                                      | 29 suites / 174 tests verdes, umbrales de cobertura intactos |
| Build     | `npm run build`                                 | compila; un `@apply` con clases eliminadas rompe el build    |
| Lint      | `npm run lint`                                  | sin errores nuevos                                           |
| Contraste | manual                                          | ratios de la tabla de decisiones                             |
| Visual    | `npm run dev`                                   | `/`, `/about`, `/blog`, `/contact`, MobileNav abierto        |

## Evidencia de commits

(pendiente: se completa al cerrar cada tarea)
