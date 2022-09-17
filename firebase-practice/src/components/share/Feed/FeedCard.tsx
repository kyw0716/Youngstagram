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
import CommentModal from "../Modal/comment/CommentModal"
import FollowListModal from "@share/Modal/follow/FollowListModal"
import useWindowSize from "lib/useWindowSize"

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
  DescBox: styled.div`
    width: 100%;
    white-space: pre-wrap;
    padding: 0px 10px;
    max-height: 200px;
    display: flex;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  `,
}

export default function FeedCard({ feedData, setIsCommentModalOpen }: Props) {
  const router = useRouter()
  // const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isLikerListModalOpen, setIsLikerLIstModalOpen] =
    useState<boolean>(false)
  const [feedCreatorData, setFeedCreatorData] = useState<UserData>()
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [likerList, setLikerList] = useState<string[]>([])
  const currentUser = useRecoilValue(userDataState)
  const windowSize = useWindowSize()
  const setSelectedFeedData = useSetRecoilState(feedDataState)

  useEffect(() => {
    onSnapshot(doc(DBService, "users", `${feedData.creator}`), (data) => {
      setFeedCreatorData(data.data() as UserData)
    })
    onSnapshot(doc(DBService, "Comments", `${feedData.storageId}`), (doc) => {
      setCommentData(doc.data()?.AllComments)
    })
    onSnapshot(doc(DBService, "like", `${feedData.storageId}`), (doc) => {
      setLikerList(doc.data()?.likerList)
    })
  }, [feedData])

  return (
    <>
      {feedCreatorData && (
        <>
          <FollowListModal
            userList={likerList}
            isOpen={isLikerListModalOpen}
            setIsOpen={setIsLikerLIstModalOpen}
            title={"좋아요"}
            isPC={windowSize > 900 ? true : false}
          />
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
                        router.push(`/loading?path=mypage`)
                        return
                      }
                      router.push(
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
                        return
                      }
                      router.push(
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
            <FlexBox
              width={"100%"}
              height={"fit-content"}
              justifyContents="flex-start"
              alignItems="center"
            >
              <Margin direction="row" size={10} />
              {likerList !== undefined &&
              authService.currentUser !== null &&
              likerList.includes(authService.currentUser.uid) ? (
                <FullHeart storgateId={feedData.storageId} />
              ) : (
                <HeartIcon storgateId={feedData.storageId} />
              )}
              <Margin direction="row" size={15} />
              <CommentIcon
                onClick={() => {
                  setSelectedFeedData(feedData)
                  setIsCommentModalOpen(true)
                }}
              />
              <Margin direction="row" size={15} />
              <ShareIcon />
            </FlexBox>
            <Margin direction="column" size={15} />
            <FlexBox
              style={{ paddingLeft: "10px", marginTop: "-10px" }}
              gap={10}
            >
              {likerList !== undefined ? (
                <CustomH6
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsLikerLIstModalOpen(true)
                  }}
                >
                  좋아요 {likerList.length}개
                </CustomH6>
              ) : (
                <CustomH6>좋아요 0개</CustomH6>
              )}
              {commentData !== undefined ? (
                <CustomH6>댓글 {commentData.length}개</CustomH6>
              ) : (
                <CustomH6>댓글 0개</CustomH6>
              )}
            </FlexBox>
            <Style.DescBox>
              <FlexBox alignItems="center">
                {feedData.desc.length > 0 ? (
                  <CustomH5 style={{ flexShrink: "0" }}>
                    {feedCreatorData.info?.name}
                  </CustomH5>
                ) : (
                  <CustomH6
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid lightgrey",
                    }}
                    onClick={() => {
                      setSelectedFeedData(feedData)
                      setIsCommentModalOpen(true)
                    }}
                  >
                    더보기
                  </CustomH6>
                )}
                <Margin direction="row" size={10} />
                {feedData.desc.length > 10 ? (
                  <FlexBox alignItems="center">
                    <CustomH5Light>{`${feedData.desc.slice(
                      0,
                      11,
                    )}...`}</CustomH5Light>
                    <Margin direction="row" size={5} />
                    <CustomH6
                      style={{
                        cursor: "pointer",
                        borderBottom: "1px solid lightgrey",
                      }}
                      onClick={() => {
                        setSelectedFeedData(feedData)
                        setIsCommentModalOpen(true)
                      }}
                    >
                      더보기
                    </CustomH6>
                  </FlexBox>
                ) : (
                  <CustomH5Light>{feedData.desc}</CustomH5Light>
                )}
              </FlexBox>
            </Style.DescBox>
          </Style.ImageCard>
        </>
      )}
    </>
  )
}
