import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { FlexBox, Margin } from "ui"
import ImageList from "@share/ImageList"
import { onAuthStateChanged } from "firebase/auth"
import styled from "styled-components"
import Layout from "components/layout"
import { UserImageDataAll } from "backend/dto"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: fit-content;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  `,
  TempButton: styled.div`
    background-color: #4891ff;
    width: fit-content;
    height: fit-content;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    border-radius: 10px;
  `,
}

const Home: NextPage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<DocumentData>()
  const [imageData, setImageData] = useState<UserImageDataAll[]>([])

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        router.push("/")
      } else {
        router.push("/auth")
      }
    })
  }, [])

  useEffect(() => {
    const userDataRef = doc(DBService, "mainPage", `userImageDataAll`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined) setImageData(userData.images)
  }, [userData])

  const [pickImageData, setPickImageData] = useState<
    "public" | "private" | "all"
  >("all")

  return (
    <Layout>
      <Margin direction="column" size={30} />
      <FlexBox width={"100%"} justifyContents="center">
        <Style.TempButton
          onClick={() => {
            router.push("test")
          }}
        >
          임시 이미지 업로드 페이지
        </Style.TempButton>
      </FlexBox>
      <Margin direction="column" size={30} />
      {authService.currentUser?.uid !== undefined &&
        authService.currentUser.displayName !== null && (
          <ImageList
            imageData={
              imageData ? imageData.filter((data) => !data.private) : []
            }
            isMainPage={true}
            userId={authService.currentUser?.uid}
            setPickImageData={setPickImageData}
          />
        )}
    </Layout>
  )
}

export default Home
