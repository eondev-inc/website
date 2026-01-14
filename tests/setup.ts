import '@testing-library/jest-dom'

// Mock de localStorage para tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

;(globalThis as any).localStorage = localStorageMock

// Mock de console para evitar ruido en tests
const originalConsole = globalThis.console
;(globalThis as any).console = {
  ...originalConsole,
  warn: jest.fn(),
  error: jest.fn()
}
