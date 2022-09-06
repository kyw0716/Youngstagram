import { authService, DBService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import { onAuthStateChanged } from "firebase/auth"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import styled from "styled-components"
import { FlexBox } from "ui"
import UserCard from "../UserCard"
import FollowList from "./FollowList"

type Props = {
  selectedUserId: string
  setSelectedUserId: React.Dispatch<SetStateAction<string>>
}

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

export default function DropDownFollowList({
  selectedUserId,
  setSelectedUserId,
}: Props) {
  const currentUserData = useRecoilValue(userDataState)
  const [isFollowerList, setIsFollowerList] = useState<boolean>(false)
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState<boolean>(true)

  const [follower, setFollower] = useState<string[]>([])
  const [follow, setFollow] = useState<string[]>([])

  useEffect(() => {
    setFollow(currentUserData.follow)
    setFollower(currentUserData.follower)
  }, [currentUserData])

  return (
    <>
      <Style.Header>
        <UserCard
          userId={
            isDropDownMenuOpen ? currentUserData.info.userId : selectedUserId
          }
        />
        {isDropDownMenuOpen ? (
          <FlexBox gap={10} width={"fit-content"}>
            <Style.SelectFollowOrFollowerBtn
              about={isFollowerList ? "lightgrey" : "white"}
              onClick={() => {
                setIsFollowerList((current) => !current)
                setSelectedUserId("")
              }}
            >
              {isFollowerList ? "팔로우로 전환" : "팔로워로 전환"}
            </Style.SelectFollowOrFollowerBtn>
            <Image
              width={20}
              height={20}
              alt="x"
              src="/x.webp"
              onClick={() => {
                setIsDropDownMenuOpen(false)
              }}
              style={{ cursor: "pointer" }}
            />
          </FlexBox>
        ) : (
          <Image
            width={25}
            height={25}
            alt="bottom-arrow"
            src="/bottom-arrow.webp"
            onClick={() => {
              setIsDropDownMenuOpen(true)
            }}
            style={{ cursor: "pointer" }}
          />
        )}
      </Style.Header>
      {isDropDownMenuOpen && (
        <FollowList
          followList={isFollowerList ? follower : follow}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          setIsDropDownMenuOpen={setIsDropDownMenuOpen}
        />
      )}
    </>
  )
}
