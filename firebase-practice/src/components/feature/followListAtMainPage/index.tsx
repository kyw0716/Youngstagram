import { authService, DBService } from "@FireBase"
import { UserData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import Image from "next/image"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { FlexBox } from "ui"
import FollowCard from "./FollowCard"
import { v4 } from "uuid"

const Style = {
  Wrapper: styled.div`
    width: 470px;
    height: 119px;
    border-radius: 10px;
    background-color: white;
    border: 1px solid lightgrey;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 20px;
  `,
  FollowCardWrapper: styled.div`
    width: fit-content;
    height: fit-content;
    display: flex;
    gap: 15px;
  `,
}

export default function FollowListAtMainPage() {
  const [userData, setUserData] = useState<UserData>()
  useEffect(() => {
    if (!authService.currentUser) return
    onSnapshot(doc(DBService, "users", authService.currentUser.uid), (data) => {
      if (data) setUserData(data.data() as UserData)
    })
  }, [authService.currentUser?.uid])
  return (
    <>
      {userData !== undefined && userData.follow !== undefined ? (
        <Style.Wrapper>
          <Style.FollowCardWrapper>
            {userData.follow.map((followUserId) => {
              return <FollowCard userId={followUserId} key={v4()} />
            })}
          </Style.FollowCardWrapper>

          <FlexBox
            width={15}
            height={15}
            style={{ position: "absolute", left: "5px", cursor: "pointer" }}
          >
            <Image width={15} height={15} src="/left-arrow.svg" alt="left" />
          </FlexBox>
          <FlexBox
            width={15}
            height={15}
            style={{ position: "absolute", right: "5px", cursor: "pointer" }}
          >
            <Image width={15} height={15} src="/right-arrow.svg" alt="left" />
          </FlexBox>
        </Style.Wrapper>
      ) : (
        <></>
      )}
    </>
  )
}
