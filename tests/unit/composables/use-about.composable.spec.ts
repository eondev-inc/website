import useAboutMe from '@/composables/use-about.composable'

const EXPECTED_ENTRIES = 7

describe('use-about.composable', () => {
  it('returns a single resume profile with 7 entries per locale', () => {
    const { aboutMeResume } = useAboutMe()

    expect(aboutMeResume).toHaveLength(1)
    expect(aboutMeResume[0].es).toHaveLength(EXPECTED_ENTRIES)
    expect(aboutMeResume[0].en).toHaveLength(EXPECTED_ENTRIES)
  })

  it('every resume entry has non-empty title, description, url, and fromTo', () => {
    const { aboutMeResume } = useAboutMe()
    const es = aboutMeResume[0].es
    const en = aboutMeResume[0].en

    // Prove non-empty loops: both collections must have real entries
    expect(es).toHaveLength(EXPECTED_ENTRIES)
    expect(en).toHaveLength(EXPECTED_ENTRIES)

    for (const entry of es) {
      expect(entry.title.trim()).not.toBe('')
      expect(entry.description.trim()).not.toBe('')
      expect(entry.url).toMatch(/^https?:\/\//)
      expect(entry.fromTo.trim()).not.toBe('')
    }

    for (const entry of en) {
      expect(entry.title.trim()).not.toBe('')
      expect(entry.description.trim()).not.toBe('')
      expect(entry.url).toMatch(/^https?:\/\//)
      expect(entry.fromTo.trim()).not.toBe('')
    }
  })

  it('es and en entries are distinct translated content', () => {
    const { aboutMeResume } = useAboutMe()
    const es = aboutMeResume[0].es
    const en = aboutMeResume[0].en

    expect(es[0].title).not.toBe(en[0].title)
    expect(es[0].description).not.toBe(en[0].description)
    expect(es[0].url).toBe('https://imed.cl/')
    expect(en[0].url).toBe('https://imed.cl/')
    expect(es[0].fromTo).toContain('Actualidad')
    expect(en[0].fromTo).toContain('Present')
  })

  it('lists the two newest Imed roles first, in both locales', () => {
    const { aboutMeResume } = useAboutMe()
    const { es, en } = aboutMeResume[0]

    expect(es[0].title).toContain('Líder Técnico Advisor IA')
    expect(es[1].title).toContain('Desarrollador Senior')
    expect(en[0].title).toContain('Technical Leader & AI Advisor')
    expect(en[1].title).toContain('Senior Developer')
  })

  it('marks exactly one role as current per locale', () => {
    const { aboutMeResume } = useAboutMe()
    const { es, en } = aboutMeResume[0]

    expect(es.filter((entry: { fromTo: string }) => entry.fromTo.includes('Actualidad'))).toHaveLength(1)
    expect(en.filter((entry: { fromTo: string }) => entry.fromTo.includes('Present'))).toHaveLength(1)
  })

  it('closes the previous Technical Leader role instead of leaving it open', () => {
    const { aboutMeResume } = useAboutMe()
    const { es, en } = aboutMeResume[0]

    expect(es[2].title).toContain('Líder Técnico')
    expect(es[2].fromTo).toBe('Feb. 2023 - Mar. 2025')
    expect(en[2].title).toContain('Technical Leader')
    expect(en[2].fromTo).toBe('Feb. 2023 - Mar. 2025')
  })
})
