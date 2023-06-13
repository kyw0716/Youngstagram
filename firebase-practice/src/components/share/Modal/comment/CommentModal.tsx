import { FeedItem } from "backend/dto"
import React, { SetStateAction, useEffect, useRef } from "react"
import styled from "styled-components"
import YoungstagramModal from "../YoungstagramModal"
import CommentInput from "./Input"
import useWindowSize from "lib/hooks/useWindowSize"
import CommentList from "./CommentList"
import Icons from "./Icons"
import Loading from "@share/Loading/Loading"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  feedData: FeedItem
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
}

export default function CommentModal({ isOpen, setIsOpen, feedData }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const commentAreaRef = useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize()

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
          {feedData.imageUrl ? (
            <Style.Img src={feedData.imageUrl} alt="image" />
          ) : (
            <Loading width={"100%"} height={"100%"} />
          )}
        </Style.ImgWrapper>
        <Style.DetailContainer>
          <CommentList feedData={feedData} commentAreaRef={commentAreaRef} />
          <Icons storageId={feedData.storageId} inputRef={inputRef} />
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
