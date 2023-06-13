import { authService, DBService } from "@FireBase"
import { darkModeState } from "@share/recoil/recoilList"
import { Comment, FeedItem } from "backend/dto"
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import getCurrentTime from "lib/getCurrentTime"
import { useCallback, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { v4 } from "uuid"

type Props = {
  feedData: FeedItem
  inputRef: React.RefObject<HTMLInputElement>
  commentAreaRef: React.RefObject<HTMLDivElement>
}

const Style = {
  CommentInput: styled.input`
    appearance: none;
    width: 80%;
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
    @media (max-width: 900px) {
      width: 80vw;
    }
  `,
  SubmitButton: styled.button`
    appearance: none;
    width: 20%;
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
    @media (max-width: 900px) {
      width: 15vw;
    }
  `,
  CommentInputArea: styled.form`
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px solid lightgrey;
    display: flex;
    justify-content: space-between;
    width: 50%;
    @media (max-width: 900px) {
      width: 95vw;
    }
  `,
}

export default function CommentInput({
  feedData,
  inputRef,
  commentAreaRef,
}: Props) {
  const [comment, setComment] = useState<string>("")
  const [randomId, setRandomId] = useState<string>(v4())
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const isDarkMode = useRecoilValue(darkModeState)

  const handleCommentSubmit = async () => {
    setIsSubmit(true)
    setComment("")
    if (comment.length === 0) {
      alert("댓글은 한글자 이상 작성해야합니다.")
      setIsSubmit(false)
      return
    }
    const commentToFirestore: Comment = {
      userId: `${authService.currentUser?.uid}`,
      commentId: randomId,
      comment: comment,
      uploadTime: getCurrentTime(),
    }
    const commentRef = doc(DBService, "Comments", feedData.storageId)
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
        setRandomId(v4())
      })
    commentAreaRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    })
    setIsSubmit(false)
  }
  const handleInputOnChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setComment(event.target.value)
    }, [])

  return (
    <Style.CommentInputArea
      onSubmit={(event) => {
        event.preventDefault()
        handleCommentSubmit()
      }}
    >
      <Style.CommentInput
        value={comment}
        onChange={handleInputOnChange}
        placeholder="댓글 달기..."
        ref={inputRef}
        style={{ color: isDarkMode ? "white" : "" }}
      />
      {isSubmit || (
        <Style.SubmitButton
          onClick={handleCommentSubmit}
          color={comment.length > 0 ? "#4891ff" : "#d1e3ff"}
        >
          게시
        </Style.SubmitButton>
      )}
    </Style.CommentInputArea>
  )
}
