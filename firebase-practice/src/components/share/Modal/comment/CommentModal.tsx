import { authService, DBService } from "@FireBase"
import { Comment, FeedData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import React, { SetStateAction, useEffect, useRef, useState } from "react"
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
import YoungstagramModal from "../YoungstagramModal"
import CommentInput from "./CommentInput"
import useWindowSize from "lib/useWindowSize"
import CommentList from "./CommentList"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  feedData: FeedData
}

const Style = {
  Wrapper: styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `,
  ImgWrapper: styled.div`
    width: 50%;
    height: 100%;
    @media (max-width: 900px) {
      width: 100%;
      height: 30vh;
    }
  `,
  Img: styled.img`
    width: 100%;
    height: 100%;
  `,
  DetailContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    height: auto;
    @media (max-width: 900px) {
      width: 95vw;
    }
  `,
  IconContainer: styled.div`
    display: flex;
    width: 100%;
    height: fit-content;
    justify-content: flex-start;
    align-items: center;
  `,
}

export default function CommentModal({ isOpen, setIsOpen, feedData }: Props) {
  const [commentData, setCommentData] = useState<Comment[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const commentAreaRef = useRef<HTMLDivElement>(null)
  const [likerList, setLikerList] = useState<string[]>([])
  const windowSize = useWindowSize()

  useEffect(() => {
    if (feedData.storageId !== "") {
      onSnapshot(doc(DBService, "like", `${feedData.storageId}`), (data) => {
        if (data) setLikerList(data.data()?.likerList)
      })
      onSnapshot(
        doc(DBService, "Comments", `${feedData.storageId}`),
        (data) => {
          if (data) setCommentData(data.data()?.AllComments)
        },
      )
    }
  }, [feedData.storageId, feedData.creator])
  return (
    <YoungstagramModal
      width={windowSize < 900 ? "95vw" : "70vw"}
      height={windowSize < 900 ? "90vh" : "95vh"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"이미지 상세"}
    >
      <Style.Wrapper>
        <Style.ImgWrapper>
          <Style.Img src={feedData.imageUrl} alt="image" />
        </Style.ImgWrapper>
        <Style.DetailContainer>
          <CommentList feedData={feedData} commentAreaRef={commentAreaRef} />
          <Style.IconContainer>
            <Margin direction="row" size={10} />
            {likerList !== undefined &&
            authService.currentUser !== null &&
            likerList.includes(authService.currentUser.uid) ? (
              <FullHeart storgateId={feedData.storageId} />
            ) : (
              <HeartIcon storgateId={feedData.storageId} />
            )}

            <Margin direction="row" size={15} />
            <CommentIcon
              onClick={() => {
                if (inputRef.current !== null) inputRef.current.focus()
              }}
            />
            <Margin direction="row" size={15} />
            <ShareIcon />
          </Style.IconContainer>
          <Margin direction="column" size={10} />
          <FlexBox style={{ paddingLeft: "10px" }} gap={15}>
            {likerList !== undefined ? (
              <CustomH6>좋아요 {likerList.length}개</CustomH6>
            ) : (
              <CustomH6>좋아요 0개</CustomH6>
            )}
            {commentData !== undefined ? (
              <CustomH6>댓글 {commentData.length}개</CustomH6>
            ) : (
              <CustomH6>댓글 0개</CustomH6>
            )}
          </FlexBox>
        </Style.DetailContainer>
      </Style.Wrapper>
      <CommentInput
        feedData={feedData}
        inputRef={inputRef}
        commentAreaRef={commentAreaRef}
      />
    </YoungstagramModal>
  )
}
