import "@testing-library/jest-dom"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
})

Object.defineProperty(Element.prototype, "scrollIntoView", {
  writable: true,
  value: () => {},
})
