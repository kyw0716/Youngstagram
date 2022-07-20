import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { DBService, storageService } from "../../src/FireBase"
import styled from "styled-components"
import ProfilePageImageList from "../../src/components/feature/ProfilePageImageList"
import {
  arrayUnion,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import ProfileNameInput from "../../src/components/feature/ProfileNameInput"
import ProfilePageImageInput from "../../src/components/feature/ProfilePageImageInput"

const Style = {
  PreviewImageSection: styled.div`
    width: 200px;
    height: 200px;
    border: 1px solid black;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  PreviewImage: styled.img`
    width: 150px;
    height: 150px;
  `,
}

export default function Profile() {
  const router = useRouter()
  const [userData, setUserData] = useState<DocumentData>()

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", `${router.asPath.slice(3)}`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])

  return (
    <>
      {userData !== undefined && userData.name ? (
        <ProfilePageImageInput />
      ) : (
        <ProfileNameInput />
      )}
      <ProfilePageImageList />
    </>
  )
}

export async function getServerSideProps(context: string) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
