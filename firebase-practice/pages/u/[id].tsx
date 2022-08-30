import { useEffect, useState } from "react"
import FeedSortList from "@share/Feed/FeedSortList"
import ProfileHeader from "@feature/ownerProfile"
import styled from "styled-components"
import { CustomH2, FlexBox, Margin } from "ui"
import Layout from "components/layout"
import Image from "next/image"
import { FeedData } from "backend/dto"
import { useRecoilValue } from "recoil"
import { FeedDataFilter, userDataState } from "@share/recoil/recoilList"

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
  const userData = useRecoilValue(userDataState)
  const feedDataType = useRecoilValue(FeedDataFilter)
  const [feedData, setFeedData] = useState<FeedData[]>([])

  useEffect(() => {
    if (userData.feed === undefined) return
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
      <Style.Wrapper>
        <ProfileHeader />
        {feedData !== undefined && feedData.length === 0 ? (
          <FlexBox column={true} width="fit-content" alignItems="center">
            <Image src="/empty.svg" alt="empty" width={150} height={150} />
            <Margin direction="column" size={15} />
            <CustomH2>게시물이 없어용</CustomH2>
          </FlexBox>
        ) : (
          <FeedSortList FeedData={feedData} />
        )}
      </Style.Wrapper>
    </Layout>
  )
}
