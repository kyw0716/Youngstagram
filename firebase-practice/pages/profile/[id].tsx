import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { GetServerSideProps } from "next"
import ProfileHeader from "@feature/customerProfile"
import styled from "styled-components"
import { CustomH2, FlexBox, Margin } from "ui"
import Layout from "components/layout"
import Image from "next/image"
import { FeedData, UserData } from "backend/dto"
import { useRouter } from "next/router"
import FeedGrid from "@share/Feed/FeedGrid"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { userDataState } from "@share/recoil/recoilList"
import { onAuthStateChanged } from "firebase/auth"
import getUserDataByUid from "lib/getUserDataByUid"

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
  const router = useRouter()
  const [userData, setUserData] = useState<DocumentData>()
  const [feedData, setFeedData] = useState<FeedData[]>([])
  const setCurrentUserData = useSetRecoilState(userDataState)

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        getUserDataByUid(user.uid).then((data) => {
          setCurrentUserData(data as UserData)
        })
      }
    })
  }, [])

  useEffect(() => {
    if (router.query !== undefined && router.query.id !== userId)
      router.push(`/profile/${router.query.id}`)
    const userDataRef = doc(DBService, "users", `${userId}`)
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      if (doc) {
        setUserData(doc.data())
      }
    })
  }, [router.query, userId])
  useEffect(() => {
    if (userData !== undefined) {
      setFeedData(
        userData.feed === undefined ? [] : (userData as UserData).feed,
      )
    }
  }, [userData, router.query])

  return (
    <Layout>
      <Style.Wrapper>
        <ProfileHeader
          imageDataLength={feedData.length}
          userData={
            userData !== undefined ? (userData as UserData) : ({} as UserData)
          }
        />
        {feedData.length === 0 ? (
          <FlexBox column={true} width="fit-content" alignItems="center">
            <Image src="/empty.svg" alt="empty" width={150} height={150} />
            <Margin direction="column" size={15} />
            <CustomH2>게시물이 없어용</CustomH2>
          </FlexBox>
        ) : (
          <FeedGrid feedDatas={feedData} />
        )}
      </Style.Wrapper>
      <Margin direction="column" size={30} />
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
