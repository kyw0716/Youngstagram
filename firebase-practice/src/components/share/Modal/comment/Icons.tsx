import { authService, DBService } from "@FireBase"
import { darkModeState } from "@share/recoil/recoilList"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
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
  storageId: string
  inputRef: React.RefObject<HTMLInputElement>
}

const IconContainer = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  justify-content: flex-start;
  align-items: center;
`

export default function Icons({ storageId, inputRef }: Props) {
  const [likerList, setLikerList] = useState<string[]>([])
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [isCurrentUserLiked, setIsCurrentUserLiked] = useState<boolean>(false)

  useEffect(() => {
    onSnapshot(doc(DBService, "like", `${storageId}`), (data) => {
      if (data) setLikerList(data.data()?.likerList)
    })
    onSnapshot(doc(DBService, "Comments", `${storageId}`), (data) => {
      if (data) setCommentData(data.data()?.AllComments)
    })
  }, [storageId])

  useEffect(() => {
    if (likerList.includes(`${authService.currentUser?.uid}`))
      setIsCurrentUserLiked(true)
    else setIsCurrentUserLiked(false)
  }, [authService.currentUser, likerList])

  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <>
      <IconContainer>
        <Margin direction="row" size={10} />
        {isCurrentUserLiked ? (
          <FullHeart storgateId={storageId} />
        ) : (
          <HeartIcon storgateId={storageId} />
        )}
        <Margin direction="row" size={15} />
        <CommentIcon
          onClick={() => {
            if (inputRef.current !== null) inputRef.current.focus()
          }}
        />
        <Margin direction="row" size={15} />
        <ShareIcon />
      </IconContainer>
      <Margin direction="column" size={10} />
      <FlexBox style={{ paddingLeft: "10px" }} gap={15}>
        <CustomH6 style={{ color: isDarkMode ? "white" : "" }}>
          좋아요 {likerList ? likerList.length : "0"}개
        </CustomH6>
        <CustomH6 style={{ color: isDarkMode ? "white" : "" }}>
          댓글 {commentData ? commentData.length : "0"}개
        </CustomH6>
      </FlexBox>
    </>
  )
}
