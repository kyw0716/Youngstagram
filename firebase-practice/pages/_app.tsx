import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { onAuthStateChanged } from "firebase/auth"
import { authService, DBService } from "@FireBase"
import { RecoilRoot, useSetRecoilState } from "recoil"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import axios from "axios"

const SetDarkMode = () => {
  const setDarkRecoil = useSetRecoilState(darkModeState)
  useEffect(() => {
    setDarkRecoil(localStorage.getItem("darkMode") === "dark")
  }, [])
  return null
}

const SetCurrnentUser = () => {
  const setCurrentUser = useSetRecoilState(userDataState)
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        axios<UserData>({
          method: "",
          url: `/api/profile?userId=${user.uid}`,
        }).then((response) => {
          setCurrentUser(response.data)
        })
      }
    })
  }, [])
  return null
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [routingPath, setRoutingPath] = useState<string>("")
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user === null) {
        setRoutingPath("auth")
      }
    })
  }, [])

  useEffect(() => {
    if (routingPath !== "") {
      router.push(`/${routingPath}`)
      setRoutingPath("")
    }
  }, [routingPath])

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }, [])
  return (
    <RecoilRoot>
      <SetDarkMode />
      <SetCurrnentUser />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
