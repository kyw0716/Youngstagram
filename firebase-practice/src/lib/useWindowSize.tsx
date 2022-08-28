import { useEffect, useState } from "react"
import debounce from "./debounce"

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<number>(0)
  useEffect(() => {
    setWindowSize(window.innerWidth)
    window.addEventListener(
      "resize",
      debounce(() => {
        setWindowSize(window.innerWidth)
        console.log("호출")
      }),
    )
  }, [])
  return windowSize
}
