import { SetStateAction } from "react"
import styled from "styled-components"
import YoungstagramModal from "../YoungstagramModal"
import FollowUserWrapper from "./UserWrapper"
import { v4 } from "uuid"
import useWindowSize from "lib/hooks/useWindowSize"

type Props = {
  userList: string[]
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  title: string
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

export default function UserListModal({
  userList,
  isOpen,
  setIsOpen,
  title,
}: Props) {
  const windowSize = useWindowSize()
  return (
    <YoungstagramModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      width={windowSize > 900 ? "400px" : "95vw"}
      height={"243px"}
    >
      <Style.Wrapper>
        {userList && (
          <>
            {userList.map((userId) => {
              return <FollowUserWrapper key={v4()} userId={userId} />
            })}
          </>
        )}
      </Style.Wrapper>
    </YoungstagramModal>
  )
}
