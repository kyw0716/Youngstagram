import { DBService } from "@FireBase"
import { UserData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"

type Props = {
  userId: string
}

const Style = {
  Wrapper: styled.div`
    display: flex;
    gap: 15px;
    width: max-content;
    height: fit-content;
    align-items: center;
    padding-left: 15px;
  `,
}

export default function UserCard({ userId }: Props) {
  const [userData, setUserData] = useState<UserData>()
  const router = useRouter()
  useEffect(() => {
    onSnapshot(doc(DBService, "users", userId), (data) => {
      if (data) {
        setUserData(data.data() as UserData)
      }
    })
  }, [userId])
  return (
    <Style.Wrapper>
      {userData && (
        <>
          <Image
            width={40}
            height={40}
            src={
              userData.info.profileImage
                ? `${userData?.info.profileImage}`
                : "/profile.svg"
            }
            alt={"profile"}
            style={{ borderRadius: "40px", cursor: "pointer" }}
            onClick={() => {
              router.push(`/profile/${userData.info.userId}`)
            }}
          />
          {userData?.info.name}
        </>
      )}
    </Style.Wrapper>
  )
}
