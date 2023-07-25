import { Suspense, useEffect, useState } from "react"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"
import FollowCard from "./FollowCard"
import { v4 } from "uuid"
import { LeftArrowForCarouselIcon, RightArrowForCarouselIcon } from "icons"
import { useRecoilValue } from "recoil"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { followUsersSelector } from "@share/recoil/user"
import Loading from "@share/Loading/Loading"

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
  const followUsers = useRecoilValue(followUsersSelector)
  const isDarkMode = useRecoilValue(darkModeState)

  const [movingRange, setMovingRange] = useState<number>(0)
  const [followNumber, setFollowNumber] = useState<number>(0)

  useEffect(() => {
    if (window.innerWidth < 470) {
      setFollowNumber(followUsers.length - 5)
      return
    }
    setFollowNumber(followUsers.length - 6)
  }, [followUsers])

  useEffect(() => {
    if (followNumber < 0) setFollowNumber(0)
  }, [followNumber])

  return (
    <Style.Wrapper
      style={{
        backgroundColor: isDarkMode ? "black" : "",
        border: isDarkMode ? "1px solid lightgrey" : "",
      }}
    >
      <Style.FollowCardWrapper about={`${movingRange}px`}>
        {followUsers.map((followUser) => {
          return (
            <Suspense
              key={followUser.userId}
              fallback={
                <Style.Wrapper>
                  <Loading width={56} height={56} borderRadius={56} />
                  <Margin direction="column" size={5} />
                  <Loading width={56} height={15} borderRadius={10} />
                </Style.Wrapper>
              }
            >
              <FollowCard followUser={followUser} key={v4()} />
            </Suspense>
          )
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
          <LeftArrowForCarouselIcon width={30} height={30} />
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
          <RightArrowForCarouselIcon width={30} height={30} />
        </FlexBox>
      )}
    </Style.Wrapper>
  )
}
