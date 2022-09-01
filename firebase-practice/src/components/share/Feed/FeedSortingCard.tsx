import { authService, DBService, storageService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
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
import { useRecoilValue } from "recoil"
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
  ThreeDotMenuBox: styled.div`
    width: 60px;
    height: 58px;
    display: flex;
    align-items: center;
    z-index: 10000;
  `,
  ThreeDotMenu: styled.div`
    display: flex;
    width: 100px;
    height: 58px;
    align-items: center;
    padding-right: 20px;
    justify-content: flex-end;
  `,
  ButtonBox: styled.div`
    width: 152px;
    height: 160px;
    border-bottom: none;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    position: absolute;
    top: 65px;
    right: 11px;
    box-shadow: rgba(99, 99, 99, 0.4) 0px 5px 4px 0px;
    border-radius: 9px;
    z-index: 2;
    background-color: white;
  `,
  ChatBalloon: styled.div`
    width: 30px;
    height: 30px;
    background-color: white;
    transform: rotate(45deg);
    position: absolute;
    right: 35px;
    top: 55px;
    box-shadow: rgba(99, 99, 99, 0.4) 0px 2px 8px 0px;
    z-index: 1;
  `,
  Deletebutton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    background-color: white;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
  PrivateToggleButton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    background-color: white;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
  ExitButton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    background-color: white;
    border-bottom: 1px solid lightgrey;
    border-radius: 0px 0px 9px 9px;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
  EditButton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    border-radius: 9px 9px 0px 0px;
    background-color: white;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
  CommentBox: styled.div`
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

export default function FeedSortingCard({ feedData }: Props) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] =
    useState<boolean>(false)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const userData = useRecoilValue(userDataState)
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [likerList, setLikerList] = useState<string[]>([])

  useEffect(() => {
    onSnapshot(doc(DBService, "Comments", `${feedData.storageId}`), (doc) => {
      setCommentData(doc.data()?.AllComments)
    })
    onSnapshot(doc(DBService, "like", `${feedData.storageId}`), (doc) => {
      setLikerList(doc.data()?.likerList)
    })
  }, [])

  const handleDeleteFeed = async () => {
    const feed: FeedData = {
      creator: feedData.creator,
      desc: feedData.desc,
      imageUrl: feedData.imageUrl,
      location: feedData.location,
      private: feedData.private,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
    }
    const storageImageRef = ref(
      storageService,
      `images/${feedData.creator}/${feedData.storageId}`,
    )
    const firestoreAllRef = doc(DBService, "mainPage", "userFeedDataAll")
    const firestoreCommentRef = doc(DBService, "Comments", feedData.storageId)
    const firestorePersonalRef = doc(DBService, `users`, `${feedData.creator}`)

    handleThreeDotMenuClick()

    await deleteObject(storageImageRef).catch((error) =>
      console.log(error.code),
    )
    await deleteDoc(firestoreCommentRef).catch((error) =>
      console.log(error.code),
    )

    await updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feed),
    }).catch((error) => console.log(error.code))
    await updateDoc(firestoreAllRef, {
      feed: arrayRemove(feed),
    }).catch((error) => console.log(error.code))
  }
  const handlePrivateToggle = async () => {
    const firestoreImageAllRef = doc(DBService, "mainPage", "userFeedDataAll")
    const firestorePersonalRef = doc(DBService, `users`, `${feedData.creator}`)
    const feed: FeedData = {
      creator: feedData.creator,
      desc: feedData.desc,
      imageUrl: feedData.imageUrl,
      location: feedData.location,
      private: feedData.private,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
    }
    const toggleFeed: FeedData = {
      creator: feedData.creator,
      desc: feedData.desc,
      imageUrl: feedData.imageUrl,
      location: feedData.location,
      private: !feedData.private,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
    }

    handleThreeDotMenuClick()
    await updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feed),
    }).then(async () => {
      await updateDoc(firestorePersonalRef, {
        feed: arrayUnion(toggleFeed),
      })
    })
    await updateDoc(firestoreImageAllRef, {
      feed: arrayRemove(feed),
    }).then(async () => {
      await updateDoc(firestoreImageAllRef, {
        feed: arrayUnion(toggleFeed),
      })
    })
  }
  const handleThreeDotMenuClick = () => {
    setIsMenuOpen((current) => !current)
  }

  return (
    <>
      {userData && (
        <>
          <CommentModal
            isOpen={isCommentModalOpen}
            setIsOpen={setIsCommentModalOpen}
            feedData={feedData}
          />
          <FeedUploadModal
            isOpen={isImageUploadModalOpen}
            setIsOpen={setIsImageUploadModalOpen}
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
                  alt="creator"
                  width={38}
                  height={38}
                  style={{ borderRadius: 38, cursor: "pointer" }}
                  onClick={() => {
                    router.push(`/profile/${feedData.creator}`)
                  }}
                />
                <Style.HeaderText>
                  <Style.UserName>{userData?.info.name}</Style.UserName>
                  <Style.ImageTitle>{feedData.location}</Style.ImageTitle>
                </Style.HeaderText>
              </FlexBox>
              <Style.ThreeDotMenu onClick={handleThreeDotMenuClick}>
                <Image
                  src="/dot-menu.svg"
                  alt="menu"
                  width={20}
                  height={15}
                  style={{ cursor: "pointer" }}
                />
              </Style.ThreeDotMenu>
              {isMenuOpen ? (
                <>
                  <Style.ButtonBox onMouseLeave={handleThreeDotMenuClick}>
                    <Style.EditButton
                      onClick={() => {
                        setIsImageUploadModalOpen(true)
                      }}
                    >
                      <Image
                        src="/edit.svg"
                        alt="edit"
                        width={15}
                        height={15}
                        priority
                      />
                      편집
                    </Style.EditButton>
                    <Style.PrivateToggleButton onClick={handlePrivateToggle}>
                      {feedData.private ? (
                        <Image
                          src="/unLock.svg"
                          alt="unlock"
                          width={15}
                          height={15}
                        />
                      ) : (
                        <Image
                          src="/lock.svg"
                          alt="lock"
                          width={15}
                          height={15}
                        />
                      )}

                      {feedData.private ? "공개" : "비공개"}
                    </Style.PrivateToggleButton>
                    <Style.Deletebutton onClick={handleDeleteFeed}>
                      <Image
                        src="/delete.svg"
                        alt="delete"
                        width={15}
                        height={15}
                        priority
                      />
                      삭제
                    </Style.Deletebutton>
                    <Style.ExitButton onClick={handleThreeDotMenuClick}>
                      <Image
                        src="/logout.svg"
                        alt="cancle"
                        width={15}
                        height={15}
                        priority
                      />
                      취소
                    </Style.ExitButton>
                  </Style.ButtonBox>
                  <Style.ChatBalloon />
                </>
              ) : (
                <></>
              )}
            </Style.ImageHeader>
            <Image
              src={feedData.imageUrl ? feedData.imageUrl : "/empty.svg"}
              width={470}
              height={600}
              alt="Image"
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
            <Style.CommentBox>
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
            </Style.CommentBox>
          </Style.ImageCard>
        </>
      )}
    </>
  )
}
