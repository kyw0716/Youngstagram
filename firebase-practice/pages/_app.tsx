import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { onAuthStateChanged } from "firebase/auth"
import { authService } from "@FireBase"
import { RecoilRoot, useSetRecoilState } from "recoil"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import getUserDataByUid from "lib/getUserDataByUid"
import { UserData } from "backend/dto"

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
        getUserDataByUid(user.uid).then((response) => {
          setCurrentUser(response as UserData)
        })
      }
    })
  }, [])
  return null
}

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
      <SetDarkMode />
      <SetCurrnentUser />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
