import { useEffect, useState } from "react"

export function useIsComponentReady() {
  const [isComponentReady, setComponentReady] = useState(false)

  useEffect(() => {
    setComponentReady(true)
  }, [])

  return isComponentReady
}
