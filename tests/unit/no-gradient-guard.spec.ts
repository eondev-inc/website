import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'

/**
 * Guard del sistema "flat estructural" (ver `odd/tasks/ux-flat-refactor.md`).
 *
 * El proyecto no tiene tests que aserten clases de estilo, así que el invariante
 * de diseño no tenía ninguna protección: la suite podía quedar 100% verde con un
 * degradado magenta→turquesa reintroducido en un titular.
 *
 * Reglas que este guard protege:
 *  1. Un color por superficie → sin gradientes, sin texto con color recortado.
 *  2. Sin blur decorativo → sin `backdrop-blur`, sin manchas difusas.
 *  3. Profundidad por borde y una sola escala de sombra → sin sombras de color.
 */
const REPO_ROOT = join(__dirname, '..', '..')
const SCAN_DIR = join(REPO_ROOT, 'src')
const EXTRA_FILES = [join(REPO_ROOT, 'tailwind.config.js')]

const BANNED = [
  { pattern: /gradient/i, rule: 'un color por superficie: no se permiten gradientes' },
  { pattern: /bg-clip-text/, rule: 'no se permite texto con color recortado' },
  { pattern: /backdrop-blur/, rule: 'sin blur decorativo' },
  { pattern: /\bblur-(?:sm|md|lg|xl|2xl|3xl)\b/, rule: 'sin manchas difusas de color' },
  { pattern: /shadow-glow/, rule: 'sin sombras con brillo de color' }
]

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return walk(full)
    return /\.(vue|css)$/.test(entry) ? [full] : []
  })
}

describe('flat design guard', () => {
  const files = [...walk(SCAN_DIR), ...EXTRA_FILES]

  it('scans the style surface it is supposed to protect', () => {
    expect(files.length).toBeGreaterThan(10)
    expect(files).toEqual(expect.arrayContaining([join(REPO_ROOT, 'src', 'assets', 'style.css')]))
  })

  it('has no gradient, gradient-text, decorative blur or coloured glow anywhere', () => {
    const violations: string[] = []

    for (const file of files) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, index) => {
          for (const { pattern, rule } of BANNED) {
            if (pattern.test(line)) {
              violations.push(`${relative(REPO_ROOT, file)}:${index + 1} — ${rule}`)
            }
          }
        })
    }

    expect(violations).toEqual([])
  })
})
