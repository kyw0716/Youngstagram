import { authService, DBService } from "@FireBase"
import { Comment, UserImageDataAll } from "backend/dto"
import {
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import Image from "next/image"
import React, { SetStateAction, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import {
  CommentIcon,
  CustomH4,
  CustomH6,
  FlexBox,
  HeartIcon,
  Margin,
  ShareIcon,
} from "ui"
import CommentWrapper from "./CommentWrapper"
import YoungstagramModal from "./YoungstagramModal"
import { v4 } from "uuid"
import getCurrentTime from "lib/getCurrentTime"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  imageData: UserImageDataAll
  windowSize: number
}

const Style = {
  Header: styled.div`
    display: flex;
    height: ${(props) => (props.about ? "50px" : "70px")};
    width: ${(props) => (props.about ? "95vw" : "499px")};
    border-bottom: 1px solid lightgrey;
    align-items: center;
    padding-left: 15px;
  `,
  CommentsWrapper: styled.div`
    width: ${(props) => (props.about ? "95vw" : "499px")};
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
    width: ${(props) => (props.about ? props.about : "429px")};
    height: 53px;
    border: none;
    padding-left: 15px;
    font-size: 16px;
    background-color: none;
    :focus {
      outline: none;
    }
    ::placeholder {
      color: lightgrey;
    }
    :-webkit-appearance {
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
  imageData,
  windowSize,
}: Props) {
  const [comment, setComment] = useState<string>("")
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [randomId, setRandomId] = useState<string>(v4())
  const inputRef = useRef<HTMLInputElement>(null)
  const commentAreaRef = useRef<HTMLDivElement>(null)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const handleCommentSubmit = async () => {
    setIsSubmit(true)
    if (comment.length === 0) {
      alert("댓글은 한글자 이상 작성해야합니다.")
      setIsSubmit(false)
      return
    }
    const commentToFirestore: Comment = {
      name: `${authService.currentUser?.displayName}`,
      userId: `${authService.currentUser?.uid}`,
      commentId: randomId,
      comment: comment,
      profileImage: `${authService.currentUser?.photoURL}`,
      uploadTime: getCurrentTime(),
    }
    const commentRef = doc(DBService, "Comments", imageData.storageId)
    await updateDoc(commentRef, {
      AllComments: arrayUnion(commentToFirestore),
    })
      .catch(async (error) => {
        if (error.code === "not-found") {
          await setDoc(commentRef, {
            AllComments: [commentToFirestore],
          })
        }
      })
      .then(() => {
        setComment("")
        setRandomId(v4())
      })
    commentAreaRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    })
    setIsSubmit(false)
  }
  useEffect(() => {
    onSnapshot(doc(DBService, "Comments", imageData.storageId), (doc) => {
      setCommentData(doc.data()?.AllComments)
    })
  }, [])
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
          width={windowSize < 900 ? "100%" : 611}
          height={windowSize < 900 ? "30vh" : "100%"}
        >
          <Style.Img src={imageData.imageUrl} alt="image" />
        </FlexBox>
        <FlexBox
          column={true}
          width={windowSize < 900 ? "95vw" : 499}
          height={"auto"}
        >
          <Style.Header about={windowSize < 900 ? "window" : ""}>
            <Image
              width={32}
              height={32}
              style={{ borderRadius: "32px" }}
              src={
                imageData.creator.profileImage
                  ? imageData.creator.profileImage
                  : "/profile.svg"
              }
              alt="profile"
            />
            <Margin direction="row" size={14} />
            <FlexBox column={true}>
              <CustomH4 style={{ color: "black" }}>
                {imageData.creator.name}
              </CustomH4>
              <CustomH6>{imageData.location}</CustomH6>
            </FlexBox>
          </Style.Header>
          <Margin direction="column" size={10} />
          <Style.CommentsWrapper about={windowSize < 900 ? "30vh" : "423px"}>
            <FlexBox
              width={windowSize < 900 ? "90vw" : 499}
              height="fit-content"
              style={{ paddingLeft: "15px", flexShrink: 0 }}
            >
              <FlexBox height={32} width={32}>
                <Image
                  width={32}
                  height={32}
                  src={
                    imageData.creator.profileImage
                      ? imageData.creator.profileImage
                      : "/profile.svg"
                  }
                  alt="profile"
                  style={{ borderRadius: "32px" }}
                />
              </FlexBox>
              <Margin direction="row" size={10} />
              <FlexBox
                column={true}
                width={"fit-content"}
                style={{ paddingRight: "20px" }}
              >
                <Margin direction="column" size={5} />
                <CustomH4>{imageData.creator.name}</CustomH4>
                {imageData.desc}
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
                        storageId={imageData.storageId}
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
            <HeartIcon />
            <Margin direction="row" size={15} />
            <CommentIcon
              onClick={() => {
                if (inputRef.current !== null) inputRef.current.focus()
              }}
            />
            <Margin direction="row" size={15} />
            <ShareIcon />
          </FlexBox>
        </FlexBox>
      </FlexBox>
      <Style.CommentInputArea
        about={windowSize < 900 ? "95vw" : "499px"}
        onSubmit={(event) => {
          event.preventDefault()
          handleCommentSubmit()
        }}
      >
        <Style.CommentInput
          value={comment}
          onChange={(event) => {
            setComment(event.target.value)
          }}
          about={windowSize < 900 ? "80vw" : "429px"}
          placeholder="댓글 달기..."
          ref={inputRef}
        />
        {isSubmit || (
          <button
            onClick={handleCommentSubmit}
            style={{
              width: windowSize < 900 ? "15vw" : "70px",
              border: "none",
              backgroundColor: "white",
              fontWeight: "bold",
              color: comment.length > 0 ? "#4891ff" : "#d1e3ff",
              cursor: "pointer",
            }}
          >
            게시
          </button>
        )}
      </Style.CommentInputArea>
    </YoungstagramModal>
  )
}
