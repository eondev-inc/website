/**
 * Dirección pública de contacto. `VITE_CONTACT_EMAIL` permite sobreescribirla
 * en un build; sin ella se usa la dirección real del proyecto, nunca un
 * marcador de posición.
 */
export const CONTACT_EMAIL = process.env.VITE_CONTACT_EMAIL || 'hola@eondev.site'
