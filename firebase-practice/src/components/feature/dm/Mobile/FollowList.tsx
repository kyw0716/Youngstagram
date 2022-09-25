import { SetStateAction } from "react"
import { v4 } from "uuid"
import UserCard from "../UserCard"

type Props = {
  followList: string[]
  setIsDropDownMenuOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function FollowList({
  followList,
  setIsDropDownMenuOpen,
}: Props) {
  return (
    <>
      {followList &&
        followList.map((data) => {
          return (
            <UserCard
              userId={data}
              key={v4()}
              setIsDropDownMenuOpen={setIsDropDownMenuOpen}
            />
          )
        })}
    </>
  )
}
