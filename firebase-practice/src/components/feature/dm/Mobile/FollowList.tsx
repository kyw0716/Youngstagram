import { SetStateAction } from "react"
import { FlexBox } from "ui"
import { v4 } from "uuid"
import UserCard from "../UserCard"

type Props = {
  followList: string[]
  selectedUserId: string
  setSelectedUserId: React.Dispatch<SetStateAction<string>>
  setIsDropDownMenuOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function FollowList({
  followList,
  selectedUserId,
  setSelectedUserId,
  setIsDropDownMenuOpen,
}: Props) {
  return (
    <>
      {followList && (
        <>
          {followList.map((data) => {
            return (
              <FlexBox
                width={"100%"}
                height={60}
                key={v4()}
                alignItems="center"
                onClick={() => {
                  if (selectedUserId === data) {
                    setSelectedUserId("")
                    return
                  }
                  setSelectedUserId(data)
                  setIsDropDownMenuOpen(false)
                }}
                style={{
                  backgroundColor:
                    data === selectedUserId ? "lightgrey" : "white",
                  cursor: "pointer",
                }}
              >
                <UserCard userId={data} />
              </FlexBox>
            )
          })}
        </>
      )}
    </>
  )
}
