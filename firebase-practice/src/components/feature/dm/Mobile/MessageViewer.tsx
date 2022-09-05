import { DBService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { Message } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { Margin } from "ui"
import MyMessageWrapper from "../MyMessageWrapper"
import OtherMessageWrapper from "../OtherMessageWrapper"

type Props = {
  selectedUserId: string
}

const Style = {
  MessageSection: styled.div`
    width: 100%;
    height: calc(100vh - 180px);
    display: flex;
    flex-direction: column;
    gap: 15;
    border-bottom: 1px solid lightgrey;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
    position: relative;
    margin-bottom: 60px;
  `,
  MessageList: styled.div`
    width: 100%;
    height: calc(100vh - 180px);
    padding: 10px 0px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    ::-webkit-scrollbar {
      display: none;
    }
  `,
}

export default function MessageViewer({ selectedUserId }: Props) {
  const currentUserData = useRecoilValue(userDataState)
  const [messageData, setMessageData] = useState<Message[]>([])
  const DMRef = useRef<HTMLDivElement>(null)

  console.log(messageData)

  useEffect(() => {
    if (selectedUserId === "") {
      setMessageData([])
      return
    }
    onSnapshot(
      doc(DBService, currentUserData.info.userId, selectedUserId),
      (data) => {
        if (data.data()?.message)
          setMessageData(data.data()?.message as Message[])
        else setMessageData([])
      },
    )
  }, [selectedUserId])
  useEffect(() => {
    if (DMRef.current === null) return
    DMRef.current.scrollIntoView({
      block: "start",
      behavior: "auto",
    })
  }, [messageData.length])

  return (
    <Style.MessageSection>
      {selectedUserId && (
        <Style.MessageList>
          {messageData.map((message) => {
            return (
              <>
                {message.userId === currentUserData.info.userId &&
                currentUserData !== undefined ? (
                  <MyMessageWrapper messageData={message} />
                ) : (
                  <OtherMessageWrapper messageData={message} />
                )}
                <Margin
                  direction="column"
                  size={15}
                  style={{ flexShrink: 0 }}
                />
              </>
            )
          })}
          <div ref={DMRef}></div>
        </Style.MessageList>
      )}
    </Style.MessageSection>
  )
}
