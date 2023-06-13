import { authService, DBService, storageService } from "@FireBase"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { FeedItems } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { LocationIcon, ProfileIcon } from "icons"
import getCurrentTime from "lib/getCurrentTime"
import Image from "next/image"
import React, { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH5, FlexBox, Margin } from "ui"
import { v4 } from "uuid"

type Props = {
  feedData?: FeedItems
  imagePreviewSrc: string
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  imageFile: File | undefined
  setImageFile: React.Dispatch<SetStateAction<File | undefined>>
  setIsFileExist: React.Dispatch<SetStateAction<boolean>>
  setIsUploaded?: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
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
    height: 43px;
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

export default function TextInput({
  feedData,
  imagePreviewSrc,
  setIsOpen,
  imageFile,
  setImageFile,
  setIsFileExist,
}: Props) {
  const isDarkMode = useRecoilValue(darkModeState)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const currentUserData = useRecoilValue(userDataState)

  const [desc, setDesc] = useState<string>(feedData ? feedData.desc : "")
  const [location, setLocation] = useState<string>(
    feedData ? feedData.location : "",
  )
  const [isPrivate, setIsPrivate] = useState<boolean>(
    feedData ? feedData.isPrivate : false,
  )
  const [randomId, setRandomId] = useState<string>(
    feedData ? feedData.storageId : "",
  )

  useEffect(() => {
    setRandomId(v4())
  }, [])

  const uploadToStorage = async () => {
    const storageRef = ref(
      storageService,
      `images/${authService.currentUser?.uid}/${randomId}`,
    )
    if (imageFile !== undefined)
      await uploadBytes(storageRef, imageFile)
        .then(
          async () =>
            await getDownloadURL(storageRef).then(async (response) => {
              uploadToFirestore(response)
            }),
        )
        .catch((error) => {
          console.log(error.code)
        })
  }

  const uploadToFirestore = async (downloadUrl: string) => {
    const feed: FeedItems = {
      imageUrl: downloadUrl,
      desc: desc,
      location: location,
      isPrivate: isPrivate,
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
  }

  const EditToFireStore = async () => {
    if (feedData === undefined) return
    const firestoreAllRef = doc(DBService, "mainPage", `userFeedDataAll`)
    const firestorePersonalRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )
    const feed: FeedItems = {
      imageUrl: feedData.imageUrl,
      desc: feedData.desc,
      location: feedData.location,
      isPrivate: feedData.isPrivate,
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
      .then(async () => {
        await uploadToFirestore(feedData.imageUrl)
      })
      .catch((error) => console.log(error.code))
  }

  return (
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
          style={{
            backgroundColor: isDarkMode ? "black" : "",
            color: isDarkMode ? "white" : "",
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
            style={{
              backgroundColor: isDarkMode ? "black" : "",
              color: isDarkMode ? "white" : "",
            }}
          />
          <Margin direction="row" size={10} />
          <LocationIcon width={16} height={16} />
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
  )
}
