import '@testing-library/jest-dom'

type StorageRecord = Record<string, string>

interface LocalStorageMock {
  [key: string]: unknown
  getItem: jest.Mock
  setItem: jest.Mock
  removeItem: jest.Mock
  clear: jest.Mock
  key: jest.Mock
  readonly length: number
  __setThrowOnSetItem: (error: Error | null) => void
  __reset: () => void
}

const createLocalStorageMock = (): LocalStorageMock => {
  let store: StorageRecord = {}
  let setItemError: Error | null = null

  const mock = {} as LocalStorageMock

  Object.defineProperty(mock, 'length', {
    get: () => Object.keys(store).length,
    enumerable: false
  })

  mock.getItem = jest.fn((key: string) => {
    return key in store ? store[key] : null
  })

  mock.setItem = jest.fn((key: string, value: string) => {
    if (setItemError) throw setItemError
    store[key] = String(value)
    Object.defineProperty(mock, key, {
      value: String(value),
      writable: true,
      configurable: true,
      enumerable: true
    })
  })

  mock.removeItem = jest.fn((key: string) => {
    delete store[key]
    delete (mock as Record<string, unknown>)[key]
  })

  mock.clear = jest.fn(() => {
    Object.keys(store).forEach((key) => {
      delete (mock as Record<string, unknown>)[key]
    })
    store = {}
  })

  mock.key = jest.fn((index: number) => {
    const keys = Object.keys(store)
    return keys[index] ?? null
  })

  Object.defineProperty(mock, '__setThrowOnSetItem', {
    value: (error: Error | null) => {
      setItemError = error
    },
    enumerable: false
  })

  Object.defineProperty(mock, '__reset', {
    value: () => {
      setItemError = null
      mock.clear()
      jest.clearAllMocks()
    },
    enumerable: false
  })

  return mock
}

;(globalThis as any).localStorage = createLocalStorageMock()

;(globalThis as any).IntersectionObserver = class {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

// Mock de console para evitar ruido en tests
const originalConsole = globalThis.console
;(globalThis as any).console = {
  ...originalConsole,
  warn: jest.fn(),
  error: jest.fn()
}
