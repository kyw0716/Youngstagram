import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { onAuthStateChanged } from "firebase/auth"
import { authService } from "@FireBase"
import { RecoilRoot } from "recoil"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLogOut, setIsLogOut] = useState<boolean>(false)
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user === null) setIsLogOut(true)
    })
  }, [])
  useEffect(() => {
    if (isLogOut) router.push("/loading")
  }, [isLogOut])

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }, [])
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
