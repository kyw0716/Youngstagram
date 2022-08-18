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
    justify-content: flex-start;
  `,
  ChatBalloon: styled.div`
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    border-left: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
    background-color: white;
    position: absolute;
    z-index: 1;
    top: 15px;
    left: -6px;
  `,
  MessageContainer: styled.div`
    width: max-content;
    height: fill;
    word-break: break-all;
    white-space: pre-wrap;
    max-width: 250px;
    background-color: white;
    border: 1px solid lightgrey;
    border-radius: 9px;
    padding: 15px;
    position: relative;
  `,
}

export default function OtherMessageWrapper({ messageData }: Props) {
  return (
    <Style.Wrapper>
      <Margin direction="row" size={22} />
      <Style.MessageContainer>
        {messageData.message}
        <Style.ChatBalloon />
      </Style.MessageContainer>
    </Style.Wrapper>
  )
}
