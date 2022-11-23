import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH6Light, FlexBox, Margin } from "ui"
import { ProfileIcon } from "icons"
import Link from "next/link"
import axios from "axios"

type Props = {
  userId: string
}
const Style = {
  Wrapper: styled.div`
    width: 56px;
    height: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  `,
}
export default function FollowCard({ userId }: Props) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>()
  const currentUser = useRecoilValue(userDataState)
  const isDarkMode = useRecoilValue(darkModeState)
  useEffect(() => {
    axios<UserData>({
      method: "GET",
      url: `/api/profile?userId=${userId}`,
    }).then((response) => {
      setUserData(response.data)
    })
  }, [])
  return (
    <>
      {userData && (
        <Link
          href={
            currentUser !== undefined && currentUser.info.userId === userId
              ? "/mypage"
              : `/profile/${userId}`
          }
        >
          <Style.Wrapper>
            <FlexBox width={56} height={56}>
              {userData.info.profileImage ? (
                <Image
                  width={56}
                  height={56}
                  src={userData.info.profileImage}
                  alt="profile"
                  style={{ borderRadius: 56 }}
                />
              ) : (
                <ProfileIcon width={56} height={56} />
              )}
            </FlexBox>
            <Margin direction="column" size={7} />
            {userData.info.name && (
              <CustomH6Light style={{ color: isDarkMode ? "white" : "" }}>
                {userData.info.name?.length > 4
                  ? `${userData.info.name.slice(0, 4)}..`
                  : userData.info.name}
              </CustomH6Light>
            )}
          </Style.Wrapper>
        </Link>
      )}
    </>
  )
}
