import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { onAuthStateChanged } from "firebase/auth"
import { authService } from "@FireBase"
import { RecoilRoot } from "recoil"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user === null) router.push("/loading")
    })
  }, [])

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
