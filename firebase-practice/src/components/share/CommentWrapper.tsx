import { authService, DBService } from "@FireBase"
import { Comment, UserData } from "backend/dto"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import getUserByUid from "lib/getUserByUid"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH4, CustomH5, CustomH6, FlexBox, Margin } from "ui"

type Props = {
  commentData: Comment
  storageId: string
  windowSize: number
}
const Style = {
  Wrapper: styled.div`
    width: ${(props) => props.about};
    height: fit-content;
    align-items: flex-start;
    padding-left: 15px;
    display: flex;
  `,
  ModifyCommentInput: styled.input`
    width: 325px;
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
  windowSize,
}: Props) {
  const router = useRouter()
  const [isModifyMode, setIsModifyMode] = useState<boolean>(false)
  const [newComment, setNewComment] = useState<string>(commentData.comment)
  const [isShowAllComment, setIsShowAllComment] = useState<boolean>(false)

  useEffect(() => {
    const commentRef = doc(DBService, "Comments", storageId)
    getUserByUid(commentData.userId).then(async (data) => {
      if (data) {
        if (commentData.profileImage !== (data as UserData).profileImage) {
          await updateDoc(commentRef, {
            AllComments: arrayRemove({
              comment: commentData.comment,
              commentId: commentData.commentId,
              name: commentData.name,
              profileImage: commentData.profileImage,
              userId: commentData.userId,
              uploadTime: commentData.uploadTime,
            }),
          }).then(async () => {
            await updateDoc(commentRef, {
              AllComments: arrayUnion({
                comment: commentData.comment,
                commentId: commentData.commentId,
                name: commentData.name,
                profileImage: (data as UserData).profileImage,
                userId: commentData.userId,
                uploadTime: commentData.uploadTime,
              }),
            })
          })
        }
        if (commentData.name !== (data as UserData).name) {
          await updateDoc(commentRef, {
            AllComments: arrayRemove({
              comment: commentData.comment,
              commentId: commentData.commentId,
              name: commentData.name,
              profileImage: commentData.profileImage,
              userId: commentData.userId,
              uploadTime: commentData.uploadTime,
            }),
          }).then(async () => {
            await updateDoc(commentRef, {
              AllComments: arrayUnion({
                comment: commentData.comment,
                commentId: commentData.commentId,
                name: (data as UserData).name,
                profileImage: (data as UserData).profileImage,
                userId: commentData.userId,
                uploadTime: commentData.uploadTime,
              }),
            })
          })
        }
      }
    })
  }, [])

  const handleRemoveComment = async () => {
    const commentRef = doc(DBService, "Comments", storageId)
    await updateDoc(commentRef, {
      AllComments: arrayRemove({
        comment: commentData.comment,
        commentId: commentData.commentId,
        name: commentData.name,
        profileImage: commentData.profileImage,
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
          name: commentData.name,
          profileImage: commentData.profileImage,
          userId: commentData.userId,
          uploadTime: commentData.uploadTime,
        }),
      })
    })
  }
  return (
    <>
      <Style.Wrapper about={windowSize < 900 ? "85vw" : "499px"}>
        <FlexBox width={32} height={32}>
          <Image
            width={32}
            height={32}
            style={{ borderRadius: "32px", cursor: "pointer" }}
            src={commentData.profileImage}
            alt="profile"
            onClick={() => {
              router.push(`/profile/${commentData.userId}`)
            }}
            priority
          />
        </FlexBox>
        <Margin direction="row" size={10} />
        <FlexBox
          column={true}
          width="fit-content"
          style={{
            width: windowSize < 900 ? "85vw" : "325px",
            position: "relative",
            wordBreak: "break-all",
          }}
        >
          <Margin direction="column" size={5} />
          <CustomH4>{commentData.name}</CustomH4>
          {isModifyMode ? (
            <FlexBox>
              <Style.ModifyCommentInput
                value={newComment}
                onChange={(event) => {
                  setNewComment(event.target.value)
                }}
                placeholder={commentData.comment}
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
                  {commentData.comment}
                  <Margin direction="row" size={10} />
                  <CustomH6
                    style={{
                      cursor: "pointer",
                      fontWeight: "bolder",
                      color: "black",
                    }}
                    onClick={() => {
                      setIsShowAllComment(false)
                    }}
                  >
                    접기
                  </CustomH6>
                </>
              ) : commentData.comment.length > 12 ? (
                <FlexBox alignItems="center">
                  {commentData.comment.slice(0, 12)}
                  <Margin direction="row" size={5} />
                  <CustomH6
                    style={{
                      cursor: "pointer",
                      fontWeight: "bolder",
                      color: "black",
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      setIsShowAllComment(true)
                    }}
                  >
                    더보기{windowSize < 900 ? "" : "..."}
                  </CustomH6>
                </FlexBox>
              ) : (
                commentData.comment
              )}
            </>
          )}
          {authService.currentUser?.uid === commentData.userId && (
            <FlexBox
              width={"fit-content"}
              height={"fit-content"}
              style={{
                position: "absolute",
                bottom: "-20px",
                right: windowSize < 900 ? "0px" : "-80px",
                cursor: "pointer",
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
        </FlexBox>
      </Style.Wrapper>
      <Margin direction="column" size={25} style={{ flexShrink: 0 }} />
    </>
  )
}
