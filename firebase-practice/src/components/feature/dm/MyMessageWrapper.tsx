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
    justify-content: flex-end;
    position: relative;
    padding-right: 10px;
  `,
  ChatBalloon: styled.div`
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    border-right: 1px solid;
    border-top: 1px solid;
    background-color: white;
    position: absolute;
    right: 17.5px;
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

export default function MyMessageWrapper({ messageData }: Props) {
  return (
    <Style.Wrapper>
      <Style.MessageContainer>{messageData.message}</Style.MessageContainer>
      <Style.ChatBalloon />
      <Margin direction="row" size={12} />
    </Style.Wrapper>
  )
}
