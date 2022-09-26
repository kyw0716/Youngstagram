import { authService, DBService } from "@FireBase"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { Comment, UserData } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { ProfileIcon } from "icons"
import Image from "next/image"
import { useRouter } from "next/router"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH4, CustomH5, CustomH6, FlexBox, Margin } from "ui"

type Props = {
  commentData: Comment
  storageId: string
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}
const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: fit-content;
    align-items: flex-start;
    padding-left: 15px;
    display: flex;
    @media (max-width: 900px) {
      width: 85vw;
    }
  `,
  CommentArea: styled.div`
    display: flex;
    flex-direction: column;
    width: fit-content;
    position: relative;
    word-break: break-all;
    @media (max-width: 900px) {
      width: 85vw;
    }
  `,
  ModifyCommentInput: styled.input`
    width: 200px;
    height: 30px;
    border: none;
    border-bottom: 1px solid lightgrey;
    ::placeholder {
      color: lightgrey;
    }
    :focus {
      outline: none;
    }
  `,
}

export default function CommentWrapper({
  commentData,
  storageId,
  setIsOpen,
}: Props) {
  const router = useRouter()
  const [isModifyMode, setIsModifyMode] = useState<boolean>(false)
  const [newComment, setNewComment] = useState<string>(commentData.comment)
  const [isShowAllComment, setIsShowAllComment] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData>()
  const currentUserData = useRecoilValue(userDataState)
  const [routingPath, setRoutingPath] = useState<string>("")
  const isDarkMode = useRecoilValue(darkModeState)

  useEffect(() => {
    const userInfoRef = doc(DBService, "users", commentData.userId)
    onSnapshot(userInfoRef, (docData) => {
      if (docData) {
        setUserData(docData.data() as UserData)
      }
    })
  }, [])
  useEffect(() => {
    if (routingPath !== "") {
      router.replace(routingPath)
      setIsOpen(false)
    }
  }, [routingPath])

  const handleRemoveComment = async () => {
    const commentRef = doc(DBService, "Comments", storageId)
    await updateDoc(commentRef, {
      AllComments: arrayRemove({
        comment: commentData.comment,
        commentId: commentData.commentId,
        userId: commentData.userId,
        uploadTime: commentData.uploadTime,
      }),
    }).catch((error) => console.log(error.code))
  }
  const handleModifyComment = async () => {
    if (newComment.length === 0) {
      alert("수정될 댓글은 최소 1글자 이상 작성해야합니다.")
      return
    }
    const commentRef = doc(DBService, "Comments", storageId)
    handleRemoveComment().then(async () => {
      await updateDoc(commentRef, {
        AllComments: arrayUnion({
          comment: newComment,
          commentId: commentData.commentId,
          userId: commentData.userId,
          uploadTime: commentData.uploadTime,
        }),
      })
    })
  }
  return (
    <>
      <Style.Wrapper>
        <FlexBox width={32} height={32} style={{ flexShrink: 0 }}>
          {userData?.info.profileImage ? (
            <Image
              width={32}
              height={32}
              style={{ borderRadius: "32px", cursor: "pointer" }}
              src={userData?.info.profileImage}
              alt="profile"
              onClick={() => {
                if (userData?.info.userId === currentUserData.info.userId) {
                  setRoutingPath(`/mypage`)
                  return
                }
                setRoutingPath(`/profile/${userData?.info.userId}`)
              }}
            />
          ) : (
            <ProfileIcon
              width={32}
              height={32}
              onClick={() => {
                if (userData?.info.userId === currentUserData.info.userId) {
                  router.push(`/mypage`)
                  return
                }
                router.push(`/profile/${userData?.info.userId}`)
              }}
            />
          )}
        </FlexBox>
        <Margin direction="row" size={10} />
        <Style.CommentArea>
          <Margin direction="column" size={5} />
          <FlexBox width={"fit-content"}>
            <CustomH4
              style={{ color: isDarkMode ? "white" : "" }}
            >{`${userData?.info.name}`}</CustomH4>
          </FlexBox>
          {isModifyMode ? (
            <FlexBox>
              <Style.ModifyCommentInput
                value={newComment}
                onChange={(event) => {
                  setNewComment(event.target.value)
                }}
                placeholder={commentData.comment}
                style={
                  isDarkMode ? { backgroundColor: "black", color: "white" } : {}
                }
              />
              <Margin direction="row" size={5} />
              <FlexBox
                width={30}
                height={30}
                alignItems="flex-end"
                justifyContents="center"
                style={{
                  color: newComment.length > 0 ? "#4891ff" : "#d1e3ff",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onClick={handleModifyComment}
              >
                게시
              </FlexBox>
            </FlexBox>
          ) : (
            <>
              {isShowAllComment ? (
                <>
                  <FlexBox
                    width={"fit-content"}
                    style={{ color: isDarkMode ? "white" : "" }}
                  >
                    {commentData.comment}
                  </FlexBox>
                  <Margin direction="row" size={10} />
                  <CustomH6
                    style={{
                      cursor: "pointer",
                      fontWeight: "bolder",
                      color: isDarkMode ? "white" : "black",
                    }}
                    onClick={() => {
                      setIsShowAllComment(false)
                    }}
                  >
                    접기
                  </CustomH6>
                </>
              ) : commentData.comment.length > 12 ? (
                <FlexBox
                  alignItems="center"
                  width={"fit-content"}
                  style={{ color: isDarkMode ? "white" : "" }}
                >
                  {commentData.comment.slice(0, 12)}
                  <Margin direction="row" size={5} />
                  <CustomH6
                    style={{
                      cursor: "pointer",
                      fontWeight: "bolder",
                      color: isDarkMode ? "white" : "black",
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      setIsShowAllComment(true)
                    }}
                  >
                    더보기
                  </CustomH6>
                </FlexBox>
              ) : (
                <FlexBox style={{ color: isDarkMode ? "white" : "" }}>
                  {commentData.comment}
                </FlexBox>
              )}
            </>
          )}
          {authService.currentUser?.uid === commentData.userId && (
            <FlexBox
              width={"max-content"}
              height={"fit-content"}
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "0px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <CustomH5
                onClick={() => {
                  setIsModifyMode((current) => !current)
                  if (isModifyMode) setNewComment("")
                  if (!isModifyMode) setNewComment(commentData.comment)
                }}
              >
                {isModifyMode ? "취소" : "수정"}
              </CustomH5>
              <Margin direction="row" size={5} />
              <CustomH5 style={{ color: "red" }} onClick={handleRemoveComment}>
                삭제
              </CustomH5>
            </FlexBox>
          )}
        </Style.CommentArea>
      </Style.Wrapper>
      <Margin direction="column" size={25} style={{ flexShrink: 0 }} />
    </>
  )
}
