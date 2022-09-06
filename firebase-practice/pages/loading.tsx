import { authService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import { onAuthStateChanged } from "firebase/auth"
import getUserDataByUid from "lib/getUserDataByUid"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useRecoilState } from "recoil"
import styled from "styled-components"
import { LoadingPage } from "ui"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}

export default function Loading() {
  const router = useRouter()
  const [currentUserData, setCurrentUserData] = useRecoilState(userDataState)
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user === null) {
        router.push("/auth")
        return
      }
      if (
        user &&
        currentUserData !== undefined &&
        currentUserData.info.userId === ""
      ) {
        getUserDataByUid(`${authService.currentUser?.uid}`).then((data) => {
          if (data) {
            setCurrentUserData(data as UserData)
          }
        })
      }
    })
  }, [])
  useEffect(() => {
    if (currentUserData === undefined) return
    if (currentUserData.info.userId !== "") {
      router.replace(
        router.query.path === undefined ? "/" : `/${router.query.path}`,
      )
      return
    }
  }, [currentUserData])

  return (
    <Style.Wrapper>
      <LoadingPage />
    </Style.Wrapper>
  )
}
