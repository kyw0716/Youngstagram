import { authService, DBService } from "@FireBase"
import { feedDataState, userDataState } from "@share/recoil/recoilList"
import { FeedData, UserData, UserInfo } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/router"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"
import {
  CommentIcon,
  CustomH5,
  CustomH5Light,
  CustomH6,
  FlexBox,
  FullHeart,
  HeartIcon,
  Margin,
  ShareIcon,
} from "ui"
import { ProfileIcon } from "icons"
import CommentModal from "../../Modal/comment/CommentModal"
import FollowListModal from "@share/Modal/follow/FollowListModal"
import useWindowSize from "lib/useWindowSize"
import Desc from "./Desc"
import LikeCommentInfo from "./LikeCommentInfo"
import Icons from "./Icons"

type Props = {
  feedData: FeedData
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
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

export default function FeedCard({ feedData, setIsCommentModalOpen }: Props) {
  const router = useRouter()
  const [feedCreatorData, setFeedCreatorData] = useState<UserData>()
  const [isCurrentUserLike, setIsCurrentUserLike] = useState<boolean>(false)
  const currentUser = useRecoilValue(userDataState)

  useEffect(() => {
    onSnapshot(doc(DBService, "users", `${feedData.creator}`), (data) => {
      setFeedCreatorData(data.data() as UserData)
    })
  }, [feedData])

  return (
    <>
      {feedCreatorData && (
        <Style.ImageCard>
          <Style.ImageHeader>
            <FlexBox
              width={"fit-content"}
              height={58}
              gap={15}
              alignItems={"center"}
            >
              {feedCreatorData?.info.profileImage ? (
                <Image
                  src={feedCreatorData.info.profileImage}
                  alt="creator"
                  width={38}
                  height={38}
                  style={{ borderRadius: 38, cursor: "pointer" }}
                  onClick={() => {
                    if (
                      currentUser.info.userId === feedCreatorData.info.userId
                    ) {
                      router.replace(`/loading?path=mypage`)
                      return
                    }
                    router.replace(
                      `/loading?path=profile/${feedCreatorData.info.userId}`,
                    )
                  }}
                />
              ) : (
                <ProfileIcon
                  width={38}
                  height={38}
                  onClick={() => {
                    if (
                      currentUser.info.userId === feedCreatorData.info.userId
                    ) {
                      router.replace(`/loading?path=mypage`)
                      return
                    }
                    router.replace(
                      `/loading?path=profile/${feedCreatorData.info.userId}`,
                    )
                  }}
                />
              )}
              <Style.HeaderText>
                <Style.UserName>{feedCreatorData?.info.name}</Style.UserName>
                <Style.ImageTitle>{feedData.location}</Style.ImageTitle>
              </Style.HeaderText>
            </FlexBox>
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
            name={feedCreatorData.info.name}
          />
        </Style.ImageCard>
      )}
    </>
  )
}
