import {
  darkModeState,
  dmSelectedUserId,
  userDataState,
} from "@share/recoil/recoilList"
import { BottomArrowIcon, XIcon } from "icons"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import styled from "styled-components"
import { FlexBox } from "ui"
import UserCard from "../UserCard"
import FollowList from "./FollowList"

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: auto;
    min-height: 100vh;
    padding-top: 20px;
    border: 1px solid;
  `,
  Header: styled.div`
    width: 100%;
    height: 60px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 15px;
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
}

export default function DropDownFollowList() {
  const currentUserData = useRecoilValue(userDataState)
  const [isFollowerList, setIsFollowerList] = useState<boolean>(false)
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState<boolean>(true)

  const [follower, setFollower] = useState<string[]>([])
  const [follow, setFollow] = useState<string[]>([])

  const isDarkMode = useRecoilValue(darkModeState)
  const [selectedUserId, setSelectedUserId] = useRecoilState(dmSelectedUserId)

  useEffect(() => {
    setFollow(currentUserData.follow)
    setFollower(currentUserData.follower)
  }, [currentUserData])

  return (
    <>
      <Style.Header
        style={{
          backgroundColor: isDarkMode ? "black" : "",
          borderBottom: "2px solid lightgrey",
        }}
      >
        <UserCard
          userId={
            isDropDownMenuOpen ? currentUserData.info.userId : selectedUserId
          }
          color={isDarkMode ? "black" : "white"}
        />
        {isDropDownMenuOpen ? (
          <FlexBox
            gap={10}
            width={"fit-content"}
            height={"fit-content"}
            alignItems={"center"}
            style={{ flexShrink: 0, fontSize: 12 }}
          >
            <Style.SelectFollowOrFollowerBtn
              about={isFollowerList ? "lightgrey" : "white"}
              onClick={() => {
                setIsFollowerList((current) => !current)
                setSelectedUserId("")
              }}
              style={{ flexShrink: 0, fontSize: 12 }}
            >
              {isFollowerList ? "팔로우로 전환" : "팔로워로 전환"}
            </Style.SelectFollowOrFollowerBtn>
          </FlexBox>
        ) : (
          <BottomArrowIcon
            width={25}
            height={25}
            onClick={() => {
              setIsDropDownMenuOpen(true)
            }}
          />
        )}
      </Style.Header>
      {isDropDownMenuOpen && (
        <FollowList
          followList={isFollowerList ? follower : follow}
          setIsDropDownMenuOpen={setIsDropDownMenuOpen}
        />
      )}
    </>
  )
}
