import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { FlexBox, Margin } from "ui"
import FeedList from "@share/Feed/FeedList"
import Layout from "components/layout"
import { FeedData, UserData } from "backend/dto"
import { useRouter } from "next/router"
import FollowListAtMainPage from "@feature/followListAtMainPage"

const Home: NextPage = () => {
  const router = useRouter()
  const [dataFromFirestore, setDataFromFirestore] = useState<DocumentData>()
  const [feedData, setFeedData] = useState<FeedData[]>([])
  const [currentUserData, setCurrentUserData] = useState<UserData>()

  useEffect(() => {
    const AllFeedRef = doc(DBService, "mainPage", `userFeedDataAll`)
    const currentUserDataRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )
    onSnapshot(AllFeedRef, { includeMetadataChanges: true }, (doc) => {
      setDataFromFirestore(doc.data())
    })
    onSnapshot(currentUserDataRef, { includeMetadataChanges: true }, (doc) => {
      setCurrentUserData(doc.data() as UserData)
    })
  }, [])
  useEffect(() => {
    if (dataFromFirestore !== undefined) setFeedData(dataFromFirestore.feed)
  }, [dataFromFirestore])

  const [pickImageData, setPickImageData] = useState<
    "public" | "private" | "all"
  >("all")

  return (
    <Layout>
      <Margin direction="column" size={30} />
      {currentUserData?.follow !== undefined &&
        currentUserData?.follow.length !== 0 && (
          <FlexBox justifyContents="center">
            <FollowListAtMainPage />
          </FlexBox>
        )}

      <Margin direction="column" size={15} />
      <FeedList
        FeedData={feedData ? feedData.filter((data) => !data.private) : []}
        isCustomer={true}
        setPickImageData={setPickImageData}
      />
    </Layout>
  )
}

export default Home
