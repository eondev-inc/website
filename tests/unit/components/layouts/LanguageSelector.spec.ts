import { fireEvent } from '@testing-library/vue'
import LanguageSelector from '@/components/layouts/LanguageSelector.vue'
import { renderWithApp } from '../../../helpers'

describe('LanguageSelector.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should toggle dropdown visibility', async () => {
    const view = await renderWithApp(LanguageSelector)

    expect(view.queryByRole('menu')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: /idioma/i }))
    expect(view.getByRole('menu')).toBeVisible()
  })

  it('should change language and emit event', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    const view = await renderWithApp(LanguageSelector)

    await fireEvent.click(view.getByRole('button', { name: /idioma/i }))
    await fireEvent.click(view.getByRole('menuitem', { name: /english/i }))

    expect(view.emitted().changeLanguage?.[0]).toEqual(['en'])
    expect(setItemSpy).toHaveBeenCalledWith('preferred-language', 'en')
    setItemSpy.mockRestore()
  })

  it('should read preferred language on mount', async () => {
    localStorage.setItem('preferred-language', 'en')

    const view = await renderWithApp(LanguageSelector)

    expect(view.getByRole('button', { name: /language/i })).toBeInTheDocument()
  })
})
