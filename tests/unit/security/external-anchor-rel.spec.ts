import fs from 'fs'
import path from 'path'

const SRC = path.resolve(__dirname, '../../../src')

const collectVueFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectVueFiles(full)
    return entry.name.endsWith('.vue') ? [full] : []
  })

describe('external anchor rel integrity', () => {
  const files = collectVueFiles(SRC)

  it('finds the .vue sources it is meant to guard', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  // Any anchor opening a new tab inherits window.opener unless rel says
  // otherwise, which lets the opened page navigate this one (tabnabbing).
  // Enforced repo-wide rather than per component so a new anchor cannot
  // reintroduce it in an untested file.
  it('every target="_blank" anchor carries rel="noopener noreferrer"', () => {
    const offenders: string[] = []

    for (const file of files) {
      const source = fs.readFileSync(file, 'utf8')
      const rel = path.relative(SRC, file)
      // `[^>]*` spans newlines, so multi-line opening tags are matched whole.
      for (const tag of source.match(/<a\b[^>]*>/g) ?? []) {
        if (!tag.includes('target="_blank"')) continue
        if (!/rel\s*=\s*["'][^"']*noopener[^"']*["']/.test(tag)) {
          offenders.push(`${rel}: ${tag.replace(/\s+/g, ' ').slice(0, 90)}`)
        }
      }
    }

    expect(offenders).toEqual([])
  })
})
