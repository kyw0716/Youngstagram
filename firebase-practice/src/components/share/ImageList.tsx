import { authService } from "@FireBase"
import styled from "styled-components"
import ImageCard from "./ImageCard"

type Props = {
  imageData: {
    image: string
    imageTitle: string
    private: boolean
    creator: string
  }[]
  isMainPage: boolean
  userId: string
}

const Style = {
  ProfilePageImage: styled.img`
    width: 200px;
    height: 200px;
  `,
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

export default function ImageList({ imageData, isMainPage, userId }: Props) {
  return (
    <Style.ImageContainer>
      {imageData.map((data, index) => {
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
          />
        )
      })}
    </Style.ImageContainer>
  )
}
