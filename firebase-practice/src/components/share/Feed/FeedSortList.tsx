import { FeedData } from "backend/dto"
import Image from "next/image"
import { SetStateAction, useEffect, useState } from "react"
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
  return (
    <Style.ImageContainer>
      {FeedData.length !== 0 ? (
        FeedData.map((data, index) => {
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
