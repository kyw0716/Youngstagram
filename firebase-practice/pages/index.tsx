import { signOut, updateProfile, User } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService, DBService } from "../src/FireBase"

const Home: NextPage = () => {
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const [currentUser, setCurrentUser] = useState<User>()

  useEffect(() => {
    if (authService.currentUser !== null) {
      setCurrentUser(authService.currentUser)
      return
    }
    router.push("/auth")
    /*eslint-disable-next-line*/
  }, [authService.currentUser])

  const handleNameOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setName(event.target.value)
  }

  const uploadUserNameToFirestore = async (name: string) => {
    if (currentUser?.uid !== undefined) {
      const userDataRef = doc(DBService, "userData", currentUser?.uid)
      await setDoc(userDataRef, {
        name: name,
      })
    }
  }

  const handleUserDataSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    if (currentUser !== undefined) {
      updateProfile(currentUser, {
        displayName: name,
      })
    }
    uploadUserNameToFirestore(name)
    setName("")
  }

  return (
    <>
      <span>환영합니다!! {currentUser?.email}님!</span>
      <button
        onClick={() => {
          signOut(authService)
        }}
      >
        로그아웃
      </button>
      <form onSubmit={handleUserDataSubmit}>
        <input
          type="text"
          placeholder="name?"
          onChange={handleNameOnChange}
          value={name}
        />
        <input type="submit" value="send" />
      </form>
      <button
        onClick={() => {
          router.push(`/u/${currentUser?.uid}`)
        }}
      >
        프로필 페이지
      </button>
      <span>{`현재 유저 => 이름: ${currentUser?.displayName}, 폰번호: ${currentUser?.phoneNumber}, 이메일: ${currentUser?.email}`}</span>
    </>
  )
}

export default Home
