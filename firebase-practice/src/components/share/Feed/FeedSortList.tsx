import { userDataState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import Image from "next/image"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH2, Margin } from "ui"
import FeedSortingCard from "./FeedSortingCard"

type Props = {
  FeedData: FeedData[]
}

const Style = {
  ImageCard: styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  ImageContainer: styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 50px;
  `,
}

export default function FeedSortList({ FeedData }: Props) {
  const [feedDataSortedByUploadTime, setFeedDataSortedByUploadTime] = useState<
    FeedData[]
  >([])
  const userData = useRecoilValue(userDataState)
  useEffect(() => {
    if (FeedData.length > 0)
      setFeedDataSortedByUploadTime(
        (JSON.parse(JSON.stringify(FeedData)) as FeedData[]).sort(function (
          a,
          b,
        ) {
          return Number(b.uploadTime) - Number(a.uploadTime)
        }),
      )
  }, [FeedData])
  return (
    <Style.ImageContainer>
      {feedDataSortedByUploadTime.length !== 0 ? (
        feedDataSortedByUploadTime.map((data, index) => {
          return <FeedSortingCard key={index} feedData={data} />
        })
      ) : (
        <>
          <Image src={"/empty.svg"} width={150} height={150} alt="empty" />
          <Margin direction="column" size={15} />
          <CustomH2>게시물이 없어용</CustomH2>
        </>
      )}
    </Style.ImageContainer>
  )
}
