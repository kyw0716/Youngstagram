import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import Header from "components/layout/Header"
import { Margin } from "ui"
import ImageList from "@share/ImageList"
import { onAuthStateChanged } from "firebase/auth"

const Home: NextPage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<DocumentData>()
  const [imageData, setImageData] = useState<
    { image: string; imageTitle: string; private: boolean; creator: string }[]
  >([])

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
    <>
      <Header />
      <Margin direction="column" size={30} />
      {authService.currentUser?.uid !== undefined &&
        authService.currentUser.displayName !== null && (
          <ImageList
            imageData={imageData.filter((data) => !data.private)}
            isMainPage={true}
            userId={authService.currentUser?.uid}
            setPickImageData={setPickImageData}
          />
        )}
    </>
  )
}

export default Home
