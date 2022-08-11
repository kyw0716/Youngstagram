import { authService, DBService, storageService } from "@FireBase"
import { FeedData } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import Image from "next/image"
import { useRouter } from "next/router"
import { SetStateAction, useState } from "react"
import styled from "styled-components"
import {
  CommentIcon,
  CustomH6,
  FlexBox,
  HeartIcon,
  Margin,
  ShareIcon,
} from "ui"
import CommentModal from "./CommentModal"
import FeedUploadModal from "./FeedUploadModal"

type Props = {
  imageData: FeedData
  isMainPage: boolean
  setPickImageData: React.Dispatch<SetStateAction<"public" | "private" | "all">>
  windowSize: number
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

export default function FeedCard({
  imageData,
  isMainPage,
  setPickImageData,
  windowSize,
}: Props) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] =
    useState<boolean>(false)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)

  const handleDeleteImage = async () => {
    const storageImageRef = ref(
      storageService,
      `images/${authService.currentUser?.uid}/${imageData.storageId}`,
    )
    const firestoreImageAllRef = doc(DBService, "mainPage", "userImageDataAll")
    const firestoreCommentRef = doc(DBService, "Comments", imageData.storageId)

    handleThreeDotMenuClick()

    await deleteObject(storageImageRef)
    await deleteDoc(firestoreCommentRef)

    await updateDoc(firestoreImageAllRef, {
      images: arrayRemove({
        creator: {
          id: imageData.creator.userId,
          name: imageData.creator.name,
          profileImage: imageData.creator.profileImage,
        },
        desc: imageData.desc,
        imageUrl: imageData.imageUrl,
        location: imageData.location,
        private: imageData.private,
        storageId: imageData.storageId,
        uploadTime: imageData.uploadTime,
      }),
    })
    setPickImageData("all")
  }
  const handlePrivateToggle = async () => {
    const firestoreImageAllRef = doc(DBService, "mainPage", "userImageDataAll")

    handleThreeDotMenuClick()

    await updateDoc(firestoreImageAllRef, {
      images: arrayRemove({
        creator: {
          id: imageData.creator.userId,
          name: imageData.creator.name,
          profileImage: imageData.creator.profileImage,
        },
        desc: imageData.desc,
        imageUrl: imageData.imageUrl,
        location: imageData.location,
        private: imageData.private,
        storageId: imageData.storageId,
        uploadTime: imageData.uploadTime,
      }),
    }).then(async () => {
      await updateDoc(firestoreImageAllRef, {
        images: arrayUnion({
          creator: {
            id: imageData.creator.userId,
            name: imageData.creator.name,
            profileImage: imageData.creator.profileImage,
          },
          desc: imageData.desc,
          imageUrl: imageData.imageUrl,
          location: imageData.location,
          private: !imageData.private,
          storageId: imageData.storageId,
          uploadTime: imageData.uploadTime,
        }),
      })
    })
    setPickImageData("all")
  }
  const handleThreeDotMenuClick = () => {
    setIsMenuOpen((current) => !current)
  }

  return (
    <>
      <CommentModal
        isOpen={isCommentModalOpen}
        setIsOpen={setIsCommentModalOpen}
        imageData={imageData}
        windowSize={windowSize}
      />
      <FeedUploadModal
        isOpen={isImageUploadModalOpen}
        setIsOpen={setIsImageUploadModalOpen}
        feedData={imageData}
      />
      <Style.ImageCard
        style={windowSize < 900 ? { width: "95%" } : { width: 470 }}
      >
        <Style.ImageHeader
          style={
            windowSize < 900
              ? { width: "95%", padding: "0px 5px" }
              : { width: 470 }
          }
        >
          <FlexBox
            width={"fit-content"}
            height={58}
            gap={15}
            alignItems={"center"}
          >
            <Image
              src={
                imageData.creator.profileImage !== "null"
                  ? `${imageData.creator.profileImage}`
                  : "/profile.svg"
              }
              alt="creator"
              width={38}
              height={38}
              style={{ borderRadius: 38, cursor: "pointer" }}
              onClick={() => {
                router.push(`/profile/${imageData.creator.userId}`)
              }}
            />
            <Style.HeaderText>
              <Style.UserName>
                {imageData.creator ? imageData.creator.name : ""}
              </Style.UserName>
              <Style.ImageTitle>{imageData.location}</Style.ImageTitle>
            </Style.HeaderText>
          </FlexBox>
          {isMainPage ? (
            <></>
          ) : (
            <Style.ThreeDotMenu onClick={handleThreeDotMenuClick}>
              <Image
                src="/dot-menu.svg"
                alt="menu"
                width={20}
                height={15}
                style={{ cursor: "pointer" }}
              />
            </Style.ThreeDotMenu>
          )}
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
                  {imageData.private ? (
                    <Image
                      src="/unLock.svg"
                      alt="unlock"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <Image src="/lock.svg" alt="lock" width={15} height={15} />
                  )}

                  {imageData.private ? "공개" : "비공개"}
                </Style.PrivateToggleButton>
                <Style.Deletebutton onClick={handleDeleteImage}>
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
          src={imageData.imageUrl ? imageData.imageUrl : "/empty.svg"}
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
          <HeartIcon />
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

        <Style.CommentBox>
          {imageData.desc.length > 20 ? (
            <>
              {isShowMore ? (
                <span>
                  {imageData.desc}
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
                  {imageData.desc.slice(0, 20)}
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
            <>{imageData.desc}</>
          )}
        </Style.CommentBox>
      </Style.ImageCard>
    </>
  )
}
