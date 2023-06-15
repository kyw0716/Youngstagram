import { DBService, authService, storageService } from "@FireBase"
import { mainFeedItemsAtom } from "@share/recoil/feed"
import { userDataState } from "@share/recoil/recoilList"
import axios from "axios"
import { FeedItem } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"
import { SetStateAction } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { v4 } from "uuid"

interface Params {
  imageFile?: File
  setImageFile?: React.Dispatch<SetStateAction<File | undefined>>
  setIsFileExist?: React.Dispatch<SetStateAction<boolean>>
  setIsOpen?: (isOpen: boolean) => void
  resetInputs?: () => void
  setIsSubmit?: React.Dispatch<React.SetStateAction<boolean>>
  handleThreeDotMenuClick?: () => void
}

interface UploadToFirestoreParams {
  downloadUrl: string
  desc: string
  location: string
  isPrivate: boolean
  storageId?: string
  uploadTime?: string
}

export const useFeedCRUD = ({
  imageFile,
  setImageFile,
  setIsFileExist,
  setIsOpen,
  resetInputs,
  setIsSubmit,
  handleThreeDotMenuClick,
}: Params) => {
  const randomId = v4()

  const currentUser = useRecoilValue(userDataState)
  const setMainFeedItems = useSetRecoilState(mainFeedItemsAtom)
  const setCurrentUserData = useSetRecoilState(userDataState)

  const uploadToStorage = async (
    desc: string,
    location: string,
    isPrivate: boolean,
  ) => {
    const storageRef = ref(
      storageService,
      `images/${authService.currentUser?.uid}/${randomId}`,
    )
    if (imageFile !== undefined)
      await uploadBytes(storageRef, imageFile)
        .then(
          async () =>
            await getDownloadURL(storageRef).then(async (downloadUrl) => {
              uploadToFirestore({
                downloadUrl,
                desc,
                location,
                isPrivate,
              })
            }),
        )
        .catch((error) => {
          console.log(error.code)
        })
  }

  const uploadToFirestore = async ({
    downloadUrl,
    desc,
    location,
    isPrivate,
    storageId,
    uploadTime,
  }: UploadToFirestoreParams) => {
    const feed = {
      imageUrl: downloadUrl,
      desc,
      location,
      isPrivate,
      storageId: storageId ?? randomId,
      uploadTime: uploadTime ?? "new feed",
      creator: `${authService.currentUser?.uid}`,
    }

    setMainFeedItems((feedItems) => [
      { ...feed, creator: currentUser.info },
      ...feedItems,
    ])
    setCurrentUserData((userData) => {
      return {
        ...userData,
        feed: [{ ...feed, creator: currentUser.info }, ...userData.feed],
      }
    })

    // TODO: 여기서 서버랑 동기화 시키기
    axios.post(`/api/feed`, {
      feed,
    })

    setIsOpen?.(false)
    resetInputs?.()
    setIsSubmit?.(false)
    if (storageId) return
    resetInputs?.()
    setImageFile?.(undefined)
    setIsFileExist?.(false)
  }

  const EditToFireStore = async (
    desc: string,
    location: string,
    isPrivate: boolean,
    feedData: FeedItem,
  ) => {
    setMainFeedItems((feedItems) =>
      feedItems.map((feedItem) => {
        if (feedItem.storageId === feedData.storageId)
          return { ...feedData, desc, location, isPrivate }
        return feedItem
      }),
    )

    setCurrentUserData((userData) => {
      return {
        ...userData,
        feed: userData.feed.map((feedItem) => {
          if (feedItem.storageId === feedData.storageId)
            return { ...feedData, desc, location, isPrivate }
          return feedItem
        }),
      }
    })

    // TODO: 여기서 서버랑 동기화 시키기
    axios.post(`/api/feed`, {
      ...feedData,
      newDesc: desc,
      newLocation: location,
      newIsPrivate: isPrivate,
    })

    setIsOpen?.(false)
    resetInputs?.()
    setIsSubmit?.(false)
    if (feedData.storageId) return
    resetInputs?.()
    setImageFile?.(undefined)
    setIsFileExist?.(false)
  }

  const handleDeleteFeed = (feedData: FeedItem) => {
    const storageImageRef = ref(
      storageService,
      `images/${feedData.creator}/${feedData.storageId}`,
    )
    const firestoreAllRef = doc(DBService, "mainPage", "userFeedDataAll")
    const firestoreCommentRef = doc(DBService, "Comments", feedData.storageId)
    const firestorePersonalRef = doc(DBService, `users`, `${feedData.creator}`)
    const firestoreLikeRef = doc(DBService, "like", feedData.storageId)

    setMainFeedItems((feedItems) =>
      feedItems.filter((feedItem) => feedItem.storageId !== feedData.storageId),
    )

    setCurrentUserData((userData) => {
      return {
        ...userData,
        feed: userData.feed.filter(
          (feedItem) => feedItem.storageId !== feedData.storageId,
        ),
      }
    })

    handleThreeDotMenuClick?.()

    // TODO: 이 부분을 API 요청으로 대체하고, 요청 후 response에서 새로 바뀐 리스트를 반환해
    // 해당 리스트로 다시 recoil을 set해주도록 수정하기
    updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feedData),
    }).catch((error) => console.log(error.code))

    updateDoc(firestoreAllRef, {
      feed: arrayRemove(feedData),
    }).catch((error) => console.log(error.code))

    deleteObject(storageImageRef).catch((error) => console.log(error.code))
    deleteDoc(firestoreCommentRef).catch((error) => console.log(error.code))
    deleteDoc(firestoreLikeRef).catch((error) => console.log(error.code))
  }

  const handlePrivateToggle = (feedData: FeedItem) => {
    const firestoreImageAllRef = doc(DBService, "mainPage", "userFeedDataAll")
    const firestorePersonalRef = doc(DBService, `users`, `${feedData.creator}`)

    setMainFeedItems((feedItems) =>
      feedItems.map((feedItem) => {
        if (feedItem.storageId === feedData.storageId)
          return { ...feedData, isPrivate: !feedData.isPrivate }
        return feedItem
      }),
    )

    setCurrentUserData((userData) => {
      return {
        ...userData,
        feed: userData.feed.map((feedItem) => {
          if (feedItem.storageId === feedData.storageId)
            return { ...feedData, isPrivate: !feedData.isPrivate }
          return feedItem
        }),
      }
    })

    handleThreeDotMenuClick?.()

    // TODO: 이 부분을 API 요청으로 대체하고, 요청 후 response에서 새로 바뀐 리스트를 반환해
    // 해당 리스트로 다시 recoil을 set해주도록 수정하기
    updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feedData),
    }).then(() => {
      updateDoc(firestorePersonalRef, {
        feed: arrayUnion({ ...feedData, isPrivate: !feedData.isPrivate }),
      })
    })

    updateDoc(firestoreImageAllRef, {
      feed: arrayRemove(feedData),
    }).then(() => {
      updateDoc(firestoreImageAllRef, {
        feed: arrayUnion({ ...feedData, isPrivate: !feedData.isPrivate }),
      })
    })
  }

  return {
    EditToFireStore,
    uploadToStorage,
    handleDeleteFeed,
    handlePrivateToggle,
  }
}
