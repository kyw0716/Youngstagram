import { useState } from "react"
import styled from "styled-components"
import DropDownFollowList from "./DropDownFollowList"
import MessageViewer from "./Message"

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: 100vh;
    background-color: white;
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
    </Style.Wrapper>
  )
}
