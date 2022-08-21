import MessageInput from "@feature/dm/MessageInput"
import { authService, DBService } from "@FireBase"
import { Message } from "backend/dto"
import Layout from "components/layout"
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import getCurrentTime from "lib/getCurrentTime"
import { useState } from "react"
import { v4 } from "uuid"

export default function Test() {
  const [message, setMessage] = useState<string>("")
  const [randomId, setRandomId] = useState<string>(v4())
  const handleSendMessage = async () => {
    const uploadTime = getCurrentTime()
    const myMessageRef = doc(
      DBService,
      `${authService.currentUser?.uid}`,
      `4Sa2zzH9hJfdqO3KW3ZkPBMEJck1`,
    )
    const otherMessageRef = doc(
      DBService,
      "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
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
    <Layout>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSendMessage()
        }}
      >
        <input
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
          }}
          placeholder={"메시지를 입력해주세요"}
        />
        <button>제출</button>
      </form>
      <MessageInput selectedUserId="" />
    </Layout>
  )
}
