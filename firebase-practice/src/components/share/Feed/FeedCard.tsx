import { authService, DBService, storageService } from "@FireBase"
import { FeedData, UserData } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import {
  CommentIcon,
  CustomH6,
  FlexBox,
  FullHeart,
  HeartIcon,
  Margin,
  ShareIcon,
} from "ui"
import CommentModal from "../Modal/comment/CommentModal"
import FeedUploadModal from "../Modal/feed/FeedUploadModal"

type Props = {
  feedData: FeedData
  isMainPage: boolean
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

export default function FeedCard({ feedData }: Props) {
  const router = useRouter()
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData>()
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [likerList, setLikerList] = useState<string[]>([])

  useEffect(() => {
    onSnapshot(doc(DBService, "users", `${feedData.creator}`), (data) => {
      setUserData(data.data() as UserData)
    })
    onSnapshot(doc(DBService, "Comments", `${feedData.storageId}`), (doc) => {
      setCommentData(doc.data()?.AllComments)
    })
    onSnapshot(doc(DBService, "like", `${feedData.storageId}`), (doc) => {
      setLikerList(doc.data()?.likerList)
    })
  }, [])

  return (
    <>
      {userData && (
        <>
          <CommentModal
            isOpen={isCommentModalOpen}
            setIsOpen={setIsCommentModalOpen}
            feedData={feedData}
          />
          <Style.ImageCard>
            <Style.ImageHeader>
              <FlexBox
                width={"fit-content"}
                height={58}
                gap={15}
                alignItems={"center"}
              >
                <Image
                  src={
                    userData?.info.profileImage
                      ? `${userData?.info.profileImage}`
                      : "/profile.svg"
                  }
                  placeholder="blur"
                  blurDataURL="/profile.svg"
                  alt="creator"
                  width={38}
                  height={38}
                  style={{ borderRadius: 38, cursor: "pointer" }}
                  onClick={() => {
                    if (feedData.creator === userData.info.userId) {
                      router.push(`u/${userData.info.userId}`)
                    }
                    router.push(`/profile/${feedData.creator}`)
                  }}
                />
                <Style.HeaderText>
                  <Style.UserName>{userData?.info.name}</Style.UserName>
                  <Style.ImageTitle>{feedData.location}</Style.ImageTitle>
                </Style.HeaderText>
              </FlexBox>
            </Style.ImageHeader>
            <Image
              src={feedData.imageUrl ? feedData.imageUrl : "/empty.svg"}
              width={470}
              height={600}
              alt="Image"
              placeholder="blur"
              blurDataURL="/empty.svg"
              priority
            />
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
                <CustomH6>좋아요 {likerList.length}개</CustomH6>
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
              {feedData.desc.length > 20 ? (
                <>
                  {isShowMore ? (
                    <span>
                      {feedData.desc}
                      <CustomH6
                        style={{
                          cursor: "pointer",
                          fontWeight: "bolder",
                          color: "black",
                        }}
                        onClick={() => {
                          setIsShowMore(false)
                        }}
                      >
                        접기
                      </CustomH6>
                    </span>
                  ) : (
                    <FlexBox alignItems="flex-end">
                      {feedData.desc.slice(0, 20)}
                      <Margin direction="row" size={10} />
                      <CustomH6
                        style={{
                          cursor: "pointer",
                          fontWeight: "bolder",
                          color: "black",
                          flexShrink: 0,
                        }}
                        onClick={() => {
                          setIsShowMore(true)
                        }}
                      >
                        더보기...
                      </CustomH6>
                    </FlexBox>
                  )}
                </>
              ) : (
                <>{feedData.desc}</>
              )}
            </Style.DescBox>
          </Style.ImageCard>
        </>
      )}
    </>
  )
}
