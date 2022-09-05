import { useState } from "react"
import styled from "styled-components"
import DropDownFollowList from "./DropDownFollowList"
import MessageViewer from "./MessageViewer"
import MessageInput from "./MessageInputIn"

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: calc(100vh - 120px);
    background-color: white;
    position: fixed;
    top: 60px;
  `,
}

export default function MobileDM() {
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  return (
    <Style.Wrapper>
      <DropDownFollowList
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
      <MessageViewer selectedUserId={selectedUserId} />
      {selectedUserId && <MessageInput selectedUserId={selectedUserId} />}
    </Style.Wrapper>
  )
}
