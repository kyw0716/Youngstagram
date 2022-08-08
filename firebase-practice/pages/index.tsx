import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { Margin } from "ui"
import ImageList from "@share/ImageList"
import Layout from "components/layout"
import { UserImageDataAll } from "backend/dto"
import { onAuthStateChanged } from "firebase/auth"

const Home: NextPage = () => {
  const [userData, setUserData] = useState<DocumentData>()
  const [imageData, setImageData] = useState<UserImageDataAll[]>([])

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
      <ImageList
        imageData={imageData ? imageData.filter((data) => !data.private) : []}
        isMainPage={true}
        setPickImageData={setPickImageData}
      />
    </Layout>
  )
}

export default Home
