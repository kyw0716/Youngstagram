import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { FeedItem, UserData } from "backend/dto"
import Image from "next/image"
import { useRouter } from "next/router"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"
import { ProfileIcon } from "icons"
import Desc from "./Desc"
import LikeCommentInfo from "./LikeCommentInfo"
import Link from "next/link"
import ThreeDotMenu from "@share/Feed/mypage/FeedSortingCard/ThreeDotMenu"

type Props = {
  feedData: FeedItem
  isCurrentUserFeed?: boolean
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsLikeModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsFeedUploadModalOpen?: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  ImageHeader: styled.div`
    width: 470px;
    height: 58px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    justify-content: space-between;
    border-radius: 10px;
    border-bottom: none;
    position: relative;
    @media (max-width: 500px) {
      width: 95%;
      padding: 0px 5px;
    }
  `,
  HeaderText: styled.div`
    display: flex;
    flex-direction: column;
    height: 38px;
    justify-content: center;
  `,
  UserName: styled.span`
    font-size: 12px;
    font-weight: bold;
    color: black;
  `,
  ImageTitle: styled.span`
    font-size: 7px;
    font-weight: 400;
    color: gray;
  `,
  ImageCard: styled.div`
    width: 470px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid lightgrey;
    border-radius: 10px;
    padding-bottom: 10px;
    background-color: white;
    max-width: 470px;
    @media (max-width: 900px) {
      width: 95%;
    }
  `,
}

export default function FeedCard({
  feedData,
  isCurrentUserFeed,
  setIsCommentModalOpen,
  setIsLikeModalOpen,
  setIsFeedUploadModalOpen,
}: Props) {
  const currentUser = useRecoilValue(userDataState)
  const isDarkMode = useRecoilValue(darkModeState)

  return (
    <Style.ImageCard
      style={{
        border: isDarkMode ? "1px solid lightgrey" : "",
        backgroundColor: isDarkMode ? "black" : "",
      }}
    >
      <Style.ImageHeader>
        <FlexBox
          width={"fit-content"}
          height={58}
          gap={15}
          alignItems={"center"}
        >
          {feedData.creator.profileImage ? (
            <Link
              href={
                currentUser.info.userId === feedData.creator.userId
                  ? "/mypage"
                  : `/profile/${feedData.creator.userId}`
              }
            >
              <FlexBox width={"fit-content"} height={"fit-content"}>
                <Image
                  src={feedData.creator.profileImage}
                  alt="creator"
                  width={38}
                  height={38}
                  style={{ borderRadius: 38, cursor: "pointer" }}
                />
              </FlexBox>
            </Link>
          ) : (
            <ProfileIcon
              width={38}
              height={38}
              userId={feedData.creator.userId}
            />
          )}
          <Style.HeaderText>
            <Style.UserName style={{ color: isDarkMode ? "white" : "" }}>
              {feedData.creator.name}
            </Style.UserName>
            <Style.ImageTitle>{feedData.location}</Style.ImageTitle>
          </Style.HeaderText>
        </FlexBox>
        {isCurrentUserFeed && setIsFeedUploadModalOpen && (
          <ThreeDotMenu
            feedData={feedData}
            setIsFeedUploadModalOpen={setIsFeedUploadModalOpen}
          />
        )}
      </Style.ImageHeader>
      {feedData.imageUrl ? (
        <Image
          src={feedData.imageUrl}
          width={470}
          height={600}
          alt="Image"
          priority
        />
      ) : (
        <Image
          src="https://giphy.com/embed/wnYB3vx9t6PXiq1ubB"
          width={470}
          height={600}
          alt="Image"
        />
      )}
      <Margin direction="column" size={10} />
      <LikeCommentInfo
        feedData={feedData}
        setIsCommentModalOpen={setIsCommentModalOpen}
        setIsLikeModalOpen={setIsLikeModalOpen}
      />
      <Desc
        feedData={feedData}
        setIsCommentModalOpen={setIsCommentModalOpen}
        name={feedData.creator.name}
      />
    </Style.ImageCard>
  )
}
