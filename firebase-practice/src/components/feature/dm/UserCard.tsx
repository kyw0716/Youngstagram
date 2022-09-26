import {
  darkModeState,
  dmSelectedUserId,
  userDataState,
} from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { SetStateAction, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"
import { ProfileIcon } from "icons"

type Props = {
  userId: string
  color?: string
  setIsDropDownMenuOpen?: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  Wrapper: styled.div`
    display: flex;
    gap: 15px;
    width: 100%;
    height: 60px;
    align-items: center;
    padding-left: 15px;
  `,
}

export default function UserCard({
  userId,
  color,
  setIsDropDownMenuOpen,
}: Props) {
  const [userData, setUserData] = useState<UserData>()
  const currentUserData = useRecoilValue(userDataState)
  const [selectedUserId, setSelectedUserId] = useRecoilState(dmSelectedUserId)
  const isDarkMode = useRecoilValue(darkModeState)

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
    <Style.Wrapper
      onClick={() => {
        if (currentUserData.info.userId !== userId) setSelectedUserId(userId)
        if (userId === selectedUserId) setSelectedUserId("")
        if (setIsDropDownMenuOpen) setIsDropDownMenuOpen(false)
      }}
      style={{
        cursor: "pointer",
        backgroundColor: color
          ? color
          : selectedUserId === userId
          ? isDarkMode
            ? "grey"
            : "lightgrey"
          : isDarkMode
          ? "black"
          : "white",
        borderBottom: color ? "1px solid lightgrey" : "",
        color: isDarkMode ? "white" : "black",
      }}
    >
      {userData && (
        <>
          {userData.info.profileImage ? (
            <Image
              width={40}
              height={40}
              src={userData.info.profileImage}
              alt={"profile"}
              style={{ borderRadius: "40px", cursor: "pointer" }}
              onClick={() => {
                if (currentUserData.info.userId === userData?.info.userId) {
                  router.push(`/mypage`)
                  return
                }
                router.push(`/profile/${userData.info.userId}`)
              }}
            />
          ) : (
            <ProfileIcon
              width={40}
              height={40}
              onClick={() => {
                if (currentUserData.info.userId === userData?.info.userId) {
                  router.push(`/mypage`)
                  return
                }
                router.push(`/profile/${userData.info.userId}`)
              }}
            />
          )}
          {userData?.info.name}
        </>
      )}
    </Style.Wrapper>
  )
}
