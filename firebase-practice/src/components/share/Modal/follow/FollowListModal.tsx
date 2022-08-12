import { UserInfo } from "backend/dto"
import { SetStateAction } from "react"
import YoungstagramModal from "../YoungstagramModal"

type Props = {
  userList: UserInfo[]
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  title: string
}

export default function FollowListModal({
  userList,
  isOpen,
  setIsOpen,
  title,
}: Props) {
  return (
    <YoungstagramModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      width={"400px"}
      height={"243px"}
      isPC={true}
    >
      followModal
    </YoungstagramModal>
  )
}
