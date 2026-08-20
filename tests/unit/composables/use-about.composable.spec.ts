import useAboutMe from '@/composables/use-about.composable'

describe('use-about.composable', () => {
  it('returns a single resume profile with 5 entries per locale', () => {
    const { aboutMeResume } = useAboutMe()

    expect(aboutMeResume).toHaveLength(1)
    expect(aboutMeResume[0].es).toHaveLength(5)
    expect(aboutMeResume[0].en).toHaveLength(5)
  })

  it('every resume entry has non-empty title, description, url, and fromTo', () => {
    const { aboutMeResume } = useAboutMe()
    const es = aboutMeResume[0].es
    const en = aboutMeResume[0].en

    // Prove non-empty loops: both collections must have real entries
    expect(es).toHaveLength(5)
    expect(en).toHaveLength(5)

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
    expect(es[0].url).toBe('https://escritoriomedico.i-med.cl/')
    expect(en[0].url).toBe('https://escritoriomedico.cl')
    expect(es[1].fromTo).not.toBe(en[1].fromTo)
  })
})
