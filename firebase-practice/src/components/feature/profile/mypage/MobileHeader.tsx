import ProfileEditModal from "@share/Modal/profile/ProfileEditModal"
import {
  FeedDataFilter,
  userDataState,
  userListState,
} from "@share/recoil/recoilList"
import Image from "next/image"
import { SetStateAction, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"
import {
  CustomH2,
  CustomH2Light,
  CustomH3,
  CustomH3Light,
  CustomH4,
  CustomH4Light,
  FlexBox,
  Margin,
} from "ui"
import { ProfileIcon } from "icons"

type Props = {
  setIsUserListModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  ProfileWrapper: styled.div`
    width: 95%;
    height: 120px;
    border-bottom: 1px solid lightgrey;
  `,
  ProfileImage: styled.img`
    width: 90px;
    height: 90px;
    border-radius: 100px;
  `,
  ProfileEditButton: styled.div`
    width: 250px;
    height: 35px;
    -webkit-appearance: none;
    border: 2px solid lightgrey;
    border-radius: 10px;
    background-color: withe;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
  `,
  ProfileInfoWrapper: styled.div`
    width: 100%;
    height: 70px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    justify-content: space-between;
  `,
  SortToPublic: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "public" ? "grey" : "none")};
  `,
  SortToPrivate: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "private" ? "grey" : "none")};
  `,
  SortToAll: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "all" ? "grey" : "none")};
  `,
}

export default function MobileHeader({ setIsUserListModalOpen }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [feedDataType, setFeedDataType] = useRecoilState(FeedDataFilter)
  const userData = useRecoilValue(userDataState)
  const setUserList = useSetRecoilState(userListState)

  return (
    <>
      <ProfileEditModal isPC={false} isOpen={isOpen} setIsOpen={setIsOpen} />
      <Style.ProfileWrapper>
        <FlexBox width={"100%"}>
          {userData.info.profileImage ? (
            <FlexBox width={90} height={90} style={{ flexShrink: 0 }}>
              <Image
                src={userData.info.profileImage}
                alt="profile"
                width={90}
                height={90}
                style={{ borderRadius: "100px" }}
              />
            </FlexBox>
          ) : (
            <ProfileIcon width={90} height={90} />
          )}
          <Margin direction="row" size={15} />
          <FlexBox column={true} width="fit-content">
            <CustomH2Light>{userData.info.name}</CustomH2Light>
            <Margin direction="column" size={7} />
            <FlexBox gap={15}>
              <CustomH3Light
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setUserList(userData.follow)
                  setIsUserListModalOpen(true)
                }}
              >
                팔로우: {userData.follow ? userData.follow.length : `0`}
              </CustomH3Light>
              <CustomH3Light
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setUserList(userData.follower)
                  setIsUserListModalOpen(true)
                }}
              >
                팔로워: {userData.follower ? userData.follower.length : `0`}
              </CustomH3Light>
            </FlexBox>
            <Margin direction="column" size={7} />
            <Style.ProfileEditButton
              onClick={() => {
                setIsOpen(true)
              }}
            >
              프로필 편집
            </Style.ProfileEditButton>
          </FlexBox>
        </FlexBox>
      </Style.ProfileWrapper>
      <Margin direction="column" size={15} />
      <Style.ProfileInfoWrapper>
        <Style.SortToAll
          onClick={() => {
            setFeedDataType("all")
          }}
          about={feedDataType}
        >
          <CustomH4Light>전체 게시물</CustomH4Light>
          <CustomH3Light>
            {userData.feed ? `${userData.feed.length}` : `0`}
          </CustomH3Light>
        </Style.SortToAll>
        <Style.SortToPublic
          onClick={() => {
            setFeedDataType("public")
          }}
          about={feedDataType}
        >
          <CustomH4Light>공개 게시물</CustomH4Light>
          <CustomH4Light>
            {userData.feed
              ? userData.feed.length -
                userData.feed.filter((eachFeed) => eachFeed.private).length
              : `0`}
          </CustomH4Light>
        </Style.SortToPublic>
        <Style.SortToPrivate
          onClick={() => {
            setFeedDataType("private")
          }}
          about={feedDataType}
        >
          <CustomH4Light>숨김 게시물</CustomH4Light>
          <CustomH4Light>
            {userData.feed
              ? userData.feed.filter((eachFeed) => eachFeed.private).length
              : `0`}
          </CustomH4Light>
        </Style.SortToPrivate>
      </Style.ProfileInfoWrapper>
    </>
  )
}
