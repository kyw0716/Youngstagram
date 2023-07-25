import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { UserData, UserInfo } from "backend/dto"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH6Light, FlexBox, Margin } from "ui"
import { ProfileIcon } from "icons"
import Link from "next/link"
import axios from "axios"
import Loading from "@share/Loading/Loading"

type Props = {
  followUser: UserInfo
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
export default function FollowCard({ followUser }: Props) {
  const router = useRouter()

  const currentUser = useRecoilValue(userDataState)
  const isDarkMode = useRecoilValue(darkModeState)

  return (
    <Link
      href={
        currentUser.info.userId === followUser.userId
          ? "/mypage"
          : `/profile/${followUser.userId}`
      }
    >
      <Style.Wrapper>
        <FlexBox width={56} height={56}>
          {followUser.profileImage ? (
            <Image
              width={56}
              height={56}
              src={followUser.profileImage}
              alt="profile"
              style={{ borderRadius: 56 }}
            />
          ) : (
            <ProfileIcon width={56} height={56} />
          )}
        </FlexBox>
        <Margin direction="column" size={7} />
        {followUser.name && (
          <CustomH6Light style={{ color: isDarkMode ? "white" : "" }}>
            {followUser.name?.length > 4
              ? `${followUser.name.slice(0, 4)}..`
              : followUser.name}
          </CustomH6Light>
        )}
      </Style.Wrapper>
    </Link>
  )
}
