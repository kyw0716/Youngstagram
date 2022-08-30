import { authService, DBService, storageService } from "@FireBase"
import { UserInfo, FeedData } from "backend/dto"
import { updateProfile } from "firebase/auth"
import { doc, DocumentData, onSnapshot, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Image from "next/image"
import { useRouter } from "next/router"
import { SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH6, FlexBox, Margin } from "ui"
import YoungstagramModal from "../YoungstagramModal"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  isPC: boolean
}
const Style = {
  NameInput: styled.input`
    width: ${(props) => (props.about === "true" ? "350px" : "100%")};
    height: ${(props) => (props.about === "true" ? "50px" : "30px")};
    border: 1.5px solid #bdbdbd;
    border-radius: ${(props) => (props.about === "true" ? "10px" : "5px")};
    padding-left: 1vw;
    margin-bottom: ${(props) => (props.about === "true" ? "30px" : "5px")};
    font-size: 16px;
  `,
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
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [isClicked, setIsClicked] = useState<boolean>(false)

  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")
  const [imageFileName, setImageFileName] = useState<string>("")
  const [imageFile, setImageFile] = useState<File>()
  const [userName, setUserName] = useState<string>("")

  const [submitUserName, setSubmitUserName] = useState<string>("")
  const [imageUrlToAuthService, setImageUrlToAuthService] = useState<string>("")

  const [userData, setUserData] = useState<DocumentData>()

  useEffect(() => {
    const userDataRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )
    onSnapshot(userDataRef, { includeMetadataChanges: true }, (doc) => {
      setUserData(doc.data())
    })
  }, [])

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
        setImageFileName("")
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
        isPC={isPC}
      >
        <Margin direction="column" size={15} />
        <FlexBox width={"100%"} height={isPC ? "200px" : "100px"}>
          <Margin direction="row" size={15} />
          <Image
            src={
              imagePreviewSrc
                ? imagePreviewSrc
                : authService.currentUser?.photoURL
                ? `${authService.currentUser?.photoURL}`
                : "/profile.svg"
            }
            alt={"profile"}
            style={{ borderRadius: 10 }}
            width={isPC ? 200 : 100}
            height={isPC ? 200 : 100}
          />
          <Margin direction="row" size={15} />
          <FlexBox
            width={isPC ? "350px" : "70%"}
            height={isPC ? "200px" : "100px"}
            column={true}
            justifyContents="center"
          >
            <FlexBox width="100%" height="fit-content" column={true}>
              <FlexBox column={true}>
                <label>
                  <CustomH6>이름 변경:</CustomH6>
                </label>
                <Margin direction="column" size={isPC ? 10 : 5} />
                <Style.NameInput
                  about={`${isPC}`}
                  id="PROFILE-NAME-INPUT"
                  placeholder={`${authService.currentUser?.displayName}`}
                  onChange={(event) => {
                    setUserName(event.target.value)
                  }}
                  value={userName}
                />
              </FlexBox>
              <CustomH6>이미지 변경:</CustomH6>
              <Margin direction="column" size={isPC ? 10 : 5} />
              <FlexBox width={"100%"}>
                <Style.ImagePreviewName about={`${isPC}`}>
                  {imageFileName ? `${imageFileName.slice(0, 10)}...` : ""}
                </Style.ImagePreviewName>
                <Style.ProfileEditInputLabel
                  htmlFor="PROFILE-Edit"
                  about={`${isPC}`}
                >
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
