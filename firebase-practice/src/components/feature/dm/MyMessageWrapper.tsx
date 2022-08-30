import { Message } from "backend/dto"
import styled from "styled-components"
import { Margin } from "ui"

type Props = {
  messageData: Message
}

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: fill;
    display: flex;
    justify-content: flex-end;
  `,
  ChatBalloon: styled.div`
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    border-right: 1px solid lightgrey;
    border-top: 1px solid lightgrey;
    background-color: lightgrey;
    position: absolute;
    right: -6px;
    top: 15px;
    z-index: 1;
  `,
  MessageContainer: styled.div`
    width: max-content;
    height: fill;
    word-break: break-all;
    white-space: pre-wrap;
    max-width: 250px;
    background-color: lightgrey;
    border: 1px solid lightgrey;
    border-radius: 9px;
    padding: 15px;
    position: relative;
  `,
}

export default function MyMessageWrapper({ messageData }: Props) {
  return (
    <Style.Wrapper>
      <Style.MessageContainer>
        {messageData.message}
        <Style.ChatBalloon />
      </Style.MessageContainer>
      <Margin direction="row" size={22} />
    </Style.Wrapper>
  )
}
