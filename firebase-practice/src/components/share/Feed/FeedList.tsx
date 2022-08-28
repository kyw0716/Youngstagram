import { FeedData } from "backend/dto"
import Image from "next/image"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH2, Margin } from "ui"
import FeedCard from "./FeedCard"

type Props = {
  FeedData: FeedData[]
  isCustomer: boolean
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

export default function FeedList({ FeedData, isCustomer: isMainPage }: Props) {
  const [windowSize, setWindowSize] = useState<number>(0)
  useEffect(() => {
    setWindowSize(window.innerWidth)
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth)
    })
  }, [])
  return (
    <Style.ImageContainer>
      {FeedData.length !== 0 ? (
        FeedData.sort(function (a, b) {
          return Number(b.uploadTime) - Number(a.uploadTime)
        }).map((data, index) => {
          return (
            <FeedCard
              key={index}
              feedData={data}
              isMainPage={isMainPage}
              windowSize={windowSize}
            />
          )
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
