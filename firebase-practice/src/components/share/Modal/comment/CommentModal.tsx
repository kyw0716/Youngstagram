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
  Header: styled.div`
    display: flex;
    height: ${(props) => (props.about ? "50px" : "70px")};
    width: ${(props) => (props.about ? "95vw" : "100%")};
    border-bottom: 1px solid lightgrey;
    align-items: center;
    padding-left: 15px;
  `,
  CommentsWrapper: styled.div`
    width: ${(props) => (props.about ? "95vw" : "50%")};
    height: ${(props) => (props.about ? props.about : "423px")};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow-y: scroll;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      display: none;
    }
  `,
  CommentInput: styled.input`
    appearance: none;
    width: ${(props) => (props.about ? props.about : "429px")};
    height: 53px;
    border: none;
    border-radius: none;
    padding-left: 15px;
    font-size: 16px;
    background-color: inherit;
    :focus {
      outline: none;
    }
    ::placeholder {
      color: lightgrey;
    }
    :-webkit-appearance {
      display: none;
    }
    :-moz-appearance {
      display: none;
    }
  `,
  SubmitButton: styled.button`
    appearance: none;
    width: ${(props) => props.about};
    border: none;
    background-color: inherit;
    font-weight: bold;
    color: ${(props) => props.color};
    cursor: pointer;
    :-webkit-appearance {
      display: none;
    }
    :-moz-appearance {
      display: none;
    }
  `,
  Img: styled.img`
    width: 100%;
    height: 100%;
  `,
  CommentInputArea: styled.form`
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px solid lightgrey;
    display: flex;
    width: ${(props) => props.about};
  `,
}

export default function CommentModal({ isOpen, setIsOpen, feedData }: Props) {
  const [commentData, setCommentData] = useState<Comment[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const commentAreaRef = useRef<HTMLDivElement>(null)
  const [likerList, setLikerList] = useState<string[]>([])
  const windowSize = useWindowSize()

  useEffect(() => {
    onSnapshot(doc(DBService, "like", `${feedData.storageId}`), (data) => {
      if (data) setLikerList(data.data()?.likerList)
    })
  }, [feedData.storageId, feedData.creator])
  return (
    <YoungstagramModal
      width={windowSize < 900 ? "95vw" : "70vw"}
      height={windowSize < 900 ? "90vh" : "95vh"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"이미지 상세"}
      isPC={true}
    >
      <FlexBox
        width={"100%"}
        height={"100%"}
        style={{ position: "relative" }}
        column={windowSize < 900 ? true : false}
      >
        <FlexBox
          width={windowSize < 900 ? "100%" : "50%"}
          height={windowSize < 900 ? "30vh" : "100%"}
        >
          <Style.Img src={feedData.imageUrl} alt="image" />
        </FlexBox>
        <FlexBox
          column={true}
          width={windowSize < 900 ? "95vw" : "50%"}
          height={"auto"}
        >
          <CommentList feedData={feedData} commentAreaRef={commentAreaRef} />
          <FlexBox
            width={"100%"}
            height={"fit-content"}
            justifyContents="flex-start"
            alignItems="center"
          >
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
          </FlexBox>
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
        </FlexBox>
      </FlexBox>
      <CommentInput
        feedData={feedData}
        inputRef={inputRef}
        commentAreaRef={commentAreaRef}
      />
    </YoungstagramModal>
  )
}
