import { onAuthStateChanged, signOut } from "firebase/auth"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService } from "../src/FireBase"

const Home: NextPage = () => {
  const router = useRouter()
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("")
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        if (user.email !== null) setCurrentUserEmail(user.email)
        return
      }
      router.push("/auth")
    })
    /*eslint-disable-next-line*/
  }, [])

  return (
    <>
      <span>환영합니다!! {currentUserEmail}님!</span>
      <button
        onClick={() => {
          signOut(authService)
        }}
      >
        로그아웃
      </button>
    </>
  )
}

export default Home
