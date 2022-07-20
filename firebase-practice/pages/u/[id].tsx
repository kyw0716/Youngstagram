import { useEffect, useState } from "react"
import { DBService } from "../../src/FireBase"
import ProfilePageImageList from "../../src/components/feature/ProfilePageImageList"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import ProfileNameInput from "../../src/components/feature/ProfileNameInput"
import ProfilePageImageInput from "../../src/components/feature/ProfilePageImageInput"
import { GetServerSideProps } from "next"

export default function Page({ userId }: Props) {
  const [userData, setUserData] = useState<DocumentData>()

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", userId)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])

  return (
    <>
      {userData !== undefined && userData.name ? (
        <ProfilePageImageInput userId={userId} />
      ) : (
        <ProfileNameInput userId={userId} />
      )}
      <ProfilePageImageList userId={userId} />
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
