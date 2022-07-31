import { authService, DBService, storageService } from "@FireBase"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import Image from "next/image"
import { SetStateAction, useState } from "react"
import styled from "styled-components"
import { FlexBox } from "ui"

type Props = {
  imageUrl: string
  imageTitle: string
  isPrivate: boolean
  userId: string
  userName: string
  isMainPage: boolean
  setPickImageData: React.Dispatch<SetStateAction<"public" | "private" | "all">>
  creatorProfile: string
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
    padding-bottom: 60px;
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
    height: 120px;
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
    border-radius: 9px 9px 0px 0px;
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
}

export default function ImageCard({
  imageTitle,
  imageUrl,
  isPrivate,
  userId,
  userName,
  isMainPage,
  setPickImageData,
  creatorProfile,
  windowSize,
}: Props) {
  const handleDeleteImage = async (
    url: string,
    title: string,
    isPrivate: boolean,
  ) => {
    const storageImageRef = ref(storageService, `images/${userId}/${title}`)
    const firestoreImageRef = doc(DBService, "userData", `${userId}`)
    const firestoreImageAllRef = doc(DBService, "mainPage", "userImageDataAll")

    handleThreeDotMenuClick()

    await deleteObject(storageImageRef)

    await updateDoc(firestoreImageRef, {
      images: arrayRemove({
        image: url,
        imageTitle: title,
        private: isPrivate,
      }),
    })
    await updateDoc(firestoreImageAllRef, {
      images: arrayRemove({
        image: url,
        imageTitle: title,
        private: isPrivate,
        creator: userName,
        creatorProfile: authService.currentUser?.photoURL,
      }),
    })
    setPickImageData("all")
  }

  const handlePrivateToggle = async (
    url: string,
    title: string,
    isPrivate: boolean,
  ) => {
    const firestoreImageRef = doc(DBService, "userData", `${userId}`)
    const firestoreImageAllRef = doc(DBService, "mainPage", "userImageDataAll")

    handleThreeDotMenuClick()

    await updateDoc(firestoreImageRef, {
      images: arrayRemove({
        image: url,
        imageTitle: title,
        private: isPrivate,
      }),
    }).then(async () => {
      await updateDoc(firestoreImageRef, {
        images: arrayUnion({
          image: url,
          imageTitle: title,
          private: !isPrivate,
        }),
      })
    })
    await updateDoc(firestoreImageAllRef, {
      images: arrayRemove({
        image: url,
        imageTitle: title,
        private: isPrivate,
        creator: userName,
        creatorProfile: authService.currentUser?.photoURL,
      }),
    }).then(async () => {
      await updateDoc(firestoreImageAllRef, {
        images: arrayUnion({
          image: url,
          imageTitle: title,
          private: !isPrivate,
          creator: userName,
          creatorProfile: authService.currentUser?.photoURL,
        }),
      })
    })
    setPickImageData("all")
  }

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const handleThreeDotMenuClick = () => {
    setIsMenuOpen((current) => !current)
  }

  return (
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
              isMainPage
                ? creatorProfile
                  ? `${creatorProfile}`
                  : "/empty.svg"
                : authService.currentUser?.photoURL
                ? `${authService.currentUser?.photoURL}`
                : "/empty.svg"
            }
            alt="creator"
            width={38}
            height={38}
            style={{ borderRadius: 38 }}
          />
          <Style.HeaderText>
            <Style.UserName>{userName}</Style.UserName>
            <Style.ImageTitle>{imageTitle}</Style.ImageTitle>
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
              <Style.Deletebutton
                onClick={() => {
                  handleDeleteImage(imageUrl, imageTitle, isPrivate)
                }}
              >
                <Image src="/delete.svg" alt="delete" width={15} height={15} />
                삭제
              </Style.Deletebutton>
              <Style.PrivateToggleButton
                onClick={() => {
                  handlePrivateToggle(imageUrl, imageTitle, isPrivate)
                }}
              >
                {isPrivate ? (
                  <Image
                    src="/unLock.svg"
                    alt="unlock"
                    width={15}
                    height={15}
                  />
                ) : (
                  <Image src="/lock.svg" alt="lock" width={15} height={15} />
                )}

                {isPrivate ? "공개" : "비공개"}
              </Style.PrivateToggleButton>
              <Style.ExitButton onClick={handleThreeDotMenuClick}>
                <Image src="/logout.svg" alt="cancle" width={15} height={15} />
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
        src={imageUrl ? imageUrl : "/empty.svg"}
        width={470}
        height={600}
        alt="proflie"
      />
    </Style.ImageCard>
  )
}
