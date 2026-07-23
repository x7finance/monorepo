import { create } from "zustand"

interface SlideOverState {
  isSlideOverOpen: boolean
  setIsSlideOverOpen: (value: boolean) => void
}

export const useSlideOverStore = create<SlideOverState>((set) => ({
  isSlideOverOpen: false,
  setIsSlideOverOpen: (value) => set(() => ({ isSlideOverOpen: value })),
}))
