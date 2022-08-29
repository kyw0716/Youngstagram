import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { FlexBox, Margin } from "ui"
import FeedList from "@share/Feed/FeedList"
import Layout from "components/layout"
import { FeedData, UserData } from "backend/dto"
import FollowListAtMainPage from "@feature/followListAtMainPage"
import { useRecoilState } from "recoil"
import { userDataState } from "@share/recoil/recoilList"

const Home: NextPage = () => {
  const [dataFromFirestore, setDataFromFirestore] = useState<DocumentData>()
  const [feedData, setFeedData] = useState<FeedData[]>([])
  const [userData, setUserData] = useRecoilState(userDataState)

  useEffect(() => {
    const AllFeedRef = doc(DBService, "mainPage", `userFeedDataAll`)

    onSnapshot(AllFeedRef, { includeMetadataChanges: true }, (doc) => {
      setDataFromFirestore(doc.data())
    })
  }, [])
  useEffect(() => {
    const currentUserDataRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )
    onSnapshot(currentUserDataRef, { includeMetadataChanges: true }, (doc) => {
      if (doc) {
        setUserData(doc.data() as UserData)
      }
    })
  }, [authService.currentUser])
  useEffect(() => {
    if (dataFromFirestore !== undefined) setFeedData(dataFromFirestore.feed)
  }, [dataFromFirestore])

  return (
    <Layout>
      <Margin direction="column" size={30} />
      {userData?.follow !== undefined && userData?.follow.length !== 0 && (
        <FlexBox justifyContents="center">
          <FollowListAtMainPage />
        </FlexBox>
      )}

      <Margin direction="column" size={15} />
      <FeedList
        FeedData={feedData ? feedData.filter((data) => !data.private) : []}
        isCustomer={true}
      />
    </Layout>
  )
}

export default Home
