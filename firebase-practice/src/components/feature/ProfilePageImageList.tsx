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
}

export default function ProfilePageImageList() {
  const router = useRouter()
  const [userData, setUserData] = useState<DocumentData>()
  const [images, setImages] = useState<StorageReference[]>([])
  const [imageSrc, setImageSrc] = useState<string[]>([])

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", `${router.asPath.slice(3)}`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined) setImageSrc(userData.images)
  }, [userData])

  return (
    <>
      {imageSrc.map((src, index) => {
        if (imageSrc.indexOf(src) === index)
          return <Style.ProfilePageImage key={index} src={src} />
      })}
    </>
  )
}
