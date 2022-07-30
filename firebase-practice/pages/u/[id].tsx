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
import Footer from "components/layout/Footer"
import Layout from "components/layout"
import Image from "next/image"

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
}

export default function Profile({ userId }: Props) {
  const [userData, setUserData] = useState<DocumentData>()
  const [allImageData, setAllImageData] = useState<
    {
      image: string
      imageTitle: string
      private: boolean
      creator: string
      creatorProfile: string
    }[]
  >([])
  const [privateImageData, setPrivateImageData] = useState<
    {
      image: string
      imageTitle: string
      private: boolean
      creator: string
      creatorProfile: string
    }[]
  >([])
  const [publicImageData, setPublicImageData] = useState<
    {
      image: string
      imageTitle: string
      private: boolean
      creator: string
      creatorProfile: string
    }[]
  >([])

  const [pickImageData, setPickImageData] = useState<
    "all" | "public" | "private"
  >("all")
  const [dataToView, setDataToView] = useState<
    {
      image: string
      imageTitle: string
      private: boolean
      creator: string
      creatorProfile: string
    }[]
  >([])

  useEffect(() => {
    const userDataRef = doc(DBService, "userData", userId)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined && userData.images !== undefined) {
      setAllImageData(userData.images)
      setDataToView(userData.images)
      setPrivateImageData(
        (
          userData.images as {
            image: string
            imageTitle: string
            private: boolean
            creator: string
            creatorProfile: string
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
            creatorProfile: string
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
    <Layout>
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
            <Image src="/empty.svg" alt="empty" width={150} height={150} />
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
                  setPickImageData={setPickImageData}
                />
              )}
          </>
        )}
      </Style.Wrapper>
    </Layout>
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
