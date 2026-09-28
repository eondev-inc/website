import { toOutside } from '@/composables/utils/outbound-links'

describe('outbound-links (consumed by AboutView.vue)', () => {
  const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

  beforeEach(() => {
    windowOpenSpy.mockClear()
  })

  afterAll(() => {
    windowOpenSpy.mockRestore()
  })

  it('toOutside opens safe URLs with noopener,noreferrer', () => {
    toOutside('https://www.linkedin.com/in/yromeroc')
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://www.linkedin.com/in/yromeroc',
      '_blank',
      'noopener,noreferrer'
    )
  })

  // Asserting only that the attacker URL was NOT forwarded is negative evidence:
  // it would still pass if safeExternalUrl threw and window.open never ran at
  // all. These assert the exact safe replacement, so they fail both when the
  // guard is bypassed and when it silently does nothing.
  it('toOutside replaces javascript:alert(1) with the safe fallback', () => {
    toOutside('javascript:alert(1)')
    expect(windowOpenSpy).toHaveBeenCalledTimes(1)
    expect(windowOpenSpy).toHaveBeenCalledWith('#', '_blank', 'noopener,noreferrer')
  })

  it('toOutside replaces a non-allowlisted origin with the safe fallback', () => {
    toOutside('https://evil.com')
    expect(windowOpenSpy).toHaveBeenCalledTimes(1)
    expect(windowOpenSpy).toHaveBeenCalledWith('#', '_blank', 'noopener,noreferrer')
  })

  it('toOutside replaces a non-https allowlisted origin with the safe fallback', () => {
    toOutside('http://www.linkedin.com/in/yromeroc')
    expect(windowOpenSpy).toHaveBeenCalledTimes(1)
    expect(windowOpenSpy).toHaveBeenCalledWith('#', '_blank', 'noopener,noreferrer')
  })

  // Every host the page actually links to must survive the allowlist, otherwise
  // the guard silently breaks the portfolio's own outbound links.
  it.each([
    'https://escritoriomedico.i-med.cl/',
    'https://mimed.com',
    'https://web.archive.org/web/20200919024522/https://www.izitapp.com/',
    'https://tuclase.cl',
    'https://starken.cl',
    'https://escritoriomedico.cl',
    'https://www.linkedin.com/in/yromeroc',
    'https://techcrunch.com'
  ])('toOutside passes the real portfolio link %s through unchanged', (url) => {
    toOutside(url)
    expect(windowOpenSpy).toHaveBeenCalledTimes(1)
    expect(windowOpenSpy).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer')
  })
})
