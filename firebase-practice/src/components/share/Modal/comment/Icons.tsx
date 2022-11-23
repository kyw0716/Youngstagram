import { authService } from "@FireBase"
import { darkModeState } from "@share/recoil/recoilList"
import axios from "axios"
import { Comment } from "backend/dto"
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
    axios<string[]>({
      method: "GET",
      url: `/api/like?storageId=${storageId}`,
    }).then((response) => {
      setLikerList(response.data)
    })

    axios<Comment[]>({
      method: "GET",
      url: `/api/like?storageId=${storageId}`,
    }).then((response) => {
      setCommentData(response.data)
    })
  }, [storageId])

  useEffect(() => {
    if (
      likerList !== undefined &&
      likerList.includes(`${authService.currentUser?.uid}`)
    )
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
