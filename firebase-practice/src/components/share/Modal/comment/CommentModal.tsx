import { authService, DBService } from "@FireBase"
import { Comment, FeedData, UserInfo, UserData } from "backend/dto"
import {
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import Image from "next/image"
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import styled from "styled-components"
import {
  CommentIcon,
  CustomH4,
  CustomH6,
  FlexBox,
  FullHeart,
  HeartIcon,
  Margin,
  ShareIcon,
} from "ui"
import CommentWrapper from "./CommentWrapper"
import YoungstagramModal from "../YoungstagramModal"
import { v4 } from "uuid"
import getCurrentTime from "lib/getCurrentTime"
import { useRouter } from "next/router"
import { async } from "@firebase/util"
import CommentInput from "./CommentInput"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  feedData: FeedData
  windowSize: number
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

export default function CommentModal({
  isOpen,
  setIsOpen,
  feedData,
  windowSize,
}: Props) {
  const router = useRouter()
  const [commentData, setCommentData] = useState<Comment[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const commentAreaRef = useRef<HTMLDivElement>(null)
  const [userData, setUserData] = useState<UserData>()
  const [likerList, setLikerList] = useState<string[]>([])

  useEffect(() => {
    onSnapshot(doc(DBService, "Comments", `${feedData.storageId}`), (data) => {
      if (data) setCommentData(data.data()?.AllComments)
    })
    onSnapshot(doc(DBService, "users", `${feedData.creator}`), (data) => {
      if (data) setUserData(data.data() as UserData)
    })
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
          <Style.Header about={windowSize < 900 ? "window" : ""}>
            <Image
              width={32}
              height={32}
              style={{ borderRadius: "32px", cursor: "pointer" }}
              src={
                userData?.info.profileImage
                  ? userData.info.profileImage
                  : "/profile.svg"
              }
              onClick={() => {
                router.push(`/profile/${userData?.info.userId}`)
              }}
              alt="profile"
            />
            <Margin direction="row" size={14} />
            <FlexBox column={true}>
              <CustomH4 style={{ color: "black" }}>
                {userData?.info.name}
              </CustomH4>
              <CustomH6>{feedData.location}</CustomH6>
            </FlexBox>
          </Style.Header>
          <Margin direction="column" size={10} />
          <Style.CommentsWrapper about={windowSize < 900 ? "27vh" : "60vh"}>
            <FlexBox
              width={windowSize < 900 ? "90vw" : "50%"}
              height="fit-content"
              style={{ paddingLeft: "15px", flexShrink: 0 }}
            >
              <FlexBox height={32} width={32}>
                <Image
                  width={32}
                  height={32}
                  src={
                    userData?.info.profileImage
                      ? userData?.info.profileImage
                      : "/profile.svg"
                  }
                  alt="profile"
                  onClick={() => {
                    router.push(`/profile/${userData?.info.userId}`)
                  }}
                  style={{ borderRadius: "32px", cursor: "pointer" }}
                />
              </FlexBox>
              <Margin direction="row" size={10} />
              <FlexBox
                column={true}
                width={"fit-content"}
                style={{ paddingRight: "20px" }}
              >
                <Margin direction="column" size={5} />
                <CustomH4>{userData?.info.name}</CustomH4>
                {feedData.desc}
              </FlexBox>
            </FlexBox>
            <Margin direction="column" size={25} style={{ flexShrink: 0 }} />
            {commentData !== undefined &&
              commentData
                .sort(function (a, b) {
                  return Number(a.uploadTime) - Number(b.uploadTime)
                })
                .map((data, index) => {
                  return (
                    <>
                      {index === commentData.length - 1 && (
                        <div ref={commentAreaRef}></div>
                      )}
                      <CommentWrapper
                        key={v4()}
                        commentData={data}
                        storageId={feedData.storageId}
                        windowSize={windowSize}
                      />
                    </>
                  )
                })}
          </Style.CommentsWrapper>
          <Margin direction="column" size={10} />
          <FlexBox
            width={"100%"}
            height={"fit-content"}
            justifyContents="flex-start"
            alignItems="center"
          >
            <Margin direction="row" size={10} />
            {authService.currentUser !== null &&
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
            <CustomH6>좋아요 {likerList.length}개</CustomH6>
            <CustomH6>댓글 {commentData.length}개</CustomH6>
          </FlexBox>
        </FlexBox>
      </FlexBox>
      <CommentInput
        feedData={feedData}
        windowSize={windowSize}
        inputRef={inputRef}
        commentAreaRef={commentAreaRef}
      />
    </YoungstagramModal>
  )
}
