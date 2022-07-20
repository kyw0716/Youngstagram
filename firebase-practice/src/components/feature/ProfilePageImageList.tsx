import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { DBService } from "../../FireBase"

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

  return (
    <Style.FlexBox>
      {imageData !== undefined &&
        imageData.map((data, index) => {
          return (
            <Style.ImageCard key={index}>
              <Style.ProfilePageImage src={data.image} />
              <span>{data.imageTitle}</span>
            </Style.ImageCard>
          )
        })}
    </Style.FlexBox>
  )
}
