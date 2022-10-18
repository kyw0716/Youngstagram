import styled from "styled-components"
import DropDownFollowList from "./DropDownFollowList"
import MessageList from "./MessageList"
import MessageInput from "./MessageInputIn"
import { useRecoilValue } from "recoil"
import { darkModeState, dmSelectedUserId } from "@share/recoil/recoilList"

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: calc(calc(var(--vh, 1vh) * 100) - 60px);
    background-color: white;
    position: fixed;
    top: 60px;
  `,
}

export default function MobileDM() {
  const selectedUserId = useRecoilValue(dmSelectedUserId)
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <Style.Wrapper style={{ backgroundColor: isDarkMode ? "black" : "" }}>
      <DropDownFollowList />
      <MessageList />
      {selectedUserId && <MessageInput selectedUserId={selectedUserId} />}
    </Style.Wrapper>
  )
}
