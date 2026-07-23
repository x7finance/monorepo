import { useEffect, useState } from "react"

export function useIsComponentReady(): boolean {
  const [isComponentReady, setComponentReady] = useState<boolean>(false)

  useEffect(() => {
    setComponentReady(true)
  }, [])

  return isComponentReady
}
