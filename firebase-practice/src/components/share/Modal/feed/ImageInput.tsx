import { FeedData } from "backend/dto"
import { SetStateAction, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import styled from "styled-components"
import { CustomH3, FeedUPloadModalIcon, FlexBox, Margin } from "ui"

type Props = {
  feedData?: FeedData
  setIsFileExist: React.Dispatch<SetStateAction<boolean>>
  setImagePreviewSrc: React.Dispatch<SetStateAction<string>>
  setImageFile: React.Dispatch<SetStateAction<File | undefined>>
}

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  TempButton: styled.label`
    background-color: #4891ff;
    width: fit-content;
    height: fit-content;
    padding: 10px;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    border-radius: 10px;
  `,
  HiddenInput: styled.input`
    display: none;
  `,
}

export default function ImageInput({
  feedData,
  setIsFileExist,
  setImagePreviewSrc,
  setImageFile,
}: Props) {
  const {
    getRootProps,
    acceptedFiles,
    getInputProps,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    accept: { "image/*": [] },
  })

  useEffect(() => {
    if (acceptedFiles.length === 0 && feedData === undefined) {
      setIsFileExist(false)
      return
    }
    setImagePreviewSrc("")
    encodeFileToBase64(acceptedFiles[0])
    setImageFile(acceptedFiles[0])
    setIsFileExist(true)
  }, [acceptedFiles])

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

  return (
    <Style.Wrapper
      {...getRootProps({ className: "dropzone" })}
      about={`${isDragAccept}`}
      style={
        isDragReject
          ? { backgroundColor: "#ff4848" }
          : isDragAccept
          ? { backgroundColor: "#4891ff" }
          : { backgroundColor: "white" }
      }
    >
      <FlexBox column={true} width={"100%"} alignItems="center">
        <FeedUPloadModalIcon />
        <Margin direction="column" size={20} />
        {isDragReject ? (
          <CustomH3 style={{ color: "white" }}>사진만 올릴 수 있어요</CustomH3>
        ) : (
          <CustomH3 style={isDragAccept ? { color: "white" } : { color: "" }}>
            사진을 여기에 끌어다 놓으세요
          </CustomH3>
        )}
        <Margin direction="column" size={25} />
        <Style.TempButton
          htmlFor="IMAGE-UPLOAD-INPUT"
          style={isDragAccept ? { color: "#4891ff" } : { color: "white" }}
        >
          갤러리에서 선택
        </Style.TempButton>
        <Style.HiddenInput
          type="file"
          accept="image/*"
          id="IMAGE-UPLOAD-INPUT"
          onChange={(event) => {
            if (event.target.files !== null) setImageFile(event.target.files[0])
          }}
          {...getInputProps()}
        />
      </FlexBox>
    </Style.Wrapper>
  )
}
