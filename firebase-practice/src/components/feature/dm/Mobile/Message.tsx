import { DBService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { Message } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"
import MyMessageWrapper from "../MyMessageWrapper"
import OtherMessageWrapper from "../OtherMessageWrapper"
import UserCard from "../UserCard"

type Props = {
  selectedUserId: string
}

const Style = {
  MessageSection: styled.div`
    width: 583px;
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 15;
    border: 1px solid lightgrey;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
    position: relative;
  `,
  MessageList: styled.div`
    width: 100%;
    height: calc(70vh - 120px);
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

  return (
    <Style.MessageSection>
      {/* <FlexBox
        width={"100%"}
        alignItems="center"
        height={60}
        style={{
          borderBottom: selectedUserId ? "1px solid lightgrey" : "",
          position: "sticky",
          top: 0,
          flexShrink: 0,
          zIndex: 2,
          backgroundColor: "white",
        }}
      >
        {selectedUserId && <UserCard userId={`${selectedUserId}`} />}
      </FlexBox> */}
      {selectedUserId && (
        <Style.MessageList>
          {messageData.map((message) => {
            return (
              <>
                {message.userId === currentUserData.info.userId ? (
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
      {/* {selectedUserId && <MessageInput selectedUserId={selectedUserId} />} */}
    </Style.MessageSection>
  )
}
