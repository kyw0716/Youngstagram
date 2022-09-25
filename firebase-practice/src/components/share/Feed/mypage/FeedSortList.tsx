import { darkModeState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import { CameraIcon } from "icons"
import React, { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH2Light, CustomH5Light } from "ui"
import FeedSortingCard from "./FeedSortingCard"

type Props = {
  feedData: FeedData[]
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsFeedUploadModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsUserListModalOpen: React.Dispatch<SetStateAction<boolean>>
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

export default function FeedSortList({
  feedData,
  setIsCommentModalOpen,
  setIsFeedUploadModalOpen,
  setIsUserListModalOpen: setIsLikeModalOpen,
}: Props) {
  const [feedDataSortedByUploadTime, setFeedDataSortedByUploadTime] =
    useState<FeedData[]>()
  useEffect(() => {
    if (feedData.length === 0) setFeedDataSortedByUploadTime([])
    if (feedData !== undefined && feedData.length > 0)
      setFeedDataSortedByUploadTime(
        (JSON.parse(JSON.stringify(feedData)) as FeedData[]).sort(function (
          a,
          b,
        ) {
          return Number(b.uploadTime) - Number(a.uploadTime)
        }),
      )
  }, [feedData])

  const isDarkMode = useRecoilValue(darkModeState)

  return (
    <Style.ImageContainer>
      {feedDataSortedByUploadTime !== undefined &&
      feedDataSortedByUploadTime.length !== 0 ? (
        feedDataSortedByUploadTime.map((data, index) => {
          return (
            <FeedSortingCard
              key={index}
              feedData={data}
              setIsCommentModalOpen={setIsCommentModalOpen}
              setIsFeedUploadModalOpen={setIsFeedUploadModalOpen}
              setIsLikeModalOpen={setIsLikeModalOpen}
            />
          )
        })
      ) : (
        <>
          <CameraIcon width={62} height={62} />
          <CustomH2Light style={{ color: isDarkMode ? "white" : "" }}>
            사진 공유
          </CustomH2Light>
          <CustomH5Light style={{ color: isDarkMode ? "white" : "" }}>
            사진을 공유하면 회원님의 프로필에 표시됩니다.
          </CustomH5Light>
        </>
      )}
    </Style.ImageContainer>
  )
}
