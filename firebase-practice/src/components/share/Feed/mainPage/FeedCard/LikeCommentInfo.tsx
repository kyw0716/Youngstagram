import { authService, DBService } from "@FireBase"
import FollowListModal from "@share/Modal/follow/FollowListModal"
import { userDataState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import React, { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { CustomH6, FlexBox } from "ui"

type Props = {
  feedData: FeedData
  setIsCurrentUserLike: React.Dispatch<SetStateAction<boolean>>
}

export default function LikeCommentInfo({
  feedData,
  setIsCurrentUserLike,
}: Props) {
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [likerList, setLikerList] = useState<string[]>([])
  const [isLikerListModalOpen, setIsLikerLIstModalOpen] =
    useState<boolean>(false)
  const currentUser = useRecoilValue(userDataState)

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
    <FlexBox style={{ paddingLeft: "10px", marginTop: "-10px" }} gap={10}>
      <FollowListModal
        userList={likerList}
        isOpen={isLikerListModalOpen}
        setIsOpen={setIsLikerLIstModalOpen}
        title={"좋아요"}
      />
      {likerList !== undefined ? (
        <CustomH6
          style={{ cursor: "pointer" }}
          onClick={() => {
            setIsLikerLIstModalOpen(true)
          }}
        >
          좋아요 {likerList.length}개
        </CustomH6>
      ) : (
        <CustomH6>좋아요 0개</CustomH6>
      )}
      {commentData !== undefined ? (
        <CustomH6>댓글 {commentData.length}개</CustomH6>
      ) : (
        <CustomH6>댓글 0개</CustomH6>
      )}
    </FlexBox>
  )
}
