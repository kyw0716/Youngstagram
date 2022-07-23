import { DBService, storageService } from "@FireBase"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import styled from "styled-components"

type Props = {
  imageUrl: string
  imageTitle: string
  isPrivate: boolean
  userId: string
  userName: string
  isMainPage: boolean
}

const Style = {
  ProfilePageImage: styled.img`
    width: 470px;
    height: 600px;
  `,
  ImageHeader: styled.div`
    width: 470px;
    height: 58px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    gap: 15px;
    @media (max-width: 470px) {
      width: 100vw;
      height: 58px;
      display: flex;
      align-items: center;
      padding-left: 3%;
      gap: 15px;
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
  `,
  FlexBox: styled.div`
    display: flex;
  `,
}

export default function ImageCard({
  imageTitle,
  imageUrl,
  isPrivate,
  userId,
  userName,
  isMainPage,
}: Props) {
  const handleDeleteImage = async (
    url: string,
    title: string,
    isPrivate: boolean,
  ) => {
    const storageImageRef = ref(storageService, `images/${userId}/${title}`)
    const firestoreImageRef = doc(DBService, "userData", `${userId}`)
    const firestoreImageAllRef = doc(DBService, "mainPage", "userImageDataAll")

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
  }

  const handlePrivateToggle = async (
    url: string,
    title: string,
    isPrivate: boolean,
  ) => {
    const firestoreImageRef = doc(DBService, "userData", `${userId}`)
    const firestoreImageAllRef = doc(DBService, "mainPage", "userImageDataAll")

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
    await updateDoc(firestoreImageRef, {
      images: arrayUnion({
        image: url,
        imageTitle: title,
        private: !isPrivate,
      }),
    })
    await updateDoc(firestoreImageAllRef, {
      images: arrayUnion({
        image: url,
        imageTitle: title,
        private: !isPrivate,
        creator: userName,
      }),
    })
  }

  return (
    <Style.ImageCard>
      <Style.ImageHeader>
        <Style.CreatorImage />
        <Style.HeaderText>
          <Style.UserName>{userName}</Style.UserName>
          <Style.ImageTitle>{imageTitle}</Style.ImageTitle>
        </Style.HeaderText>
      </Style.ImageHeader>

      <Style.ProfilePageImage src={imageUrl} />
      {isMainPage ? (
        <></>
      ) : (
        <>
          <button
            onClick={() => {
              handleDeleteImage(imageUrl, imageTitle, isPrivate)
            }}
          >
            삭제
          </button>
          <button
            onClick={() => {
              handlePrivateToggle(imageUrl, imageTitle, isPrivate)
            }}
          >
            {isPrivate ? "공개로 전환" : "비공개로 전환"}
          </button>
        </>
      )}
    </Style.ImageCard>
  )
}
