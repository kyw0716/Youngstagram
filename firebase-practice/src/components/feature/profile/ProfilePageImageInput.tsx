import { authService, DBService, storageService } from "@FireBase"
import { UserImageData, UserImageDataAll } from "backend/dto"
import { v4 } from "uuid"
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useState } from "react"
import { FlexBox } from "ui"

export default function ProfilePageImageInput() {
  const [desc, setDesc] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File>()
  const [randomId, setRandomId] = useState<string>("")

  useEffect(() => {
    setRandomId(v4())
  }, [])

  const uploadToStorage = async () => {
    const storageRef = ref(
      storageService,
      `images/${authService.currentUser?.uid}/${randomId}`,
    )
    if (imageFile !== undefined)
      await uploadBytes(storageRef, imageFile).then(
        async () =>
          await getDownloadURL(storageRef).then((response) => {
            uploadToFirestore(response)
          }),
      )
  }

  const uploadToFirestore = async (downloadUrl: string) => {
    const dataAll: UserImageDataAll = {
      imageUrl: downloadUrl,
      desc: desc,
      location: location,
      private: isPrivate,
      storageId: randomId,
      creator: {
        name: `${authService.currentUser?.displayName}`,
        id: `${authService.currentUser?.uid}`,
        profileImage: `${authService.currentUser?.photoURL}`,
      },
    }

    const data: UserImageData = {
      imageUrl: downloadUrl,
      desc: desc,
      location: location,
      private: isPrivate,
      storageId: randomId,
    }

    const firestoreAllRef = doc(DBService, "mainPage", `userImageDataAll`)
    const firestoreRef = doc(
      DBService,
      "userData",
      `${authService.currentUser?.uid}`,
    )
    await updateDoc(firestoreAllRef, {
      images: arrayUnion(dataAll),
    }).catch(async (error) => {
      if (error.code) {
        await setDoc(firestoreAllRef, {
          images: [dataAll],
        })
      }
    })
    await updateDoc(firestoreRef, {
      images: arrayUnion(data),
    })
      .then(() => {
        setDesc("")
        setIsPrivate(false)
        setLocation("")
        setRandomId(v4())
        setImageFile(undefined)
      })
      .catch(async (error) => {
        if (error.code === "not-found") {
          await setDoc(firestoreRef, {
            images: [data],
          }).then(() => {
            setDesc("")
            setIsPrivate(false)
            setLocation("")
            setRandomId(v4())
            setImageFile(undefined)
          })
        }
      })
  }

  return (
    <FlexBox column={true} width={200}>
      <label>문구 입력</label>
      <textarea
        onChange={(event) => {
          setDesc(event.target.value)
        }}
        value={desc}
        required
      />
      <br />
      <label>장소 입력</label>
      <input
        onChange={(event) => {
          setLocation(event.target.value)
        }}
        value={location}
        required
      />
      <br />
      <label>공개 비공개 설정</label>
      <input
        type={"checkbox"}
        onChange={(event) => {
          setIsPrivate(event.target.checked)
        }}
        checked={isPrivate}
        required
      />
      <br />
      <label>이미지 선택</label>
      <input
        type={"file"}
        accept="image/*"
        onChange={(event) => {
          if (event.target.files !== null) setImageFile(event.target.files[0])
        }}
        required
      />
      <button onClick={uploadToStorage}>제출</button>
      {randomId}
    </FlexBox>
  )
}
