import { darkModeState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import { CameraIcon } from "icons"
import React, { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH2Light, CustomH5Light } from "ui"
import { v4 } from "uuid"
import FeedSortingCard from "./FeedSortingCard"

type Props = {
  feedData: FeedData[] | undefined
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
  const isDarkMode = useRecoilValue(darkModeState)

  return (
    <Style.ImageContainer>
      {feedData !== undefined && feedData.length !== 0 ? (
        <>
          {[...feedData]
            .sort((a, b) => {
              return Number(b.uploadTime) - Number(a.uploadTime)
            })
            .map((data) => {
              return (
                <FeedSortingCard
                  key={v4()}
                  feedData={data}
                  setIsCommentModalOpen={setIsCommentModalOpen}
                  setIsFeedUploadModalOpen={setIsFeedUploadModalOpen}
                  setIsLikeModalOpen={setIsLikeModalOpen}
                />
              )
            })}
        </>
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
