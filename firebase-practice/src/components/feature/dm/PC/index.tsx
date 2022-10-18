import { CustomH4, FlexBox, Margin } from "ui"
import styled from "styled-components"
import { useEffect, useState } from "react"
import UserCard from "@feature/dm/UserCard"
import { v4 } from "uuid"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  darkModeState,
  dmSelectedUserId,
  userDataState,
} from "@share/recoil/recoilList"
import MessageList from "./MessageList"

const Style = {
  Wrapper: styled.div`
    margin-top: 10vh;
    width: 100vw;
    height: max-content;
    display: flex;
    justify-content: center;
  `,
  FollowListSection: styled.div`
    width: 349px;
    height: 70vh;
    border: 1px solid lightgrey;
    border-right: none;
    display: flex;
    flex-direction: column;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
  `,
  SelectFollowOrFollowerBtn: styled.div`
    width: fit-content;
    height: fit-content;
    padding: 5px;
    border: 1px solid lightgrey;
    background-color: ${(props) => props.about};
    border-radius: 20px;
    cursor: pointer;
  `,
  MessageSection: styled.div`
    width: 583px;
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 15;
    border: 1px solid lightgrey;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
    position: relative;
  `,
  MessageList: styled.div`
    width: 100%;
    height: calc(70vh - 120px);
    padding: 10px 0px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    ::-webkit-scrollbar {
      display: none;
    }
  `,
}

export default function PCDM() {
  const [currentUserFollowList, setCurrentUserFollowList] = useState<string[]>(
    [],
  )
  const [currentUserFollowerList, setCurrentUserFollowerList] = useState<
    string[]
  >([])
  const [isFollowerList, setIsFollowerList] = useState<boolean>(false)
  const currentUserData = useRecoilValue(userDataState)
  const isDarkMode = useRecoilValue(darkModeState)
  const setSelectedUserId = useSetRecoilState(dmSelectedUserId)

  useEffect(() => {
    setCurrentUserFollowList(currentUserData.follow)
    setCurrentUserFollowerList(currentUserData.follower)
  }, [currentUserData])
  return (
    <Style.Wrapper>
      <FlexBox width={"932px"} height={"70vh"}>
        <Style.FollowListSection
          style={{ backgroundColor: isDarkMode ? "black" : "" }}
        >
          <FlexBox
            width={"100%"}
            alignItems={"center"}
            height={60}
            style={{
              borderBottom: "1px solid lightgrey",
              position: "sticky",
              top: 0,
              marginBottom: 15,
              flexShrink: 0,
              paddingRight: 15,
            }}
          >
            <UserCard
              userId={currentUserData.info.userId}
              color={isDarkMode ? "black" : "white"}
            />
            <Margin direction="row" size={15} />
            <Style.SelectFollowOrFollowerBtn
              about={isFollowerList ? "lightgrey" : "white"}
              onClick={() => {
                setIsFollowerList((current) => !current)
                setSelectedUserId("")
              }}
              style={{ fontSize: 13, flexShrink: 0 }}
            >
              {isFollowerList ? "팔로우로 전환" : "팔로워로 전환"}
            </Style.SelectFollowOrFollowerBtn>
          </FlexBox>
          <FlexBox width={"100%"} justifyContents="center">
            <CustomH4>
              {isFollowerList ? "팔로워 목록" : "팔로우 목록"}
            </CustomH4>
          </FlexBox>
          <Margin direction="column" size={10} />
          {isFollowerList ? (
            <>
              {currentUserFollowerList?.map((data) => {
                return <UserCard key={v4()} userId={data} />
              })}
            </>
          ) : (
            <>
              {currentUserFollowList?.map((data) => {
                return <UserCard userId={data} key={v4()} />
              })}
            </>
          )}
        </Style.FollowListSection>
        <MessageList />
      </FlexBox>
    </Style.Wrapper>
  )
}
