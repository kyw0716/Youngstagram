import { useEffect, useState } from "react"
import { DBService } from "@FireBase"
import ProfilePageImageInput from "@feature/profile/ProfilePageImageInput"
import ProfilePageImageList from "@feature/profile/ProfilePageImageList"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import ProfileNameInput from "@feature/profile/ProfileNameInput"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import Header from "layout/Header"

export default function Profile({ userId }: Props) {
  const [userData, setUserData] = useState<DocumentData>()
  const router = useRouter()

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", userId)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])

  return (
    <>
      <Header />
      <button
        onClick={() => {
          router.push("/")
        }}
      >
        홈으로
      </button>
      <br />
      {userData !== undefined && userData.name ? (
        <ProfilePageImageInput
          userId={userId}
          userName={userData !== undefined && userData.name}
        />
      ) : (
        <ProfileNameInput userId={userId} />
      )}
      <br />
      <ProfilePageImageList
        userId={userId}
        userName={userData !== undefined && userData.name}
      />
    </>
  )
}

type Props = {
  userId: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const userId = context.params?.id as string
  return {
    props: {
      userId,
    },
  }
}
