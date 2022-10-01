import { useEffect, useState } from "react"
import { DBService } from "@FireBase"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { GetServerSideProps } from "next"
import ProfileHeader from "@feature/profile/customerProfile"
import styled from "styled-components"
import { Margin } from "ui"
import Layout from "components/layout"
import { FeedData, UserData } from "backend/dto"
import { useRouter } from "next/router"
import FeedGrid from "@share/Feed/profilepage/FeedGrid"
import { useRecoilValue } from "recoil"
import { feedDataState, userListState } from "@share/recoil/recoilList"
import CommentModal from "@share/Modal/comment/CommentModal"
import UserListModal from "@share/Modal/userList/UserListModal"

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
  const [feedData, setFeedData] = useState<FeedData[]>()
  const selectedFeedData = useRecoilValue(feedDataState)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false)
  const [isUserListModalOpen, setIsUserListModalOpen] = useState<boolean>(false)
  const userList = useRecoilValue(userListState)

  useEffect(() => {
    setIsUserListModalOpen(false)
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
    setFeedData(userData?.feed)
  }, [userData, router.query])

  return (
    <Layout>
      <CommentModal
        isOpen={isCommentModalOpen}
        setIsOpen={setIsCommentModalOpen}
        feedData={selectedFeedData}
      />
      <UserListModal
        userList={userList}
        isOpen={isUserListModalOpen}
        setIsOpen={setIsUserListModalOpen}
        title={""}
      />
      <Style.Wrapper>
        <ProfileHeader
          imageDataLength={feedData === undefined ? 0 : feedData.length}
          userData={userData as UserData}
          setIsUserListModalOpen={setIsUserListModalOpen}
        />
        {feedData !== undefined && (
          <FeedGrid
            feedDatas={feedData ? feedData : undefined}
            setIsCommentModalOpen={setIsCommentModalOpen}
          />
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
