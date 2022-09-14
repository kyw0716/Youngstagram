import { useEffect, useState } from "react"
import FeedSortList from "@share/Feed/FeedSortList"
import ProfileHeader from "@feature/profile/ownerProfile"
import styled from "styled-components"
import Layout from "components/layout"
import { FeedData } from "backend/dto"
import { useRecoilValue } from "recoil"
import { FeedDataFilter, userDataState } from "@share/recoil/recoilList"
import { useRouter } from "next/router"

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

export default function Profile() {
  const router = useRouter()
  const userData = useRecoilValue(userDataState)
  const feedDataType = useRecoilValue(FeedDataFilter)
  const [feedData, setFeedData] = useState<FeedData[]>([])

  useEffect(() => {
    if (userData !== undefined && userData.info.userId === "")
      router.push("/loading?path=mypage")
  }, [userData])

  useEffect(() => {
    if (userData === undefined || userData.feed === undefined) return
    if (feedDataType === "public") {
      setFeedData(userData.feed.filter((eachFeed) => !eachFeed.private))
      return
    }
    if (feedDataType === "private") {
      setFeedData(userData.feed.filter((eachFeed) => eachFeed.private))
      return
    }
    setFeedData(userData.feed)
  }, [feedDataType, userData])

  return (
    <Layout>
      {userData !== undefined && userData.info.userId !== "" ? (
        <Style.Wrapper>
          <ProfileHeader />
          {feedData !== undefined && <FeedSortList FeedData={feedData} />}
        </Style.Wrapper>
      ) : (
        <></>
      )}
    </Layout>
  )
}
