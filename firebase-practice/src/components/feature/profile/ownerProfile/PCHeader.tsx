import ProfileEditModal from "@share/Modal/profile/ProfileEditModal"
import { FeedDataFilter, userDataState } from "@share/recoil/recoilList"
import Image from "next/image"
import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import styled from "styled-components"
import {
  CustomH2Light,
  CustomH3Light,
  CustomH4Light,
  FlexBox,
  Margin,
} from "ui"
import { AllFileIcon, LockIcon, ProfileIcon, UnLockIcon } from "icons"

const Style = {
  ProfileHeader: styled.div`
    width: 975px;
    height: 194px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    align-items: center;
    padding-bottom: 44px;
    padding-top: 10px;
  `,
  ProfileInfo: styled.div`
    width: fit-content;
    height: 150px;
    display: flex;
    flex-direction: column;
    padding-top: 15px;
  `,
  ProfileEditButton: styled.div`
    width: 107px;
    height: 30px;
    -webkit-appearance: none;
    border: 2px solid lightgrey;
    border-radius: 10px;
    background-color: white;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
  `,
  SortWrapper: styled.div`
    width: 600px;
    display: flex;
    height: 60px;
    justify-content: space-between;
  `,
  SortToPublic: styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-top: 3px solid
      ${(props) => (props.about === "public" ? "grey" : "none")};
    cursor: pointer;
  `,
  SortToPrivate: styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-top: 3px solid
      ${(props) => (props.about === "private" ? "grey" : "none")};
    cursor: pointer;
  `,
  SortToAll: styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-top: 3px solid
      ${(props) => (props.about === "all" ? "grey" : "none")};
    cursor: pointer;
  `,
}

export default function PCHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [feedDataType, setFeedDataType] = useRecoilState(FeedDataFilter)
  const userData = useRecoilValue(userDataState)
  return (
    <>
      <ProfileEditModal isOpen={isOpen} setIsOpen={setIsOpen} isPC={true} />
      <Style.ProfileHeader>
        <Margin direction="row" size={80} />
        {userData.info.profileImage ? (
          <Image
            src={userData.info.profileImage}
            width={150}
            height={150}
            style={{ borderRadius: 150 }}
            alt="profile"
          />
        ) : (
          <ProfileIcon width={150} height={150} />
        )}

        <Margin direction="row" size={80} />
        <Style.ProfileInfo>
          <FlexBox alignItems="center">
            <CustomH2Light>{userData.info.name}</CustomH2Light>
            <Margin direction="row" size={20} />
            <Style.ProfileEditButton
              onClick={() => {
                setIsOpen(true)
              }}
            >
              프로필 편집
            </Style.ProfileEditButton>
          </FlexBox>
          <Margin direction="column" size={15} />
          <FlexBox>
            <CustomH3Light>이메일: {userData.info.email}</CustomH3Light>
          </FlexBox>
          <Margin direction="column" size={15} />
          {feedDataType === "all" && (
            <CustomH3Light>
              게시물: {userData.feed ? userData.feed.length : `0`}
            </CustomH3Light>
          )}
          {feedDataType === "public" && (
            <CustomH3Light>
              공개 게시물:{" "}
              {userData.feed
                ? userData.feed.length -
                  userData.feed.filter((eachFeed) => eachFeed.private).length
                : `0`}
            </CustomH3Light>
          )}
          {feedDataType === "private" && (
            <CustomH3Light>
              비공개 게시물:{" "}
              {userData.feed
                ? userData.feed.filter((eachFeed) => eachFeed.private).length
                : `0`}
            </CustomH3Light>
          )}
        </Style.ProfileInfo>
      </Style.ProfileHeader>
      <Style.SortWrapper>
        <Style.SortToAll
          about={feedDataType}
          onClick={() => {
            setFeedDataType("all")
          }}
        >
          <CustomH4Light>전체 게시물</CustomH4Light>
          <AllFileIcon width={15} height={15} />
        </Style.SortToAll>
        <Style.SortToPublic
          about={feedDataType}
          onClick={() => {
            setFeedDataType("public")
          }}
        >
          <CustomH4Light>공개 게시물</CustomH4Light>
          <UnLockIcon width={15} height={15} />
        </Style.SortToPublic>
        <Style.SortToPrivate
          about={feedDataType}
          onClick={() => {
            setFeedDataType("private")
          }}
        >
          <CustomH4Light>비공개 게시물</CustomH4Light>
          <LockIcon width={15} height={15} />
        </Style.SortToPrivate>
      </Style.SortWrapper>
    </>
  )
}
