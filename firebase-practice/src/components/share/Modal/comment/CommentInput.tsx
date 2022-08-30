import { authService, DBService } from "@FireBase"
import { Comment, FeedData } from "backend/dto"
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import getCurrentTime from "lib/getCurrentTime"
import useWindowSize from "lib/useWindowSize"
import { useCallback, useState } from "react"
import styled from "styled-components"
import { v4 } from "uuid"

type Props = {
  feedData: FeedData
  inputRef: React.RefObject<HTMLInputElement>
  commentAreaRef: React.RefObject<HTMLDivElement>
}

const Style = {
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
  CommentInputArea: styled.form`
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px solid lightgrey;
    display: flex;
    justify-content: space-between;
    width: ${(props) => props.about};
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
  const windowSize = useWindowSize()

  const handleCommentSubmit = async () => {
    setIsSubmit(true)
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
        setComment("")
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
      about={windowSize < 900 ? "95vw" : "50%"}
      onSubmit={(event) => {
        event.preventDefault()
        handleCommentSubmit()
      }}
    >
      <Style.CommentInput
        value={comment}
        onChange={handleInputOnChange}
        about={windowSize < 900 ? "80vw" : "80%"}
        placeholder="댓글 달기..."
        ref={inputRef}
      />
      {isSubmit || (
        <Style.SubmitButton
          onClick={handleCommentSubmit}
          about={windowSize < 900 ? "15vw" : "20%"}
          color={comment.length > 0 ? "#4891ff" : "#d1e3ff"}
        >
          게시
        </Style.SubmitButton>
      )}
    </Style.CommentInputArea>
  )
}
