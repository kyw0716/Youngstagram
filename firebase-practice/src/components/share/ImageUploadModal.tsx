import { SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH3, CustomH5, CustomH6, FlexBox, Margin } from "ui"
import { useDropzone } from "react-dropzone"
import ModalForImageUpload from "./ModalForImageUpload"
import { authService } from "@FireBase"
import Image from "next/image"

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
    padding-top: 10px;
    align-items: center;
    position: relative;
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
  LocationInputSection: styled.div`
    width: 100%;
    padding-right: 10px;
    border-top: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  LocationInput: styled.input`
    width: 291px;
    height: 44px;
    border: none;
    padding-left: 10px;
    ::placeholder {
      color: lightgrey;
      font-size: 15px;
    }
    :focus {
      outline: none;
    }
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
  const [windowSize, setWindowSize] = useState<number>(0)

  const [desc, setDesc] = useState<string>("")
  useEffect(() => {
    setWindowSize(window.innerWidth)
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth)
    })
  }, [])

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
      width={windowSize < 784 ? "95%" : isFileExist ? "835px" : "495px"}
      // TODO: 이거 높이 값 나중에 바꾸기
      height={windowSize < 784 && isFileExist ? "550px" : "537px"}
      title="새 게시물 만들기"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPC={true}
      isFileExist={isFileExist}
      setIsFileExist={setIsFileExist}
    >
      {isFileExist ? (
        <FlexBox
          column={windowSize < 784 ? true : false}
          height={"fit-content"}
          width={"100%"}
        >
          <Image
            width={windowSize < 784 ? "95%" : 494}
            height={windowSize < 784 ? 200 : 494}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              maxWidth: 495,
            }}
            src={imagePreviewSrc ? imagePreviewSrc : "/empty.svg"}
            alt="selectedImage"
          />
          <Style.InputSection
            style={
              windowSize < 784
                ? {
                    height: "fit-content",
                    width: "95%",
                    alignItems: "flex-start",
                    paddingLeft: "2.5%",
                  }
                : {}
            }
          >
            <FlexBox
              width={"310px"}
              gap={10}
              height="fit-content"
              alignItems="center"
            >
              <Image
                src={
                  authService.currentUser?.photoURL
                    ? `${authService.currentUser?.photoURL}`
                    : "/empty.svg"
                }
                alt="profile"
                width={30}
                height={30}
                style={{ borderRadius: "30px" }}
              />
              <CustomH5>{authService.currentUser?.displayName}</CustomH5>
            </FlexBox>
            <Margin direction="column" size={10} />
            <Style.TextArea
              placeholder="문구 입력..."
              style={windowSize < 784 ? { height: 100, width: "100%" } : {}}
              maxLength={2200}
              value={desc}
              onChange={(event) => {
                setDesc(event.target.value)
              }}
            />
            <Margin direction="column" size={8} />
            <FlexBox
              width={windowSize < 784 ? "100%" : 310}
              justifyContents={"flex-end"}
              alignItems="center"
              style={{ color: "lightgrey" }}
            >
              {desc.length}/2200
            </FlexBox>
            <Margin direction="column" size={windowSize < 784 ? 0 : 8} />
            <Style.LocationInputSection>
              <Style.LocationInput placeholder="위치 추가" />
              <Margin direction="row" size={10} />
              <Image
                src={"/location.svg"}
                width={16}
                height={16}
                alt="location"
              />
            </Style.LocationInputSection>
          </Style.InputSection>

          <Style.SubmitButton
            onClick={() => {
              alert("아직 기능 구현은 안했어용")
            }}
          >
            공유하기
          </Style.SubmitButton>
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
            <Image
              width={96}
              height={77}
              src="/image-upload.svg"
              alt="imageUpload"
            />
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
