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
    @media (max-width: 470px) {
      border-radius: 0;
    }
  `,
  FollowCardWrapper: styled.div`
    width: fit-content;
    height: fit-content;
    display: flex;
    gap: 20px;
    transform: translateX(${(props) => props.about});
    transition-property: all;
    transition-duration: 0.5s;
  `,
}

export default function FollowListAtMainPage() {
  const [userData, setUserData] = useState<UserData>()
  const [movingRange, setMovingRange] = useState<number>(0)
  const [followNumber, setFollowNumber] = useState<number>(0)
  useEffect(() => {
    if (!authService.currentUser) return
    onSnapshot(doc(DBService, "users", authService.currentUser.uid), (data) => {
      if (data) setUserData(data.data() as UserData)
    })
  }, [authService.currentUser?.uid])
  useEffect(() => {
    if (userData === undefined) return
    if (userData.follow === undefined) return
    if (window.innerWidth < 470) {
      setFollowNumber(userData.follow.length - 5)
      return
    }
    setFollowNumber(userData.follow.length - 6)
  }, [userData])
  useEffect(() => {
    if (followNumber < 0) setFollowNumber(0)
  }, [followNumber])

  return (
    <>
      {userData !== undefined && userData.follow !== undefined ? (
        <Style.Wrapper>
          <Style.FollowCardWrapper about={`${movingRange}px`}>
            {userData.follow.map((followUserId) => {
              return <FollowCard userId={followUserId} key={v4()} />
            })}
          </Style.FollowCardWrapper>
          {movingRange === 0 || (
            <FlexBox
              width={30}
              height={30}
              style={{ position: "absolute", left: "5px", cursor: "pointer" }}
              onClick={() => {
                setMovingRange((current) => current + 76)
                setFollowNumber((current) => current + 1)
              }}
            >
              <Image
                width={30}
                height={30}
                src="/left-arrow-for-carousel.webp"
                alt="left"
              />
            </FlexBox>
          )}
          {followNumber === 0 || (
            <FlexBox
              width={30}
              height={30}
              style={{ position: "absolute", right: "5px", cursor: "pointer" }}
              onClick={() => {
                setMovingRange((current) => current - 76)
                setFollowNumber((current) => current - 1)
              }}
            >
              <Image
                width={30}
                height={30}
                src="/right-arrow-for-carousel.webp"
                alt="left"
              />
            </FlexBox>
          )}
        </Style.Wrapper>
      ) : (
        <></>
      )}
    </>
  )
}
