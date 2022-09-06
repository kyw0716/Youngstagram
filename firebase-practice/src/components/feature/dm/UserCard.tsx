import { DBService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
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
  const currentUserData = useRecoilValue(userDataState)
  const router = useRouter()
  useEffect(() => {
    if (userId === "") return
    getUserDataByUid(userId).then((data) => {
      if (data) {
        setUserData(data as UserData)
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
                : "/profile.webp"
            }
            alt={"profile"}
            style={{ borderRadius: "40px", cursor: "pointer" }}
            onClick={() => {
              if (currentUserData.info.userId === userData?.info.userId) {
                router.push(`/u/${currentUserData.info.userId}`)
                return
              }
              router.push(`/profile/${userData.info.userId}`)
            }}
          />
          {userData?.info.name}
        </>
      )}
    </Style.Wrapper>
  )
}
