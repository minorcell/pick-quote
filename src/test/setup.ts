import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'
import { TextEncoder, TextDecoder } from 'util'
import { webcrypto } from 'crypto'

// Polyfill TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Polyfill structuredClone for Node < 17
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj))
}

// Mock crypto.subtle for hash functions - ensure it's available globally
Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  writable: true,
  configurable: true
})

// Mock chrome API for browser extension
global.chrome = {
  runtime: {
    id: 'test-extension-id',
    getURL: (path: string) => `chrome-extension://test-extension-id/${path}`
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn()
    }
  }
} as any
