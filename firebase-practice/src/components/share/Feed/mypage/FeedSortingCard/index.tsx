import { DBService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { FeedData, UserInfo } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import { ProfileIcon } from "icons"
import Image from "next/image"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"
import Icons from "../../mainPage/FeedCard/Icons"
import Desc from "./Desc"
import LikeCommentInfo from "./LikeCommentInfo"
import ThreeDotMenu from "./ThreeDotMenu"

type Props = {
  feedData: FeedData
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsFeedUploadModalOpen: React.Dispatch<SetStateAction<boolean>>
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

export default function FeedSortingCard({
  feedData,
  setIsCommentModalOpen,
  setIsFeedUploadModalOpen,
}: Props) {
  const userData = useRecoilValue(userDataState)
  const [creatorInfo, setCreatorInfo] = useState<UserInfo>()
  const [isCurrentUserLike, setIsCurrentUserLike] = useState<boolean>(false)

  useEffect(() => {
    onSnapshot(doc(DBService, "users", `${feedData.creator}`), (doc) => {
      setCreatorInfo(doc.data()?.info)
    })
  }, [feedData])

  return (
    <>
      {userData && (
        <Style.ImageCard>
          <Style.ImageHeader>
            <FlexBox
              width={"fit-content"}
              height={58}
              gap={15}
              alignItems={"center"}
            >
              {userData.info.profileImage ? (
                <Image
                  src={userData?.info.profileImage}
                  alt="creator"
                  width={38}
                  height={38}
                  style={{ borderRadius: 38, cursor: "pointer" }}
                />
              ) : (
                <ProfileIcon width={38} height={38} />
              )}
              <Style.HeaderText>
                <Style.UserName>{userData?.info.name}</Style.UserName>
                <Style.ImageTitle>{feedData.location}</Style.ImageTitle>
              </Style.HeaderText>
            </FlexBox>
            <ThreeDotMenu
              feedData={feedData}
              setIsFeedUploadModalOpen={setIsFeedUploadModalOpen}
            />
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
          <Icons
            isCurrentUserLike={isCurrentUserLike}
            setIsCommentModalOpen={setIsCommentModalOpen}
            feedData={feedData}
          />
          <Margin direction="column" size={15} />
          <LikeCommentInfo
            feedData={feedData}
            setIsCurrentUserLike={setIsCurrentUserLike}
          />
          <Desc
            feedData={feedData}
            setIsCommentModalOpen={setIsCommentModalOpen}
            name={creatorInfo?.name}
          />
        </Style.ImageCard>
      )}
    </>
  )
}
