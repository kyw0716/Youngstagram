import {
  arrayRemove,
  doc,
  DocumentData,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { DBService, storageService } from "@FireBase"
import { deleteObject, ref } from "firebase/storage"

type Props = {
  userId: string
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

export default function ProfilePageImageList({ userId }: Props) {
  const [userData, setUserData] = useState<DocumentData>()
  const [imageData, setImageData] = useState<
    { image: string; imageTitle: string }[]
  >([])

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", `${userId}`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined) setImageData(userData.images)
  }, [userData])

  const handleDeleteImage = async (url: string, title: string) => {
    const storageImageRef = ref(storageService, `images/${userId}/${title}`)
    const firestoreImageRef = doc(DBService, "userData", `${userId}`)

    await deleteObject(storageImageRef)

    await updateDoc(firestoreImageRef, {
      images: arrayRemove({ image: url, imageTitle: title }),
    })
  }

  return (
    <Style.FlexBox>
      {imageData !== undefined &&
        imageData.map((data, index) => {
          return (
            <Style.ImageCard key={index}>
              <Style.ProfilePageImage src={data.image} />
              <span>{data.imageTitle}</span>
              <button
                onClick={() => {
                  handleDeleteImage(data.image, data.imageTitle)
                }}
              >
                삭제
              </button>
            </Style.ImageCard>
          )
        })}
    </Style.FlexBox>
  )
}
