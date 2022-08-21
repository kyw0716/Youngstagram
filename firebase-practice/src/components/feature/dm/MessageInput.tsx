import { authService, DBService } from "@FireBase"
import { Message } from "backend/dto"
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import getCurrentTime from "lib/getCurrentTime"
import { useState } from "react"
import styled from "styled-components"
import { v4 } from "uuid"

type Props = {
  selectedUserId: string
}

const Style = {
  DMForm: styled.form`
    width: fit-content;
    display: flex;
    height: 60px;
    align-items: center;
    position: sticky;
    bottom: 0;
    z-index: 3;
  `,
  DMInput: styled.input`
    width: 500px;
    height: 60px;
    border: none;
    -webkit-appearance: none;
    font-size: 18px;
    padding-left: 15px;
    :focus {
      outline: none;
    }
    ::-webkit-input-placeholder {
      color: lightgrey;
    }
  `,
  SubmitButton: styled.div`
    width: 83px;
    height: 60px;
    font-size: 18px;
    color: ${(props) => props.about};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    cursor: pointer;
  `,
}

export default function MessageInput({ selectedUserId }: Props) {
  const [message, setMessage] = useState<string>("")
  const [randomId, setRandomId] = useState<string>(v4())
  const handleSendMessage = async () => {
    const uploadTime = getCurrentTime()
    const myMessageRef = doc(
      DBService,
      `${authService.currentUser?.uid}`,
      `${selectedUserId}`,
    )
    const otherMessageRef = doc(
      DBService,
      `${selectedUserId}`,
      `${authService.currentUser?.uid}`,
    )
    const messageData: Message = {
      userId: `${authService.currentUser?.uid}`,
      message: message,
      messageId: randomId,
      uploadTime: uploadTime,
    }
    await updateDoc(myMessageRef, {
      message: arrayUnion(messageData),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        await setDoc(myMessageRef, {
          message: [messageData],
        })
      }
    })
    await updateDoc(otherMessageRef, {
      message: arrayUnion(messageData),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        await setDoc(otherMessageRef, {
          message: [messageData],
        })
      }
    })
    setRandomId(v4())
  }
  return (
    <Style.DMForm
      onSubmit={(event) => {
        event.preventDefault()
        setMessage("")
        handleSendMessage()
      }}
    >
      <Style.DMInput
        value={message}
        onChange={(event) => {
          setMessage(event.target.value)
        }}
        placeholder="메시지를 입력해주세요"
      />
      <Style.SubmitButton
        about={message.length > 0 ? "#4891ff" : "#d1e3ff"}
        onClick={() => {
          setMessage("")
          handleSendMessage()
        }}
      >
        게시
      </Style.SubmitButton>
    </Style.DMForm>
  )
}
