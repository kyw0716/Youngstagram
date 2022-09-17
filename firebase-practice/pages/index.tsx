import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { FlexBox, Margin } from "ui"
import FeedList from "@share/Feed/FeedList"
import Layout from "components/layout"
import { FeedData } from "backend/dto"
import FollowListAtMainPage from "@feature/followListAtMainPage"
import { useRecoilValue } from "recoil"
import { feedDataState, userDataState } from "@share/recoil/recoilList"
import { useRouter } from "next/router"
import CommentModal from "@share/Modal/comment/CommentModal"

const Home: NextPage = () => {
  const router = useRouter()
  const [dataFromFirestore, setDataFromFirestore] = useState<DocumentData>()
  const [feedData, setFeedData] = useState<FeedData[]>()
  const currentUserData = useRecoilValue(userDataState)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const selectedFeedData = useRecoilValue(feedDataState)

  useEffect(() => {
    if (currentUserData !== undefined && currentUserData.info.userId === "")
      router.push("/loading")
  }, [currentUserData])
  useEffect(() => {
    const AllFeedRef = doc(DBService, "mainPage", `userFeedDataAll`)
    onSnapshot(AllFeedRef, { includeMetadataChanges: true }, (doc) => {
      if (doc) setDataFromFirestore(doc.data())
    })
  }, [])
  useEffect(() => {
    if (dataFromFirestore !== undefined) {
      setFeedData(dataFromFirestore.feed)
    }
  }, [dataFromFirestore])

  return (
    <Layout>
      <CommentModal
        isOpen={isCommentModalOpen}
        setIsOpen={setIsCommentModalOpen}
        feedData={selectedFeedData}
      />
      <Margin direction="column" size={30} />
      {currentUserData?.follow !== undefined &&
        currentUserData?.follow.length !== 0 && (
          <FlexBox justifyContents="center">
            <FollowListAtMainPage />
          </FlexBox>
        )}
      <Margin direction="column" size={15} />
      {currentUserData.info.userId !== "" && (
        <FeedList
          FeedData={
            feedData ? feedData.filter((data) => !data.private) : undefined
          }
          setIsCommentModalOpen={setIsCommentModalOpen}
        />
      )}
    </Layout>
  )
}

export default Home
