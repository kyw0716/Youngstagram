import { FeedData } from "backend/dto"
import styled from "styled-components"
import FeedGridCard from "./FeedGridCard"
import { v4 } from "uuid"
import useWindowSize from "lib/useWindowSize"
import { SetStateAction, useEffect, useState } from "react"

type Props = {
  feedDatas: FeedData[] | undefined
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  Wrapper: styled.div`
    width: 50vw;
    height: fit-content;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(100px, auto));
    grid-template-rows: repeat(autofill, minmax(100px, auto));
    grid-auto-flow: row;
    @media (max-width: 900px) {
      width: 100vw;
      gap: 3px;
    }
  `,
}

export default function FeedGrid({ feedDatas, setIsCommentModalOpen }: Props) {
  const windowSize = useWindowSize()
  const [feedDataSortedByUploadTime, setFeedDataSortedByUploadTime] = useState<
    FeedData[]
  >([])
  useEffect(() => {
    if (feedDatas === undefined) return
    if (feedDatas.length >= 0)
      setFeedDataSortedByUploadTime(
        (JSON.parse(JSON.stringify(feedDatas)) as FeedData[]).sort(function (
          a,
          b,
        ) {
          return Number(a.uploadTime) - Number(b.uploadTime)
        }),
      )
  }, [feedDatas])
  return (
    <Style.Wrapper
      style={{
        width: windowSize < 900 ? "100vw" : "50vw",
        gap: windowSize < 900 ? "3px" : "10px",
      }}
    >
      {feedDataSortedByUploadTime !== undefined && (
        <>
          {feedDataSortedByUploadTime.map((feedData) => {
            return (
              <FeedGridCard
                feedData={feedData}
                key={v4()}
                setIsCommentModalOpen={setIsCommentModalOpen}
              />
            )
          })}
        </>
      )}
    </Style.Wrapper>
  )
}
