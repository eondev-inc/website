import { safeExternalUrl } from './url-utils'

/**
 * Origins the portfolio is allowed to open in a new tab. Mirrors the external
 * links declared in `src/composables/use-about.composable.ts` plus the LinkedIn
 * profile called directly from the About template — keep both in sync.
 */
const ALLOWED_ORIGINS = [
  'https://techcrunch.com',
  'https://www.linkedin.com',
  'https://escritoriomedico.i-med.cl',
  'https://mimed.com',
  'https://web.archive.org',
  'https://tuclase.cl',
  'https://starken.cl',
  'https://escritoriomedico.cl'
]

/**
 * Opens an external link only when its origin passes the allowlist, falling back
 * to `'#'` otherwise so `javascript:` URLs and unexpected origins can never reach
 * `window.open`. Always carries `noopener,noreferrer`.
 *
 * Lives in its own module rather than as a named export of `AboutView.vue`: an
 * SFC named export is not a stable contract, so importing one from a spec needs
 * `@ts-expect-error` and breaks silently if the vue-loader or TS config changes.
 */
export const toOutside = (url: string): void => {
  window.open(safeExternalUrl(url, ALLOWED_ORIGINS), '_blank', 'noopener,noreferrer')
}
