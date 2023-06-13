import type { NextPage } from "next"
import { useState } from "react"
import { FlexBox, Margin } from "ui"
import FeedList from "@share/Feed/mainPage/FeedList"
import Layout from "components/layout"
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
import { mainFeedItems } from "@share/recoil/feed"

const Home: NextPage = () => {
  const router = useRouter()

  const feedData = useRecoilValue(mainFeedItems)

  const currentUserData = useRecoilValue(userDataState)

  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const selectedFeedData = useRecoilValue(feedDataState)

  const [isLikeModalOpen, setIsLikeModalOpen] = useState<boolean>(false)
  const likerListData = useRecoilValue(userListState)

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
        currentUserData.follow.length > 0 && (
          <FlexBox justifyContents="center">
            <FollowListAtMainPage />
          </FlexBox>
        )}
      <Margin direction="column" size={15} />
      {currentUserData.info.userId !== "" ? (
        <FeedList
          feedItems={feedData}
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
