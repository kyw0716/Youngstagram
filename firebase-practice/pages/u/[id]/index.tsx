import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import ProfilePageImageInput from "@feature/profile/ProfilePageImageInput"
import ImageList from "@share/ImageList"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import ProfileNameInput from "@feature/profile/ProfileNameInput"
import { GetServerSideProps } from "next"
import Header from "components/layout/Header"
import ProfileHeader from "@feature/profile/ProfileHeader"
import styled from "styled-components"
import { CustomH2, FlexBox, Margin } from "ui"

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
  const [allImageData, setAllImageData] = useState<
    { image: string; imageTitle: string; private: boolean; creator: string }[]
  >([])
  const [privateImageData, setPrivateImageData] = useState<
    { image: string; imageTitle: string; private: boolean; creator: string }[]
  >([])
  const [publicImageData, setPublicImageData] = useState<
    { image: string; imageTitle: string; private: boolean; creator: string }[]
  >([])

  const [pickImageData, setPickImageData] = useState<
    "all" | "public" | "private"
  >("all")
  const [dataToView, setDataToView] = useState<
    { image: string; imageTitle: string; private: boolean; creator: string }[]
  >([])

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", userId)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined) {
      setAllImageData(userData.images)
      setDataToView(userData.images)
      setPrivateImageData(
        (
          userData.images as {
            image: string
            imageTitle: string
            private: boolean
            creator: string
          }[]
        ).filter((data) => data.private),
      )
      setPublicImageData(
        (
          userData.images as {
            image: string
            imageTitle: string
            private: boolean
            creator: string
          }[]
        ).filter((data) => !data.private),
      )
    }
  }, [userData])

  useEffect(() => {
    if (pickImageData === "all") {
      setDataToView(allImageData)
      return
    }
    if (pickImageData === "public") {
      setDataToView(publicImageData)
      return
    }
    if (pickImageData === "private") {
      setDataToView(privateImageData)
    }
  }, [pickImageData])

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
          imageDataLength={allImageData.length}
          privateImageDataLength={privateImageData.length}
          setPickImageData={setPickImageData}
          pickImageData={pickImageData}
        />
        {allImageData.length === 0 ? (
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
          <>
            {authService.currentUser?.uid !== undefined &&
              authService.currentUser.displayName !== null && (
                <ImageList
                  imageData={dataToView}
                  isMainPage={false}
                  userId={authService.currentUser?.uid}
                />
              )}
          </>
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
