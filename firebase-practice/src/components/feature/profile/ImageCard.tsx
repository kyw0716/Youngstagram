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
}

const Style = {
  ProfilePageImage: styled.img`
    width: 200px;
    height: 200px;
  `,
  ImageCard: styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
      <Style.ProfilePageImage src={imageUrl} />
      <span>{imageTitle}</span>
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
    </Style.ImageCard>
  )
}
