import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { DBService, storageService } from "@FireBase"

type Props = {
  userId: string
  userName: string
}

const Style = {
  PreviewImageSection: styled.div`
    width: 200px;
    height: 200px;
    border: 1px solid black;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  PreviewImage: styled.img`
    width: 150px;
    height: 150px;
  `,
}

export default function ProfilePageImageInput({ userId, userName }: Props) {
  const [imageFile, setImageFile] = useState<File>()
  const [imageTitle, setImageTitle] = useState<string>("")
  const imageUploadRef = useRef<HTMLInputElement>(null)
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")
  const [imageUrlToFirestore, setImageUrlToFirestore] = useState<string>("")
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

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

  const handleImageSelect: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.target.files !== null) {
      setImageFile(event.target.files[0])
      encodeFileToBase64(event.target.files[0])
    }
  }
  const handleImageTitle: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setImageTitle(event.target.value)
  }

  const handleImageSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (imageTitle === "") {
      alert("이미지 제목을 입력해주세요!")
      return
    }
    const imageSubmitRef = ref(storageService, `images/${userId}/${imageTitle}`)
    if (imageFile !== undefined)
      uploadBytes(imageSubmitRef, imageFile).then(() => {
        getDownloadURL(imageSubmitRef).then((response) => {
          setImageUrlToFirestore(response)
        })
      })
    if (imageUploadRef.current !== null) {
      imageUploadRef.current.value = ""
    }
  }

  const handlePrivateChecked: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setIsPrivate(event.target.checked)
  }

  const uploadImageUrlListToFirestore = async (
    url: string,
    title: string,
    isPrivate: boolean,
  ) => {
    const imageUrlListRef = doc(DBService, "userData", userId)
    const imageUrlListAllRef = doc(DBService, "mainPage", "userImageDataAll")
    await updateDoc(imageUrlListRef, {
      images: arrayUnion({ image: url, imageTitle: title, private: isPrivate }),
    })
    await updateDoc(imageUrlListAllRef, {
      images: arrayUnion({
        image: url,
        imageTitle: title,
        private: isPrivate,
        creator: userName,
      }),
    }).then(() => {
      setImageTitle("")
      setImagePreviewSrc("")
      setIsPrivate(false)
    })
  }

  useEffect(() => {
    if (imageUrlToFirestore == "") return
    uploadImageUrlListToFirestore(imageUrlToFirestore, imageTitle, isPrivate)
  }, [imageUrlToFirestore])

  return (
    <>
      <input
        type={"text"}
        onChange={handleImageTitle}
        value={imageTitle}
        placeholder="이미지 제목?"
      />
      <br />
      <input
        type={"file"}
        onChange={handleImageSelect}
        accept="image/*"
        ref={imageUploadRef}
      />
      <br />
      <label htmlFor="check">비공개</label>
      <input
        type={"checkbox"}
        onChange={handlePrivateChecked}
        id="check"
        checked={isPrivate}
      />
      <br />
      <button onClick={handleImageSubmit}>이미지 업로드</button>
      <Style.PreviewImageSection>
        {imagePreviewSrc !== undefined && imagePreviewSrc !== "" && (
          <Style.PreviewImage src={imagePreviewSrc} />
        )}
      </Style.PreviewImageSection>
    </>
  )
}
