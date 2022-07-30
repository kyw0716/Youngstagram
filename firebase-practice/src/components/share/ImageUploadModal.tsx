import { SetStateAction } from "react"
import styled from "styled-components"
import { CustomH3, FlexBox, Margin } from "ui"
import ModalForProfileEdit from "./ModalForProfileEdit"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  Icon: styled.img`
    width: 96px;
    height: 77px;
  `,
  TempButton: styled.label`
    background-color: #4891ff;
    width: fit-content;
    height: fit-content;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    border-radius: 10px;
  `,
  HiddenInput: styled.input`
    display: none;
  `,
}

export default function ImageUploadModal({ setIsOpen, isOpen }: Props) {
  return (
    <ModalForProfileEdit
      width="495px"
      height="537px"
      title="새 게시물 만들기"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPC={true}
    >
      <Style.Wrapper>
        <FlexBox column={true} width={"100%"} alignItems="center">
          <Style.Icon src="/image-upload.svg" alt="imageUpload" />
          <Margin direction="column" size={20} />
          <CustomH3>사진을 여기에 끌어다 놓으세요</CustomH3>
          <Margin direction="column" size={25} />
          <Style.TempButton htmlFor="IMAGE-UPLOAD-INPUT">
            컴퓨터에서 선택
          </Style.TempButton>
          <Style.HiddenInput
            type="file"
            accept="image/*"
            id="IMAGE-UPLOAD-INPUT"
          />
        </FlexBox>
      </Style.Wrapper>
    </ModalForProfileEdit>
  )
}
