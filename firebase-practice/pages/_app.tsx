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
        onSnapshot(doc(DBService, "users", `${user.uid}`), (response) => {
          setCurrentUser(response.data() as UserData)
        })
      }
    })
  }, [])
  return null
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user === null) {
        router.push("/auth")
      }
    })
  }, [])

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
