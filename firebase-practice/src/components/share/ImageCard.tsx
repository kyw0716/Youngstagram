import { DBService, storageService } from "@FireBase"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
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
}

const Style = {
  ProfilePageImage: styled.img`
    width: 470px;
    height: 600px;
  `,
  ImageHeader: styled.div`
    width: 468px;
    height: 58px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    justify-content: space-between;
    border-radius: 10px;
    background-color: white;
    border-bottom: none;
    padding-right: 40px;
    position: relative;
    @media (max-width: 470px) {
      width: 100vw;
      height: 58px;
      display: flex;
      align-items: center;
      padding-left: 3%;
      justify-content: space-between;
      border-radius: 10px;
      background-color: white;
      padding-right: 3%;
      position: relative;
    }
  `,
  CreatorImage: styled.div`
    width: 38px;
    height: 38px;
    border: 1px solid lightgrey;
    border-radius: 100px;
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
  `,
  ThreeDotMenuBox: styled.div`
    width: 60px;
    height: 58px;
    display: flex;
    align-items: center;
    z-index: 10000;
  `,
  ThreeDotMenu: styled.img`
    width: 20px;
    height: 15px;
    cursor: pointer;
  `,
  ButtonBox: styled.div`
    width: 107px;
    height: 60px;
    border: 1px solid lightgrey;
    border-bottom: none;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 11px;
    right: 11px;
  `,
  DeleteOrPrivate: styled.button`
    width: 105px;
    height: 30px;
    -webkit-appearance: none;
    border: none;
    background-color: white;
    border-bottom: 1px solid lightgrey;
    cursor: pointer;
    &:hover {
      background-color: rgb(237, 237, 237);
    }
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
      }),
    }).then(async () => {
      await updateDoc(firestoreImageAllRef, {
        images: arrayUnion({
          image: url,
          imageTitle: title,
          private: !isPrivate,
          creator: userName,
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
    <Style.ImageCard>
      <Style.ImageHeader>
        <FlexBox
          width={"fit-content"}
          height={58}
          gap={15}
          alignItems={"center"}
        >
          <Style.CreatorImage />
          <Style.HeaderText>
            <Style.UserName>{userName}</Style.UserName>
            <Style.ImageTitle>{imageTitle}</Style.ImageTitle>
          </Style.HeaderText>
        </FlexBox>
        {isMainPage ? (
          <></>
        ) : (
          <Style.ThreeDotMenu
            src="/dot-menu.svg"
            alt="menu"
            onClick={handleThreeDotMenuClick}
          />
        )}
        {isMenuOpen ? (
          <Style.ButtonBox onMouseLeave={handleThreeDotMenuClick}>
            <Style.DeleteOrPrivate
              onClick={() => {
                handleDeleteImage(imageUrl, imageTitle, isPrivate)
              }}
            >
              삭제
            </Style.DeleteOrPrivate>
            <Style.DeleteOrPrivate
              onClick={() => {
                handlePrivateToggle(imageUrl, imageTitle, isPrivate)
              }}
            >
              {isPrivate ? "공개로 전환" : "비공개로 전환"}
            </Style.DeleteOrPrivate>
            <Style.DeleteOrPrivate onClick={handleThreeDotMenuClick}>
              x
            </Style.DeleteOrPrivate>
          </Style.ButtonBox>
        ) : (
          <></>
        )}
      </Style.ImageHeader>
      <Style.ProfilePageImage src={imageUrl} />
    </Style.ImageCard>
  )
}
