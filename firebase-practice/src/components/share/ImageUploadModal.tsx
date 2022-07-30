import { SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH3, CustomH5, CustomH6, FlexBox, Margin } from "ui"
import { useDropzone } from "react-dropzone"
import ModalForImageUpload from "./ModalForImageUpload"
import { authService } from "@FireBase"

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
  SelectedImage: styled.img`
    width: 494px;
    height: 494px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
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
  InputSection: styled.div`
    width: 340px;
    height: 494px;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    align-items: center;
    position: relative;
  `,
  ProfileImage: styled.img`
    width: 30px;
    height: 30px;
    border-radius: 30px;
  `,
  TextArea: styled.textarea`
    width: 310px;
    height: 250px;
    border: none;
    resize: none;
    font-size: 16px;
    ::placeholder {
      font-size: 16px;
      font-weight: bolder;
      color: grey;
    }
    :focus {
      outline: none;
      ::placeholder {
        color: lightgrey;
      }
    }
  `,
  SubmitButton: styled.div`
    background-color: #4891ff;
    width: fit-content;
    height: fit-content;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    border-radius: 10px;
    position: absolute;
    bottom: 15px;
    right: 15px;
  `,
}

export default function ImageUploadModal({ setIsOpen, isOpen }: Props) {
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
  const [isFileExist, setIsFileExist] = useState<boolean>(false)
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")

  useEffect(() => {
    if (acceptedFiles.length === 0) {
      setIsFileExist(false)
      return
    }
    setImagePreviewSrc("")
    encodeFileToBase64(acceptedFiles[0])
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
    <ModalForImageUpload
      width={isFileExist ? "835px" : "495px"}
      height="537px"
      title="새 게시물 만들기"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPC={true}
      isFileExist={isFileExist}
      setIsFileExist={setIsFileExist}
    >
      {isFileExist ? (
        <FlexBox>
          <Style.SelectedImage
            src={imagePreviewSrc ? imagePreviewSrc : "empty.svg"}
            alt="selectedImage"
          />
          <Style.InputSection>
            <FlexBox
              width={"310px"}
              gap={10}
              height="fit-content"
              alignItems="center"
            >
              <Style.ProfileImage
                src={
                  authService.currentUser?.photoURL
                    ? `${authService.currentUser?.photoURL}`
                    : "/empty.svg"
                }
              />
              <CustomH5>{authService.currentUser?.displayName}</CustomH5>
            </FlexBox>
            <Margin direction="column" size={10} />
            <Style.TextArea placeholder="문구 입력..." />
            <Style.SubmitButton
              onClick={() => {
                alert("아직 기능 구현은 안했어용")
              }}
            >
              공유하기
            </Style.SubmitButton>
          </Style.InputSection>
        </FlexBox>
      ) : (
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
            <Style.Icon src="/image-upload.svg" alt="imageUpload" />
            <Margin direction="column" size={20} />
            {isDragReject ? (
              <CustomH3 style={{ color: "white" }}>
                사진만 올릴 수 있어요
              </CustomH3>
            ) : (
              <CustomH3
                style={isDragAccept ? { color: "white" } : { color: "" }}
              >
                사진을 여기에 끌어다 놓으세요
              </CustomH3>
            )}
            <Margin direction="column" size={25} />
            <Style.TempButton
              htmlFor="IMAGE-UPLOAD-INPUT"
              style={isDragAccept ? { color: "#4891ff" } : { color: "white" }}
            >
              컴퓨터에서 선택
            </Style.TempButton>
            <Style.HiddenInput
              type="file"
              accept="image/*"
              id="IMAGE-UPLOAD-INPUT"
              {...getInputProps()}
            />
          </FlexBox>
        </Style.Wrapper>
      )}
    </ModalForImageUpload>
  )
}
