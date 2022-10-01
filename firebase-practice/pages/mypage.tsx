import { useEffect, useState } from "react"
import FeedSortList from "@share/Feed/mypage/FeedSortList"
import ProfileHeader from "@feature/profile/mypage"
import styled from "styled-components"
import Layout from "components/layout"
import { FeedData } from "backend/dto"
import { useRecoilValue } from "recoil"
import {
  FeedDataFilter,
  feedDataState,
  userDataState,
  userListState,
} from "@share/recoil/recoilList"
import { useRouter } from "next/router"
import CommentModal from "@share/Modal/comment/CommentModal"
import FeedUploadModal from "@share/Modal/feed/FeedUploadModal"
import UserListModal from "@share/Modal/userList/UserListModal"

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
}

export default function Profile() {
  const router = useRouter()
  const currentUserData = useRecoilValue(userDataState)

  const feedDataType = useRecoilValue(FeedDataFilter)
  const [feedData, setFeedData] = useState<FeedData[]>([])
  const selectedFeedData = useRecoilValue(feedDataState)

  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isUserListModalOpen, setIsUserListModalOpen] = useState<boolean>(false)
  const likeUserList = useRecoilValue(userListState)

  const [isFeedUploadModalOpen, setIsFeedUploadModalOpen] =
    useState<boolean>(false)

  useEffect(() => {
    if (currentUserData === undefined || currentUserData.feed === undefined)
      return
    if (feedDataType === "public") {
      setFeedData(currentUserData.feed.filter((eachFeed) => !eachFeed.private))
      return
    }
    if (feedDataType === "private") {
      setFeedData(currentUserData.feed.filter((eachFeed) => eachFeed.private))
      return
    }
    setFeedData(currentUserData.feed)
  }, [feedDataType, currentUserData])

  return (
    <Layout>
      <CommentModal
        isOpen={isCommentModalOpen}
        setIsOpen={setIsCommentModalOpen}
        feedData={selectedFeedData}
      />
      <FeedUploadModal
        setIsOpen={setIsFeedUploadModalOpen}
        isOpen={isFeedUploadModalOpen}
        feedData={selectedFeedData}
      />
      <UserListModal
        userList={likeUserList}
        isOpen={isUserListModalOpen}
        setIsOpen={setIsUserListModalOpen}
        title={""}
      />
      <Style.Wrapper>
        <ProfileHeader setIsUserListModalOpen={setIsUserListModalOpen} />
        {feedData !== undefined && (
          <FeedSortList
            feedData={feedData}
            setIsCommentModalOpen={setIsCommentModalOpen}
            setIsFeedUploadModalOpen={setIsFeedUploadModalOpen}
            setIsUserListModalOpen={setIsUserListModalOpen}
          />
        )}
      </Style.Wrapper>
    </Layout>
  )
}
