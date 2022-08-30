import { SetStateAction } from "react"
import styled from "styled-components"
import YoungstagramModal from "../YoungstagramModal"
import FollowUserWrapper from "./FollowUserWrapper"
import { v4 } from "uuid"

type Props = {
  userList: string[]
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  title: string
  isPC: boolean
}

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: scroll;
    padding-top: 10px;
    padding-left: 10px;
    padding-bottom: 10px;
    ::-webkit-scrollbar {
      display: none;
    }
  `,
}

export default function FollowListModal({
  userList,
  isOpen,
  setIsOpen,
  title,
  isPC,
}: Props) {
  return (
    <YoungstagramModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      width={isPC ? "400px" : "95vw"}
      height={"243px"}
      isPC={isPC}
    >
      <Style.Wrapper>
        {userList.map((userId) => {
          return <FollowUserWrapper key={v4()} userId={userId} />
        })}
      </Style.Wrapper>
    </YoungstagramModal>
  )
}
