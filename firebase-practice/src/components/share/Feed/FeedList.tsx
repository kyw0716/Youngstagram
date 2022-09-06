import { userDataState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import Image from "next/image"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH2, CustomH2Light, CustomH5Light, Margin } from "ui"
import FeedCard from "./FeedCard"

type Props = {
  FeedData: FeedData[] | undefined
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
  return (
    <Style.ImageContainer>
      {FeedData !== undefined && FeedData.length !== 0 ? (
        FeedData.sort(function (a, b) {
          return Number(b.uploadTime) - Number(a.uploadTime)
        }).map((data, index) => {
          return (
            <FeedCard key={index} feedData={data} isMainPage={isMainPage} />
          )
        })
      ) : (
        <>
          {FeedData?.length === 0 && (
            <>
              <Image src={"/camera.webp"} width={62} height={62} alt="camera" />
              <CustomH2Light>사진 공유</CustomH2Light>
              <CustomH5Light>
                상단 바에 있는 아이콘을 클릭하여 사진을 공유할 수 있습니다.
              </CustomH5Light>
            </>
          )}
        </>
      )}
    </Style.ImageContainer>
  )
}
