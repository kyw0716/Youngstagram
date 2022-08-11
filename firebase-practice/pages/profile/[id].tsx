import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import FeedList from "@share/Feed/FeedList"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { GetServerSideProps } from "next"
import ProfileHeader from "@feature/customerProfile"
import styled from "styled-components"
import { CustomH2, FlexBox, Margin } from "ui"
import Layout from "components/layout"
import Image from "next/image"
import { FeedData, UserData } from "backend/dto"

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
  const [feedData, setFeedData] = useState<FeedData[]>([])

  const [pickImageData, setPickImageData] = useState<
    "all" | "public" | "private"
  >("all")

  useEffect(() => {
    const userDataRef = doc(DBService, "users", `${userId}`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      if (doc) {
        setUserData(doc.data())
      }
    })
  }, [])
  useEffect(() => {
    if (userData !== undefined && userData.feed !== undefined) {
      setFeedData((userData as UserData).feed)
    }
  }, [userData])

  return (
    <Layout>
      {userData !== undefined && (
        <Style.Wrapper>
          <ProfileHeader
            imageDataLength={feedData.length}
            userData={userData as UserData}
          />
          {feedData.length === 0 ? (
            <FlexBox column={true} width="fit-content" alignItems="center">
              <Image src="/empty.svg" alt="empty" width={150} height={150} />
              <Margin direction="column" size={15} />
              <CustomH2>게시물이 없어용</CustomH2>
            </FlexBox>
          ) : (
            <FeedList
              FeedData={feedData}
              isCustomer={true}
              setPickImageData={setPickImageData}
            />
          )}
        </Style.Wrapper>
      )}
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
