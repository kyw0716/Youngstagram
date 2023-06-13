import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { FlexBox, Margin } from "ui"
import FeedList from "@share/Feed/mainPage/FeedList"
import Layout from "components/layout"
import { FeedData } from "backend/dto"
import FollowListAtMainPage from "@feature/followListAtMainPage"
import { useRecoilValue } from "recoil"
import {
  feedDataState,
  userDataState,
  userListState,
} from "@share/recoil/recoilList"
import { useRouter } from "next/router"
import CommentModal from "@share/Modal/comment/CommentModal"
import UserListModal from "@share/Modal/userList/UserListModal"
import Loading from "@share/Loading/Loading"

const Home: NextPage = () => {
  const [dataFromFirestore, setDataFromFirestore] = useState<DocumentData>()
  const [feedData, setFeedData] = useState<FeedData[]>()
  const currentUserData = useRecoilValue(userDataState)

  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const selectedFeedData = useRecoilValue(feedDataState)

  const [isLikeModalOpen, setIsLikeModalOpen] = useState<boolean>(false)
  const likerListData = useRecoilValue(userListState)

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
      <UserListModal
        userList={likerListData}
        isOpen={isLikeModalOpen}
        setIsOpen={setIsLikeModalOpen}
        title={"좋아요"}
      />
      <CommentModal
        isOpen={isCommentModalOpen}
        setIsOpen={setIsCommentModalOpen}
        feedData={selectedFeedData}
      />
      <Margin direction="column" size={30} />
      {currentUserData?.follow !== undefined &&
      currentUserData.follow.length > 0 ? (
        <FlexBox justifyContents="center">
          <FollowListAtMainPage />
        </FlexBox>
      ) : (
        <FlexBox justifyContents="center">
          <Loading width={470} height={119} borderRadius={10} />
        </FlexBox>
      )}
      <Margin direction="column" size={15} />
      {feedData !== undefined && currentUserData.info.userId !== "" ? (
        <FeedList
          FeedData={
            feedData ? feedData.filter((data) => !data.isPrivate) : undefined
          }
          setIsCommentModalOpen={setIsCommentModalOpen}
          setIsLikeModalOpen={setIsLikeModalOpen}
        />
      ) : (
        <FlexBox justifyContents="center">
          <Loading width={470} height={750} borderRadius={10} count={2} />
        </FlexBox>
      )}
    </Layout>
  )
}

export default Home
