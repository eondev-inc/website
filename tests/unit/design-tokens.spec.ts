import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Guard de los tokens que fallan en silencio.
 *
 * Ningún test podía detectar dos defectos reales que llegaron a producción:
 *  1. `style.css` importaba Google Fonts, pero la CSP de `vercel.json` solo
 *     permite `style-src`/`font-src` del propio origen: las fuentes nunca
 *     cargaban y el sitio se pintaba con la fuente del sistema.
 *  2. Los placeholders de los formularios usaban `gray-400` (2.3:1), fuera de
 *     paleta y por debajo del mínimo AA de 4.5:1.
 *
 * Reglas que este guard protege:
 *  1. La tipografía se sirve desde el bundle, nunca desde un CDN externo.
 *  2. Cada `@font-face` declarado tiene su `.woff2` en `src/assets/fonts`.
 *  3. El placeholder es `neutral-500` y cumple contraste sobre blanco.
 */
const REPO_ROOT = join(__dirname, '..', '..')
const STYLE_CSS = join(REPO_ROOT, 'src', 'assets', 'style.css')
const TAILWIND_CONFIG = join(REPO_ROOT, 'tailwind.config.js')
const css = readFileSync(STYLE_CSS, 'utf8')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return walk(full)
    return /\.(vue|css)$/.test(entry) ? [full] : []
  })
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

describe('tipografía autoalojada', () => {
  it('no importa hojas de fuentes externas (la CSP las bloquea)', () => {
    for (const file of walk(join(REPO_ROOT, 'src'))) {
      expect(readFileSync(file, 'utf8')).not.toMatch(
        /fonts\.(googleapis|gstatic)\.com/
      )
    }
  })

  it('cada @font-face declarado tiene su woff2 en src/assets/fonts', () => {
    const declared = [
      ...css.matchAll(/src:\s*url\("\.\/(fonts\/[^"]+\.woff2)"\)/g)
    ].map((match) => match[1])

    expect(declared.length).toBeGreaterThan(0)
    expect(declared).toEqual(
      expect.arrayContaining([
        'fonts/Inter-400-700.woff2',
        'fonts/Poppins-600.woff2',
        'fonts/Poppins-700.woff2'
      ])
    )
    for (const font of declared) {
      expect(existsSync(join(REPO_ROOT, 'src', 'assets', font))).toBe(true)
    }
  })
})

describe('contraste del placeholder', () => {
  it('neutral-500 sobre blanco cumple 4.5:1', () => {
    const config = readFileSync(TAILWIND_CONFIG, 'utf8')
    const start = config.indexOf('neutral: {')
    const block = config.slice(start, config.indexOf('}', start))
    const neutral = /500:\s*'(#[0-9a-f]{6})'/i.exec(block)
    expect(neutral).not.toBeNull()

    const ratio = 1.05 / (luminance(neutral?.[1] ?? '') + 0.05)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('los campos de formulario lo usan', () => {
    expect(css).toMatch(/input::placeholder,[\s\S]*?text-neutral-500/)

    for (const file of [
      'src/components/base/CallToAction.vue',
      'src/components/base/OurBlog.vue'
    ]) {
      const source = readFileSync(join(REPO_ROOT, file), 'utf8')
      expect(source).toMatch(/placeholder-neutral-500/)
      expect(source).not.toMatch(/placeholder-(?:gray-(?:300|400|500))/)
    }
  })
})
