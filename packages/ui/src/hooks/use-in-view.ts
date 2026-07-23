/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import type { RefObject } from "react"
import { useEffect, useState } from "react"

interface UseInViewOptions {
  margin?: string
  amount?: "some" | "all" | number
  once?: boolean
}

export function useInView(
  ref: RefObject<null>,
  options: UseInViewOptions = {}
): boolean {
  const [inView, setInView] = useState(false)
  const { margin = "0px", amount = "some", once = false } = options

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observerOptions: IntersectionObserverInit = {
      rootMargin: margin,
      threshold: amount === "all" ? 1 : amount === "some" ? 0 : amount,
    }

    const observer = new IntersectionObserver(([entry]) => {
      const isIntersecting = entry!.isIntersecting
      setInView(isIntersecting)

      if (isIntersecting && once) {
        observer.unobserve(node)
      }
    }, observerOptions)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [ref, margin, amount, once])

  return inView
}
