import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { FlexBox, Margin } from "ui"
import FeedList from "@share/Feed/FeedList"
import Layout from "components/layout"
import { FeedData } from "backend/dto"
import { useRouter } from "next/router"
import FollowListAtMainPage from "@feature/followListAtMainPage"

const Home: NextPage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<DocumentData>()
  const [imageData, setImageData] = useState<FeedData[]>([])

  useEffect(() => {
    const userDataRef = doc(DBService, "mainPage", `userFeedDataAll`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined) setImageData(userData.feed)
  }, [userData])

  const [pickImageData, setPickImageData] = useState<
    "public" | "private" | "all"
  >("all")

  return (
    <Layout>
      <Margin direction="column" size={30} />
      <FlexBox justifyContents="center">
        <FollowListAtMainPage />
      </FlexBox>
      <Margin direction="column" size={15} />
      <FeedList
        FeedData={imageData ? imageData.filter((data) => !data.private) : []}
        isCustomer={true}
        setPickImageData={setPickImageData}
      />
    </Layout>
  )
}

export default Home
