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
import { SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH4, CustomH6, FlexBox, Margin } from "ui"
import CommentWrapper from "./CommentWrapper"
import YoungstagramModal from "./YoungstagramModal"
import { v4 } from "uuid"
import getCurrentTime from "lib/getCurrentTime"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  imageData: UserImageDataAll
}

const Style = {
  Header: styled.div`
    display: flex;
    height: 70px;
    width: 499px;
    border-bottom: 1px solid lightgrey;
    align-items: center;
    padding-left: 15px;
  `,
  CommentsWrapper: styled.div`
    width: 499px;
    height: 423px;
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
    width: 429px;
    height: 53px;
    border: none;
    padding-left: 15px;
    :focus {
      outline: none;
    }
    ::placeholder {
      color: lightgrey;
    }
  `,
}

export default function CommentModal({ isOpen, setIsOpen, imageData }: Props) {
  const [comment, setComment] = useState<string>("")
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [randomId, setRandomId] = useState<string>(v4())
  const handleCommentSubmit = async () => {
    if (comment.length === 0) {
      alert("댓글은 한글자 이상 작성해야합니다.")
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
  }
  useEffect(() => {
    onSnapshot(doc(DBService, "Comments", imageData.storageId), (doc) => {
      setCommentData(doc.data()?.AllComments)
    })
  }, [])
  return (
    <YoungstagramModal
      width="70vw"
      height="95vh"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"이미지 상세"}
      isPC={true}
    >
      <FlexBox width={"100%"} height={"100%"} style={{ position: "relative" }}>
        <Image src={imageData.imageUrl} width={611} height={611} alt="image" />
        <FlexBox column={true} width={499} height={"auto"}>
          <Style.Header>
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
          <Style.CommentsWrapper>
            <FlexBox
              width={499}
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
              <FlexBox column={true} width={"fit-content"}>
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
                .map((data) => {
                  return (
                    <CommentWrapper
                      key={v4()}
                      commentData={data}
                      storageId={imageData.storageId}
                    />
                  )
                })}
          </Style.CommentsWrapper>
        </FlexBox>
        <FlexBox
          style={{
            position: "absolute",
            bottom: "6%",
            right: "0",
            borderTop: "1px solid lightGrey",
          }}
          width="499px"
        >
          <Style.CommentInput
            value={comment}
            onChange={(event) => {
              setComment(event.target.value)
            }}
            placeholder="댓글 달기..."
          />
          <button
            onClick={handleCommentSubmit}
            style={{
              width: "70px",
              border: "none",
              backgroundColor: "white",
              fontWeight: "bold",
              color: comment.length > 0 ? "#4891ff" : "#d1e3ff",
              cursor: "pointer",
            }}
          >
            게시
          </button>
        </FlexBox>
      </FlexBox>
    </YoungstagramModal>
  )
}
