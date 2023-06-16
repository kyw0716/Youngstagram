import {
  darkModeState,
  feedDataState,
  userDataState,
  userListState,
} from "@share/recoil/recoilList"
import axios from "axios"
import { Comment, FeedItem } from "backend/dto"
import React, { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  CommentIcon,
  CustomH6,
  FlexBox,
  FullHeart,
  HeartIcon,
  Margin,
  ShareIcon,
} from "ui"

type Props = {
  feedData: FeedItem
  setIsLikeModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function LikeCommentInfo({
  feedData,
  setIsLikeModalOpen,
  setIsCommentModalOpen,
}: Props) {
  const [commentData, setCommentData] = useState<Comment[]>([])
  const currentUser = useRecoilValue(userDataState)

  const setLikeUserList = useSetRecoilState(userListState)
  const setSelectedFeedData = useSetRecoilState(feedDataState)

  const isDarkMode = useRecoilValue(darkModeState)
  const [likeUserIds, setLikeUserIds] = useState<string[]>([])

  useEffect(() => {
    axios<Comment[]>({
      method: "GET",
      url: `/api/comment?commentId=${feedData.storageId}`,
    })
      .then((res) => {
        setCommentData(res.data)
      })
      .catch((error) => console.log(error))

    axios.get(`/api/like?storageId=${feedData.storageId}`).then((response) => {
      const likeUserIdsResponse = response.data

      setLikeUserIds(likeUserIdsResponse)
    })
  }, [feedData])

  return (
    <>
      <FlexBox
        width={"100%"}
        height={"fit-content"}
        justifyContents="flex-start"
        alignItems="center"
      >
        <Margin direction="row" size={10} />
        {(currentUser.likeFeedIds ?? []).includes(feedData.storageId) ? (
          <FullHeart storageId={feedData.storageId} />
        ) : (
          <HeartIcon storageId={feedData.storageId} />
        )}
        <Margin direction="row" size={15} />
        <CommentIcon
          onClick={() => {
            setSelectedFeedData(feedData)
            setIsCommentModalOpen(true)
          }}
        />
        <Margin direction="row" size={15} />
        <ShareIcon />
      </FlexBox>
      <Margin direction="column" size={15} />
      <FlexBox style={{ paddingLeft: "10px", marginTop: "-10px" }} gap={10}>
        <CustomH6
          style={{ cursor: "pointer", color: isDarkMode ? "white" : "" }}
          onClick={() => {
            setLikeUserList(likeUserIds)
            setIsLikeModalOpen(true)
          }}
        >
          좋아요 {likeUserIds ? likeUserIds.length : "0"}개
        </CustomH6>
        <CustomH6 style={{ color: isDarkMode ? "white" : "" }}>
          댓글 {commentData ? commentData.length : "0"}개
        </CustomH6>
      </FlexBox>
    </>
  )
}
