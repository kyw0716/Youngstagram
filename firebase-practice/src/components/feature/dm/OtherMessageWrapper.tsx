import { DBService } from "@FireBase"
import { Message, UserData, UserInfo } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import Image from "next/image"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"

type Props = {
  messageData: Message
}

const Style = {
  Wrapper: styled.div`
    width: 400px;
    height: fill;
    display: flex;
    justify-content: flex-start;
    position: relative;
  `,
  ChatBalloon: styled.div`
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    border-left: 1px solid;
    border-bottom: 1px solid;
    background-color: white;
    position: absolute;
    left: 57.5px;
    top: 20px;
    z-index: 1;
  `,
  MessageContainer: styled.div`
    width: max-content;
    height: fill;
    word-break: break-all;
    white-space: pre-wrap;
    max-width: 250px;
    background-color: white;
    border: 1px solid;
    border-radius: 9px;
    padding: 10px;
  `,
}

export default function OtherMessageWrapper({ messageData }: Props) {
  const [userData, setUserData] = useState<UserInfo>()
  useEffect(() => {
    const userRef = doc(DBService, "users", `${messageData.userId}`)
    onSnapshot(userRef, (data) => {
      if (data) {
        setUserData((data.data() as UserData).info as UserInfo)
      }
    })
  }, [])
  return (
    <Style.Wrapper>
      {userData?.profileImage && (
        <FlexBox width={50} height={50}>
          <Image
            width={50}
            height={50}
            src={`${userData?.profileImage}`}
            alt="profileImage"
            priority
            style={{ borderRadius: "50px" }}
          />
        </FlexBox>
      )}
      <Style.ChatBalloon />
      <Margin direction="row" size={12} />
      <Style.MessageContainer>{messageData.message}</Style.MessageContainer>
    </Style.Wrapper>
  )
}
