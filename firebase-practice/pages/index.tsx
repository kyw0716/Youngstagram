import { signOut, User } from "firebase/auth"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import styled from "styled-components"
import ImageCard from "@share/ImageCard"
import Header from "layout/Header"

const Style = {
  MainPageImage: styled.img`
    width: 200px;
    height: 200px;
  `,
  ImageContainer: styled.div`
    display: flex;
    width: 100vw;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 50px;
  `,
}

const Home: NextPage = () => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User>()
  const [userData, setUserData] = useState<DocumentData>()
  const [imageData, setImageData] = useState<
    { image: string; imageTitle: string; private: boolean; creator: string }[]
  >([])

  useEffect(() => {
    const userDataRef = doc(DBService, "mainPage", `userImageDataAll`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined) setImageData(userData.images)
  }, [userData])

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
      <Header />
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
      <Style.ImageContainer>
        {imageData &&
          imageData.map((imageObject, index) => {
            return (
              <>
                {!imageObject.private && (
                  <div key={index}>
                    <ImageCard
                      key={index}
                      imageUrl={imageObject.image}
                      imageTitle={imageObject.imageTitle}
                      isPrivate={imageObject.private}
                      userId={""}
                      userName={imageObject.creator}
                      isMainPage={true}
                    />
                  </div>
                )}
              </>
            )
          })}
      </Style.ImageContainer>
    </>
  )
}

export default Home
