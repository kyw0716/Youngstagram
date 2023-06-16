import { useEffect, useState } from "react"
import FeedSortList from "@share/Feed/mypage/FeedSortList"
import ProfileHeader from "@feature/profile/mypage"
import styled from "styled-components"
import Layout from "components/layout"
import { FeedItem } from "backend/dto"
import { useRecoilValue } from "recoil"
import {
  FeedDataFilter,
  feedDataState,
  userDataState,
  userListState,
} from "@share/recoil/recoilList"
import CommentModal from "@share/Modal/comment/CommentModal"
import FeedUploadModal from "@share/Modal/feed/FeedUploadModal"
import UserListModal from "@share/Modal/userList/UserListModal"
import { FlexBox } from "ui"
import Loading from "@share/Loading/Loading"

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
  const currentUserData = useRecoilValue(userDataState)

  const feedDataType = useRecoilValue(FeedDataFilter)
  const selectedFeedData = useRecoilValue(feedDataState)
  const likeUserList = useRecoilValue(userListState)

  const [feedData, setFeedData] = useState<FeedItem[]>([])
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isUserListModalOpen, setIsUserListModalOpen] = useState<boolean>(false)
  const [isFeedUploadModalOpen, setIsFeedUploadModalOpen] =
    useState<boolean>(false)

  useEffect(() => {
    if (currentUserData.feed === undefined) return

    if (feedDataType === "public") {
      setFeedData(
        currentUserData.feed.filter((eachFeed) => !eachFeed.isPrivate),
      )
      return
    }
    if (feedDataType === "private") {
      setFeedData(currentUserData.feed.filter((eachFeed) => eachFeed.isPrivate))
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
        {feedData !== undefined ? (
          <FeedSortList
            feeds={feedData}
            setIsCommentModalOpen={setIsCommentModalOpen}
            setIsFeedUploadModalOpen={setIsFeedUploadModalOpen}
            setIsUserListModalOpen={setIsUserListModalOpen}
          />
        ) : (
          <FlexBox justifyContents="center">
            <Loading width={470} height={750} borderRadius={10} count={2} />
          </FlexBox>
        )}
      </Style.Wrapper>
    </Layout>
  )
}
