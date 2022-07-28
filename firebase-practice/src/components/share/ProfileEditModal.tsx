import { authService, storageService } from "@FireBase"
import { updateProfile } from "firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useRouter } from "next/router"
import { SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH5, FlexBox, Margin } from "ui"
import Modal from "./Modal"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  isPC: boolean
}
const Style = {
  ProfileImgMobile: styled.img`
    width: 35vw;
    height: 35vw;
    border-radius: 5vw;
    border: 1px solid lightgrey;
  `,
  //   ProfileImgPc: styled.img`
  //     width: ;
  //     height: ;
  //   `,
  NameInput: styled.input`
    width: 52vw;
    height: 8vw;
    border: 1px solid #bdbdbd;
    border-radius: 1vw;
    padding-left: 1vw;
    margin-bottom: 5vw;
    font-size: 12px;
  `,
  SubmitButton: styled.div`
    width: 25vw;
    height: 8vw;
    background-color: #bdbdbd;
    color: white;
    font-weight: bold;
    font-size: 3vw;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1.5vw;
    cursor: pointer;
  `,
  ProfileEditInputLabel: styled.label`
    width: 17vw;
    height: 8vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #bdbdbd;
    color: white;
    font-weight: bold;
    font-size: 2vw;
    border-radius: 0 1.5vw 1.5vw 0;
    cursor: pointer;
  `,
  ImagePreviewName: styled.div`
    width: 35vw;
    height: 8vw;
    border: 1px solid #bdbdbd;
    border-right: none;
    border-radius: 1.5vw 0 0 1.5vw;
    display: flex;
    align-items: center;
    padding-left: 1vw;
  `,
  ProflieImageInput: styled.input`
    display: none;
  `,
}

export default function ProfileEditModal({ isPC, isOpen, setIsOpen }: Props) {
  const router = useRouter()

  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")
  const [imageFileName, setImageFileName] = useState<string>("")
  const [imageFile, setImageFile] = useState<File>()
  const [userName, setUserName] = useState<string>("")

  const [submitUserName, setSubmitUserName] = useState<string>("")
  const [imageUrlToAuthService, setImageUrlToAuthService] = useState<string>("")

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

  const handleSubmit = () => {
    const imageSubmitRef = ref(
      storageService,
      `images/${authService.currentUser?.uid}/profileImage`,
    )
    if (imageFile !== undefined)
      uploadBytes(imageSubmitRef, imageFile).then(() => {
        getDownloadURL(imageSubmitRef).then((response) => {
          setImageUrlToAuthService(response)
        })
      })
    setSubmitUserName(userName)
  }

  const updateName = async () => {
    if (authService.currentUser !== null)
      await updateProfile(authService.currentUser, {
        displayName: submitUserName,
      }).then(() => {
        router.push(`/`)
      })
  }
  const updateProfileImage = async () => {
    if (authService.currentUser !== null)
      await updateProfile(authService.currentUser, {
        photoURL: imageUrlToAuthService,
      }).then(() => {
        router.push(`/`)
      })
  }

  useEffect(() => {
    if (submitUserName !== "") updateName()
    if (imageUrlToAuthService !== "") updateProfileImage()
    setImageFileName("")
    setImagePreviewSrc("")
    setUserName("")
    setIsOpen(false)
    /*eslint-disable-next-line*/
  }, [submitUserName, imageUrlToAuthService])

  return (
    <>
      <Modal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        width={isPC ? "600PX" : "95vw"}
        height={isPC ? "500PX" : "fit-content"}
        title="프로필 편집"
      >
        <Margin direction="column" size={15} />
        <FlexBox width={"100%"} height={"35vw"}>
          <Margin direction="row" size={15} />
          <Style.ProfileImgMobile
            src={
              imagePreviewSrc
                ? imagePreviewSrc
                : `${authService.currentUser?.photoURL}`
            }
          />
          <Margin direction="row" size={15} />
          <FlexBox
            width={"60vw"}
            height="35vw"
            column={true}
            justifyContents="center"
          >
            <FlexBox width="fit-content" height="fit-content" column={true}>
              <FlexBox column={true}>
                <label>
                  <CustomH5>이름 변경:</CustomH5>
                </label>
                <Margin direction="column" size={5} />
                <Style.NameInput
                  id="PROFILE-NAME-INPUT"
                  placeholder={`${authService.currentUser?.displayName}`}
                  onChange={(event) => {
                    setUserName(event.target.value)
                  }}
                  value={userName}
                />
              </FlexBox>
              <CustomH5>이미지 변경:</CustomH5>
              <Margin direction="column" size={5} />
              <FlexBox width={"100%"} justifyContents="flex-end">
                <Style.ImagePreviewName>
                  {imageFileName ? `${imageFileName.slice(0, 10)}...` : ""}
                </Style.ImagePreviewName>
                <Style.ProfileEditInputLabel htmlFor="PROFILE-Edit">
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
            </FlexBox>
          </FlexBox>
          <Margin direction="row" size={15} />
        </FlexBox>
        <Margin direction="column" size={10} />
        <FlexBox width={"100%"} height="fit-content" justifyContents="flex-end">
          <Style.SubmitButton onClick={handleSubmit}>
            작성완료
          </Style.SubmitButton>
          <Margin direction="row" size={10} />
        </FlexBox>
        <Margin direction="column" size={15} />
      </Modal>
    </>
  )
}
