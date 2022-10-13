import { authService, DBService, storageService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { UserInfo } from "backend/dto"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { ProfileIcon } from "icons"
import Image from "next/image"
import { useRouter } from "next/router"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"
import YoungstagramModal from "../YoungstagramModal"
import ImageInput from "./ImageInput"
import NameInput from "./NameInput"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  isPC: boolean
}

const Style = {
  SubmitButton: styled.div`
    width: ${(props) => (props.about === "true" ? "100px" : "70px")};
    height: ${(props) => (props.about === "true" ? "40px" : "25px")};
    background-color: #4891ff;
    color: white;
    font-weight: bold;
    font-size: ${(props) => (props.about === "true" ? "16px" : "11px")};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${(props) => (props.about === "true" ? "10px" : "5px")};
    cursor: pointer;
  `,
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

export default function ProfileEditModal({ isPC, isOpen, setIsOpen }: Props) {
  const router = useRouter()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [isClicked, setIsClicked] = useState<boolean>(false)

  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")
  const [imageFile, setImageFile] = useState<File>()
  const [userName, setUserName] = useState<string>("")

  const [submitUserName, setSubmitUserName] = useState<string>("")
  const [imageUrlToAuthService, setImageUrlToAuthService] = useState<string>("")

  const currentUserData = useRecoilValue(userDataState)

  const handleSubmit = () => {
    setIsClicked(true)
    const imageSubmitRef = ref(
      storageService,
      `images/${authService.currentUser?.uid}/profileImage`,
    )
    setSubmitUserName(userName)
    if (imageFile !== undefined)
      uploadBytes(imageSubmitRef, imageFile).then(() => {
        getDownloadURL(imageSubmitRef).then((response) => {
          setImageUrlToAuthService(response)
          setIsSubmit(true)
        })
      })
    else {
      setIsSubmit(true)
    }
  }

  const updateProfileNameAndImage = async () => {
    if (authService.currentUser !== null) {
      const profileRef = doc(DBService, "users", authService.currentUser.uid)
      if (submitUserName !== "") {
        const profileForm: UserInfo = {
          userId: authService.currentUser.uid,
          profileImage: authService.currentUser.photoURL,
          name: submitUserName,
          email: authService.currentUser.email,
        }
        await updateProfile(authService.currentUser, {
          displayName: submitUserName,
        }).catch((error) => console.log(error.code))
        await updateDoc(profileRef, {
          info: profileForm,
        }).catch((error) => console.log(error.code))
      }
      if (imageUrlToAuthService !== "") {
        const profileForm: UserInfo = {
          userId: authService.currentUser.uid,
          profileImage: imageUrlToAuthService,
          name: authService.currentUser.displayName,
          email: authService.currentUser.email,
        }
        await updateProfile(authService.currentUser, {
          photoURL: imageUrlToAuthService,
        }).catch((error) => console.log(error.code))
        await updateDoc(profileRef, { info: profileForm }).catch((error) =>
          console.log(error.code),
        )
      }
    }
  }

  useEffect(() => {
    if (isSubmit) {
      updateProfileNameAndImage().then(() => {
        setImagePreviewSrc("")
        setUserName("")
        setIsOpen(false)
        setIsClicked(false)
        setIsSubmit(false)
      })
    }
    /*eslint-disable-next-line*/
  }, [isSubmit])

  return (
    <>
      <YoungstagramModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        width={isPC ? "600px" : "95vw"}
        height={isPC ? "fit-content" : "210px"}
        title="프로필 편집"
      >
        <Margin direction="column" size={15} />
        <FlexBox width={"100%"} height={isPC ? "200px" : "100px"}>
          <Margin direction="row" size={15} />
          {imagePreviewSrc ? (
            <Image
              src={imagePreviewSrc}
              alt={"profile"}
              style={{ borderRadius: 10 }}
              width={isPC ? 200 : 100}
              height={isPC ? 200 : 100}
            />
          ) : currentUserData.info.profileImage ? (
            <Image
              src={currentUserData.info.profileImage}
              alt={"profile"}
              style={{ borderRadius: 10 }}
              width={isPC ? 200 : 100}
              height={isPC ? 200 : 100}
            />
          ) : (
            <ProfileIcon width={isPC ? 200 : 100} height={isPC ? 200 : 100} />
          )}
          <Margin direction="row" size={15} />
          <FlexBox
            width={isPC ? "350px" : "70%"}
            height={isPC ? "200px" : "100px"}
            column={true}
            justifyContents="center"
          >
            <FlexBox width="100%" height="fit-content" column={true}>
              <NameInput
                isPC={isPC}
                userName={userName}
                setUserName={setUserName}
              />
              <ImageInput
                isPC={isPC}
                setImageFile={setImageFile}
                setImagePreviewSrc={setImagePreviewSrc}
                isSubmit={isSubmit}
              />
            </FlexBox>
          </FlexBox>
          <Margin direction="row" size={15} />
        </FlexBox>
        <Margin direction="column" size={10} />
        <FlexBox width={"100%"} height="fit-content" justifyContents="flex-end">
          {isClicked || (
            <Style.SubmitButton onClick={handleSubmit} about={`${isPC}`}>
              작성완료
            </Style.SubmitButton>
          )}
          <Margin direction="row" size={isPC ? 20 : 10} />
        </FlexBox>
        <Margin direction="column" size={15} />
      </YoungstagramModal>
    </>
  )
}
