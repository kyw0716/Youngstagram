import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import FeedList from "@share/FeedList"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { GetServerSideProps } from "next"
import ProfileHeader from "@feature/customerProfile"
import styled from "styled-components"
import { CustomH2, FlexBox, Margin } from "ui"
import Layout from "components/layout"
import Image from "next/image"
import { FeedData } from "backend/dto"

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
  const [allImageData, setAllImageData] = useState<FeedData[]>([])
  const [privateImageData, setPrivateImageData] = useState<FeedData[]>([])
  const [publicImageData, setPublicImageData] = useState<FeedData[]>([])

  const [pickImageData, setPickImageData] = useState<
    "all" | "public" | "private"
  >("all")
  const [dataToView, setDataToView] = useState<FeedData[]>([])

  useEffect(() => {
    const userDataRef = doc(DBService, "mainPage", "userImageDataAll")
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined && userData.images !== undefined) {
      setAllImageData(
        (userData.images as FeedData[]).filter(
          (data) => data.creator.userId === authService.currentUser?.uid,
        ),
      )
      setDataToView(
        (userData.images as FeedData[]).filter(
          (data) => data.creator.userId === authService.currentUser?.uid,
        ),
      )
      setPrivateImageData(
        (userData.images as FeedData[])
          .filter(
            (data) => data.creator.userId === authService.currentUser?.uid,
          )
          .filter((data) => data.private),
      )
      setPublicImageData(
        (userData.images as FeedData[])
          .filter(
            (data) => data.creator.userId === authService.currentUser?.uid,
          )
          .filter((data) => !data.private),
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
          isOwner={false}
        />
        {allImageData.length === 0 ? (
          <FlexBox column={true} width="fit-content" alignItems="center">
            <Image src="/empty.svg" alt="empty" width={150} height={150} />
            <Margin direction="column" size={15} />
            <CustomH2>게시물이 없어용</CustomH2>
          </FlexBox>
        ) : (
          <>
            {authService.currentUser?.uid !== undefined &&
              authService.currentUser.displayName !== null && (
                <FeedList
                  FeedData={dataToView}
                  isMainPage={false}
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
