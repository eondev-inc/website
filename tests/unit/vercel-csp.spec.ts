import { readFileSync } from 'fs'
import { join } from 'path'

const REPO_ROOT = join(__dirname, '..', '..')

const cspDirective = (name: string): string[] => {
  const config = JSON.parse(readFileSync(join(REPO_ROOT, 'vercel.json'), 'utf8'))
  const header = config.headers
    .flatMap((entry: { headers: { key: string, value: string }[] }) => entry.headers)
    .find((item: { key: string }) => item.key === 'Content-Security-Policy')
  const directive = header.value
    .split(';')
    .map((part: string) => part.trim())
    .find((part: string) => part.startsWith(`${name} `))
  return directive.split(/\s+/).slice(1)
}

describe('vercel.json CSP', () => {
  // `*.techcrunch.com` no cubre el dominio base: las imágenes destacadas se
  // sirven desde https://techcrunch.com/wp-content/ y quedaban bloqueadas.
  it('allows article images served from the techcrunch.com apex domain', () => {
    expect(cspDirective('img-src')).toContain('https://techcrunch.com')
  })

  it('still allows the TechCrunch API in connect-src', () => {
    expect(cspDirective('connect-src')).toContain('https://techcrunch.com')
  })
})
