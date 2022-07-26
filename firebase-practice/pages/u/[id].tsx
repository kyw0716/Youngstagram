import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import ProfilePageImageInput from "@feature/profile/ProfilePageImageInput"
import ProfilePageImageList from "@feature/profile/ProfilePageImageList"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import ProfileNameInput from "@feature/profile/ProfileNameInput"
import { GetServerSideProps } from "next"
import Header from "components/layout/Header"
import ProfileHeader from "@feature/profile/ProfileHeader"
import styled from "styled-components"
import { CustomH2, CustomH3, FlexBox, Margin } from "ui"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: fit-content;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  `,
  EmptyImage: styled.img`
    width: 150px;
  `,
}

export default function Profile({ userId }: Props) {
  const [userData, setUserData] = useState<DocumentData>()
  const [imageDataLength, setImageDataLength] = useState<number>(0)
  const [privateDataLength, setPrivateDataLength] = useState<number>(0)

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", userId)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", `${userId}`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      if (doc !== undefined && doc.data() !== undefined) {
        if ((doc.data() as DocumentData).images === undefined) return
        setImageDataLength((doc.data() as DocumentData).images.length)
        setPrivateDataLength(
          (
            (doc.data() as DocumentData).images as {
              image: string
              imageTitle: string
              private: boolean
            }[]
          ).filter((current) => current.private).length,
        )
      }
    })
  }, [])

  console.log(imageDataLength)

  return (
    <>
      <Header />
      {authService.currentUser?.displayName ? (
        // <ProfilePageImageInput userId={userId} />
        <></>
      ) : (
        <ProfileNameInput />
      )}
      <Style.Wrapper>
        <ProfileHeader
          imageDataLength={imageDataLength}
          privateImageDataLength={privateDataLength}
        />
        {imageDataLength === 0 ? (
          <FlexBox
            column={true}
            width="fit-content
          "
            alignItems="center"
          >
            <Style.EmptyImage src="/empty.svg" alt="empty" />
            <Margin direction="column" size={15} />
            <CustomH2>게시물이 없어용</CustomH2>
          </FlexBox>
        ) : (
          <ProfilePageImageList
            userId={userId}
            userName={userData !== undefined && userData.name}
          />
        )}
      </Style.Wrapper>
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
