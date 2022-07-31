import { authService } from "@FireBase"
import { UserImageDataAll } from "backend/dto"
import Image from "next/image"
import { SetStateAction } from "react"
import styled from "styled-components"
import { CustomH2, Margin } from "ui"
import ImageCard from "./ImageCard"

type Props = {
  imageData: UserImageDataAll[]
  isMainPage: boolean
  userId: string
  setPickImageData?: React.Dispatch<
    SetStateAction<"public" | "private" | "all">
  >
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
    width: 100vw;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 50px;
  `,
}

export default function ImageList({
  imageData,
  isMainPage,
  userId,
  setPickImageData,
}: Props) {
  return (
    <Style.ImageContainer>
      {setPickImageData !== undefined &&
        (imageData.length !== 0 ? (
          imageData.map((data, index) => {
            return (
              <ImageCard
                key={index}
                userId={userId}
                userName={
                  isMainPage
                    ? data.creator
                    : `${authService.currentUser?.displayName}`
                }
                imageTitle={data.imageTitle}
                imageUrl={data.image}
                isPrivate={data.private}
                isMainPage={isMainPage}
                setPickImageData={setPickImageData}
                creatorProfile={data.creatorProfile}
              />
            )
          })
        ) : (
          <>
            <Image src={"/empty.svg"} width={150} height={150} alt="empty" />
            <Margin direction="column" size={15} />
            <CustomH2>게시물이 없어용</CustomH2>
          </>
        ))}
    </Style.ImageContainer>
  )
}
