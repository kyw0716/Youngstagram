import { SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH3, CustomH5, FeedUPloadModalIcon, FlexBox, Margin } from "ui"
import { useDropzone } from "react-dropzone"
import ModalForImageUpload from "./ModalForFeedUpload"
import { authService, DBService, storageService } from "@FireBase"
import Image from "next/image"
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { FeedData, UserData } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import getCurrentTime from "lib/getCurrentTime"
import useWindowSize from "lib/useWindowSize"
import getUserDataByUid from "lib/getUserDataByUid"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { userDataState } from "@share/recoil/recoilList"
import { ProfileIcon } from "icons"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  feedData?: FeedData
}

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  TextInputModeWrapper: styled.div`
    display: flex;
    height: fit-content;
    width: 100%;
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `,
  SelectedImage: styled.img`
    width: 494px;
    height: 494px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    @media (max-width: 900px) {
      width: 100%;
      height: 200px;
    }
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
  InputSection: styled.form`
    width: 340px;
    height: 494px;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    align-items: center;
    position: relative;
    @media (max-width: 900px) {
      height: fit-content;
      width: 100%;
    }
  `,
  InputSectionHeader: styled.div`
    display: flex;
    width: 310px;
    height: fit-content;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    @media (max-width: 900px) {
      width: 100%;
      padding-left: 10px;
    }
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
    @media (max-width: 900px) {
      height: 100px;
      width: 100%;
      padding-left: 10px;
    }
  `,
  TextLength: styled.div`
    display: flex;
    width: 310px;
    justify-content: flex-end;
    align-items: center;
    color: lightgrey;
    padding-right: 10px;
    margin-bottom: 8px;
    @media (max-width: 900px) {
      width: 100%;
      margin-bottom: 0px;
    }
  `,
  SubmitButton: styled.div`
    display: ${(props) => (props.about ? props.about : "")};
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
    @media (max-width: 900px) {
      justify-content: space-between;
      padding-right: 10px;
    }
  `,
  LocationInput: styled.input`
    width: 291px;
    height: 44px;
    border: none;
    padding-left: 10px;
    font-size: 16px;
    ::placeholder {
      color: lightgrey;
      font-size: 16px;
    }
    :focus {
      outline: none;
    }
    @media (max-width: 900px) {
      width: 90%;
    }
  `,
}

export default function FeedUploadModal({
  setIsOpen,
  isOpen,
  feedData,
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
  const [isFileExist, setIsFileExist] = useState<boolean>(false)
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const windowSize = useWindowSize()

  const [desc, setDesc] = useState<string>(feedData ? feedData.desc : "")
  const [location, setLocation] = useState<string>(
    feedData ? feedData.location : "",
  )
  const [isPrivate, setIsPrivate] = useState<boolean>(
    feedData ? feedData.private : false,
  )
  const [imageFile, setImageFile] = useState<File>()
  const [randomId, setRandomId] = useState<string>(
    feedData ? feedData.storageId : "",
  )
  const setCurrentUserData = useSetRecoilState(userDataState)
  const currentUserData = useRecoilValue(userDataState)

  useEffect(() => {
    setRandomId(v4())
  }, [])

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

  const uploadToStorage = async () => {
    const storageRef = ref(
      storageService,
      `images/${authService.currentUser?.uid}/${randomId}`,
    )
    if (imageFile !== undefined)
      await uploadBytes(storageRef, imageFile)
        .then(
          async () =>
            await getDownloadURL(storageRef).then((response) => {
              uploadToFirestore(response)
            }),
        )
        .catch((error) => {
          console.log(error.code)
        })
  }
  const EditToFireStore = async () => {
    if (feedData === undefined) return
    const firestoreAllRef = doc(DBService, "mainPage", `userFeedDataAll`)
    const firestorePersonalRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )
    const feed: FeedData = {
      imageUrl: feedData.imageUrl,
      desc: feedData.desc,
      location: feedData.location,
      private: feedData.private,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
      creator: feedData.creator,
    }
    await updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feed),
    }).catch((error) => console.log(error.code))
    await updateDoc(firestoreAllRef, {
      feed: arrayRemove(feed),
    })
      .then(() => {
        uploadToFirestore(feedData.imageUrl)
      })
      .catch((error) => console.log(error.code))
  }

  const uploadToFirestore = async (downloadUrl: string) => {
    const feed: FeedData = {
      imageUrl: downloadUrl,
      desc: desc,
      location: location,
      private: isPrivate,
      storageId: feedData?.storageId ? feedData.storageId : randomId,
      uploadTime: feedData?.uploadTime ? feedData.uploadTime : getCurrentTime(),
      creator: `${authService.currentUser?.uid}`,
    }
    const firestoreAllRef = doc(DBService, "mainPage", `userFeedDataAll`)
    const firestorePersonalRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )
    await updateDoc(firestoreAllRef, {
      feed: arrayUnion(feed),
    })
      .catch(async (error) => {
        if (error.code === "not-found") {
          await setDoc(firestoreAllRef, {
            feed: [feed],
          })
        }
      })
      .then(() => {
        setIsOpen(false)
        setIsSubmit(false)
        if (feedData) return
        setDesc("")
        setIsPrivate(false)
        setLocation("")
        setRandomId(v4())
        setImageFile(undefined)
        setIsFileExist(false)
      })
    await updateDoc(firestorePersonalRef, {
      feed: arrayUnion(feed),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        await setDoc(firestorePersonalRef, {
          feed: [feed],
        })
      }
    })
    await getUserDataByUid(`${authService.currentUser?.uid}`).then((data) => {
      if (data) setCurrentUserData(data as UserData)
    })
  }

  return (
    <ModalForImageUpload
      width={
        windowSize < 900
          ? "95%"
          : isFileExist
          ? "835px"
          : feedData
          ? "835px"
          : "495px"
      }
      height={windowSize < 900 && isFileExist ? "550px" : "537px"}
      title={feedData ? "게시글 편집하기" : "새 게시물 만들기"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPC={true}
      isFileExist={feedData?.imageUrl ? true : isFileExist}
      setIsFileExist={setIsFileExist}
      isModifyMode={feedData ? true : false}
    >
      {isFileExist || feedData !== undefined ? (
        <Style.TextInputModeWrapper>
          <Style.SelectedImage
            src={
              feedData
                ? feedData.imageUrl
                : imagePreviewSrc
                ? imagePreviewSrc
                : "/empty.webp"
            }
            alt="selectedImage"
          />
          <Style.InputSection
            onSubmit={(event) => {
              event.preventDefault()
              setIsSubmit(true)
              if (feedData) {
                EditToFireStore()
                return
              }
              uploadToStorage()
            }}
          >
            <Style.InputSectionHeader>
              <FlexBox alignItems="center">
                {currentUserData.info.profileImage ? (
                  <Image
                    src={currentUserData.info.profileImage}
                    alt="profile"
                    width={30}
                    height={30}
                    style={{ borderRadius: "30px" }}
                  />
                ) : (
                  <ProfileIcon width={30} height={30} />
                )}

                <Margin direction="row" size={10} />
                <CustomH5>{authService.currentUser?.displayName}</CustomH5>
              </FlexBox>
              <FlexBox alignItems="center" width={80}>
                <CustomH5>비공개</CustomH5>
                <input
                  type={"checkbox"}
                  checked={isPrivate}
                  onChange={(event) => {
                    setIsPrivate(event.target.checked)
                  }}
                />
              </FlexBox>
            </Style.InputSectionHeader>
            <Margin direction="column" size={10} />
            <Style.TextArea
              placeholder="문구 입력..."
              maxLength={2200}
              value={desc}
              onChange={(event) => {
                setDesc(event.target.value)
              }}
            />
            <Margin direction="column" size={8} />
            <Style.TextLength>{desc.length}/2200</Style.TextLength>
            <Style.LocationInputSection>
              <Style.LocationInput
                placeholder="위치 추가"
                onChange={(event) => {
                  setLocation(event.target.value)
                }}
                value={location}
              />
              <Margin direction="row" size={10} />
              <Image
                src={"/location.webp"}
                width={16}
                height={16}
                alt="location"
              />
            </Style.LocationInputSection>
          </Style.InputSection>
          <Style.SubmitButton
            onClick={() => {
              setIsSubmit(true)
              if (feedData) {
                EditToFireStore()
                return
              }
              uploadToStorage()
            }}
            about={isSubmit ? "none" : ""}
          >
            공유하기
          </Style.SubmitButton>
        </Style.TextInputModeWrapper>
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
            <FeedUPloadModalIcon />
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
              갤러리에서 선택
            </Style.TempButton>
            <Style.HiddenInput
              type="file"
              accept="image/*"
              id="IMAGE-UPLOAD-INPUT"
              onChange={(event) => {
                if (event.target.files !== null)
                  setImageFile(event.target.files[0])
              }}
              {...getInputProps()}
            />
          </FlexBox>
        </Style.Wrapper>
      )}
    </ModalForImageUpload>
  )
}
