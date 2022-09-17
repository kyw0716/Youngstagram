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
} from "@share/recoil/recoilList"
import { useRouter } from "next/router"
import CommentModal from "@share/Modal/comment/CommentModal"
import FeedUploadModal from "@share/Modal/feed/FeedUploadModal"

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
  const userData = useRecoilValue(userDataState)
  const feedDataType = useRecoilValue(FeedDataFilter)
  const [feedData, setFeedData] = useState<FeedData[]>([])
  const selectedFeedData = useRecoilValue(feedDataState)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isFeedUploadModalOpen, setIsFeedUploadModalOpen] =
    useState<boolean>(false)
  const [isUploaded, setIsUploaded] = useState<boolean>(false)

  useEffect(() => {
    if (userData !== undefined && userData.info.userId === "")
      router.push("/loading?path=mypage")
  }, [userData])

  useEffect(() => {
    if (isUploaded)
      router.replace(`/loading?path=${router.pathname.replace("/", "")}`)
  }, [isUploaded])

  useEffect(() => {
    if (userData === undefined || userData.feed === undefined) return
    if (feedDataType === "public") {
      setFeedData(userData.feed.filter((eachFeed) => !eachFeed.private))
      return
    }
    if (feedDataType === "private") {
      setFeedData(userData.feed.filter((eachFeed) => eachFeed.private))
      return
    }
    setFeedData(userData.feed)
  }, [feedDataType, userData])

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
        setIsUploaded={setIsUploaded}
      />
      {userData !== undefined && userData.info.userId !== "" ? (
        <Style.Wrapper>
          <ProfileHeader />
          {feedData !== undefined && (
            <FeedSortList
              FeedData={feedData}
              setIsCommentModalOpen={setIsCommentModalOpen}
              setIsFeedUploadModalOpen={setIsFeedUploadModalOpen}
            />
          )}
        </Style.Wrapper>
      ) : (
        <></>
      )}
    </Layout>
  )
}
