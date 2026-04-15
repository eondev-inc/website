import {
  getCacheData,
  setCacheData,
  clearCache,
  clearCacheByPattern
} from '@/composables/utils/cache-utils'

describe('cache-utils', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should return null when key is missing', () => {
    expect(getCacheData('missing', 1000)).toBeNull()
  })

  it('should return cached data when entry is valid', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000)
    setCacheData('posts-6', [{ id: 1 }])
    nowSpy.mockReturnValue(1500)

    const result = getCacheData<Array<{ id: number }>>('posts-6', 1000)

    expect(result).toEqual([{ id: 1 }])
    nowSpy.mockRestore()
  })

  it('should clear and return null when cache is expired', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000)
    setCacheData('posts-6', [{ id: 1 }])
    nowSpy.mockReturnValue(3001)

    const result = getCacheData<Array<{ id: number }>>('posts-6', 2000)

    expect(result).toBeNull()
    expect(removeItemSpy).toHaveBeenCalledWith('posts-6')
    nowSpy.mockRestore()
  })

  it('should return null for malformed json', () => {
    localStorage.setItem('bad', '{bad-json')

    expect(getCacheData('bad', 1000)).toBeNull()
  })

  it('should not throw when localStorage.setItem fails', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => setCacheData('x', { ok: true })).not.toThrow()
    expect(console.warn).toHaveBeenCalled()
  })

  it('should remove specific key with clearCache', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')
    localStorage.setItem('posts-3', 'x')

    clearCache('posts-3')

    expect(removeItemSpy).toHaveBeenCalledWith('posts-3')
  })

  it('should remove keys that match a pattern', () => {
    localStorage.setItem('posts-3', 'a')
    localStorage.setItem('posts-6', 'b')
    localStorage.setItem('profile', 'c')

    clearCacheByPattern('posts-')

    expect(localStorage.getItem('posts-3')).toBeNull()
    expect(localStorage.getItem('posts-6')).toBeNull()
    expect(localStorage.getItem('profile')).toBe('c')
  })
})
