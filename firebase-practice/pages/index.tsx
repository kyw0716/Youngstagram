import { signOut, User } from "firebase/auth"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService } from "../src/FireBase"

const Home: NextPage = () => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User>()

  useEffect(() => {
    if (authService.currentUser !== null) {
      setCurrentUser(authService.currentUser)
      return
    }
    router.push("/auth")
    /*eslint-disable-next-line*/
  }, [authService.currentUser])

  return (
    <>
      <span>환영합니다!! {currentUser?.email}님!</span>
      <button
        onClick={() => {
          signOut(authService)
          router.push("/auth")
        }}
      >
        로그아웃
      </button>
      <br />
      <button
        onClick={() => {
          if (currentUser?.uid !== null) {
            router.push(`/u/${currentUser?.uid}`)
          }
        }}
      >
        프로필 페이지
      </button>
    </>
  )
}

export default Home
