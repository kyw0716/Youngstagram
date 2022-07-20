import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import {
  listAll,
  ref,
  StorageReference,
  getDownloadURL,
} from "firebase/storage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { DBService, storageService } from "../../FireBase"

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
}

export default function ProfilePageImageList() {
  const router = useRouter()
  const [userData, setUserData] = useState<DocumentData>()
  const [images, setImages] = useState<StorageReference[]>([])
  const [imageData, setImageData] = useState<
    { image: string; imageTitle: string }[]
  >([])

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", `${router.asPath.slice(3)}`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined) setImageData(userData.images)
  }, [userData])

  return (
    <>
      {imageData.map((data, index) => {
        return (
          <Style.ImageCard key={index}>
            <Style.ProfilePageImage src={data.image} />
            <span>{data.imageTitle}</span>
          </Style.ImageCard>
        )
      })}
    </>
  )
}
