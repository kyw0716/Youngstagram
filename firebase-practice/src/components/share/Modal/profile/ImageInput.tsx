import { darkModeState } from "@share/recoil/recoilList"
import React, { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH6, FlexBox, Margin } from "ui"

type Props = {
  isPC: boolean
  isSubmit: boolean
  setImageFile: React.Dispatch<SetStateAction<File | undefined>>
  setImagePreviewSrc: React.Dispatch<SetStateAction<string>>
}

const Style = {
  ProfileEditInputLabel: styled.label`
    width: ${(props) => (props.about === "true" ? "100px" : "40%")};
    height: ${(props) => (props.about === "true" ? "50px" : "30px")};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4891ff;
    color: white;
    font-weight: bold;
    font-size: ${(props) => (props.about === "true" ? "16px" : "11px")};
    border-radius: ${(props) =>
      props.about === "true" ? "0 10px 10px 0" : "0 5px 5px 0"};
    cursor: pointer;
  `,
  ImagePreviewName: styled.div`
    width: ${(props) => (props.about === "true" ? "250px" : "60%")};
    height: ${(props) => (props.about === "true" ? "50px" : "30px")};
    border: 1.5px solid #bdbdbd;
    border-right: none;
    border-radius: ${(props) =>
      props.about === "true" ? "10px 0 0 10px" : "5px 0 0 5px"};
    display: flex;
    align-items: center;
    padding-left: 1vw;
  `,
  ProflieImageInput: styled.input`
    display: none;
  `,
}

export default function ImageInput({
  isPC,
  setImageFile,
  setImagePreviewSrc,
  isSubmit,
}: Props) {
  const [imageFileName, setImageFileName] = useState<string>("")
  const encodeFileToBase64 = (fileblob: File) => {
    const reader = new FileReader()
    if (fileblob === undefined) return
    reader.readAsDataURL(fileblob)
    return new Promise(() => {
      reader.onload = () => {
        setImagePreviewSrc(String(reader.result))
      }
    })
  }
  const isDarkMode = useRecoilValue(darkModeState)
  useEffect(() => {
    if (isSubmit) setImageFileName("")
  }, [isSubmit])
  return (
    <>
      <CustomH6 style={{ color: isDarkMode ? "white" : "black" }}>
        이미지 변경:
      </CustomH6>
      <Margin direction="column" size={isPC ? 10 : 5} />
      <FlexBox width={"100%"}>
        <Style.ImagePreviewName about={`${isPC}`}>
          {imageFileName ? `${imageFileName.slice(0, 10)}...` : ""}
        </Style.ImagePreviewName>
        <Style.ProfileEditInputLabel htmlFor="PROFILE-Edit" about={`${isPC}`}>
          이미지 선택
        </Style.ProfileEditInputLabel>
        <Style.ProflieImageInput
          type="file"
          id="PROFILE-Edit"
          accept="image/*"
          onChange={(event) => {
            if (event.target.files !== null) {
              setImageFile(event.target.files[0])
              setImageFileName(event.target.files[0].name)
              encodeFileToBase64(event.target.files[0])
            }
          }}
        />
      </FlexBox>
    </>
  )
}
