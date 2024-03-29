import { DBService } from "@FireBase"
import {
  darkModeState,
  feedDataState,
  userDataState,
  userListState,
} from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
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
  feedData: FeedData
  setIsLikeModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function LikeCommentInfo({
  feedData,
  setIsLikeModalOpen,
  setIsCommentModalOpen,
}: Props) {
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [likerList, setLikerList] = useState<string[]>([])
  const currentUser = useRecoilValue(userDataState)

  const setLikeUserList = useSetRecoilState(userListState)
  const setSelectedFeedData = useSetRecoilState(feedDataState)

  const isDarkMode = useRecoilValue(darkModeState)
  const [isCurrentUserLike, setIsCurrentUserLike] = useState<boolean>(false)

  useEffect(() => {
    onSnapshot(doc(DBService, "Comments", `${feedData.storageId}`), (doc) => {
      setCommentData(doc.data()?.AllComments)
    })
    onSnapshot(doc(DBService, "like", `${feedData.storageId}`), (doc) => {
      setLikerList(doc.data()?.likerList)
    })
  }, [feedData])

  useEffect(() => {
    if (!likerList) return
    if (!currentUser) return
    if (currentUser.info.userId === "") return
    if (likerList.includes(currentUser.info.userId)) setIsCurrentUserLike(true)
    else {
      setIsCurrentUserLike(false)
    }
  }, [likerList, currentUser])

  return (
    <>
      <FlexBox
        width={"100%"}
        height={"fit-content"}
        justifyContents="flex-start"
        alignItems="center"
      >
        <Margin direction="row" size={10} />
        {isCurrentUserLike ? (
          <FullHeart storgateId={feedData.storageId} />
        ) : (
          <HeartIcon storgateId={feedData.storageId} />
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
            setIsLikeModalOpen(true)
            setLikeUserList(likerList)
          }}
        >
          좋아요 {likerList ? likerList.length : "0"}개
        </CustomH6>
        <CustomH6 style={{ color: isDarkMode ? "white" : "" }}>
          댓글 {commentData ? commentData.length : "0"}개
        </CustomH6>
      </FlexBox>
    </>
  )
}
