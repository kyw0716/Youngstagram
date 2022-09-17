import { feedDataState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import React, { SetStateAction } from "react"
import { useSetRecoilState } from "recoil"
import {
  CommentIcon,
  FlexBox,
  FullHeart,
  HeartIcon,
  Margin,
  ShareIcon,
} from "ui"

type Props = {
  isCurrentUserLike: boolean
  feedData: FeedData
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function Icons({
  isCurrentUserLike,
  setIsCommentModalOpen,
  feedData,
}: Props) {
  const setSelectedFeedData = useSetRecoilState(feedDataState)
  return (
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
  )
}
