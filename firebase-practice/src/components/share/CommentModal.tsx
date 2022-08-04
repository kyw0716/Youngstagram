import { UserImageDataAll } from "backend/dto"
import Image from "next/image"
import { SetStateAction } from "react"
import styled from "styled-components"
import { CustomH4, CustomH5, CustomH6, FlexBox, Margin } from "ui"
import YoungstagramModal from "./YoungstagramModal"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  imageData: UserImageDataAll
}

const Style = {
  Header: styled.div`
    display: flex;
    height: 70px;
    width: 499px;
    border-bottom: 1px solid lightgrey;
    align-items: center;
    padding-left: 15px;
  `,
}

export default function CommentModal({ isOpen, setIsOpen, imageData }: Props) {
  return (
    <YoungstagramModal
      width="70vw"
      height="95vh"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"이미지 상세"}
      isPC={true}
    >
      <FlexBox width="100%" height="100%">
        <Image
          src={imageData.imageUrl}
          width="611px"
          height="611px"
          alt="image"
        />
        <Style.Header>
          <Image
            width={32}
            height={32}
            style={{ borderRadius: "32px" }}
            src={
              imageData.creator.profileImage
                ? imageData.creator.profileImage
                : "/profile.svg"
            }
            alt="profile"
          />
          <Margin direction="row" size={14} />
          <FlexBox column={true}>
            <CustomH4 style={{ color: "black" }}>
              {imageData.creator.name}
            </CustomH4>
            <CustomH6>{imageData.location}</CustomH6>
          </FlexBox>
        </Style.Header>
      </FlexBox>
    </YoungstagramModal>
  )
}
