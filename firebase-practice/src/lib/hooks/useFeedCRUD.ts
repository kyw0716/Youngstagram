import { DBService, authService, storageService } from "@FireBase"
import { mainFeedItemsAtom } from "@share/recoil/feed"
import { userDataState } from "@share/recoil/recoilList"
import { FeedItem } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"
import getCurrentTime from "lib/getCurrentTime"
import { SetStateAction, useState } from "react"
import { useSetRecoilState } from "recoil"
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
            await getDownloadURL(storageRef).then(async (response) => {
              uploadToFirestore(response, desc, location, isPrivate)
            }),
        )
        .catch((error) => {
          console.log(error.code)
        })
  }

  const uploadToFirestore = async (
    downloadUrl: string,
    desc: string,
    location: string,
    isPrivate: boolean,
    storageId?: string,
    uploadTime?: string,
  ) => {
    const feed: FeedItem = {
      imageUrl: downloadUrl,
      desc,
      location,
      isPrivate,
      storageId: storageId ?? randomId,
      uploadTime: uploadTime ?? getCurrentTime(),
      creator: `${authService.currentUser?.uid}`,
    }

    setMainFeedItems((feedItems) => [feed, ...feedItems])
    setCurrentUserData((userData) => {
      return {
        ...userData,
        feed: [feed, ...userData.feed],
      }
    })

    const firestoreAllRef = doc(DBService, "mainPage", `userFeedDataAll`)
    const firestorePersonalRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )

    updateDoc(firestoreAllRef, {
      feed: arrayUnion(feed),
    })
      .catch((error) => {
        if (error.code === "not-found") {
          setDoc(firestoreAllRef, {
            feed: [feed],
          })
        }
      })
      .then(() => {
        setIsOpen?.(false)
        resetInputs?.()
        setIsSubmit?.(false)
        if (storageId) return
        resetInputs?.()
        setImageFile?.(undefined)
        setIsFileExist?.(false)
      })
    updateDoc(firestorePersonalRef, {
      feed: arrayUnion(feed),
    }).catch((error) => {
      if (error.code === "not-found") {
        setDoc(firestorePersonalRef, {
          feed: [feed],
        })
      }
    })
  }

  const EditToFireStore = async (
    desc: string,
    location: string,
    isPrivate: boolean,
    feedData?: FeedItem,
  ) => {
    if (feedData === undefined) return
    const firestoreAllRef = doc(DBService, "mainPage", `userFeedDataAll`)
    const firestorePersonalRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )

    setMainFeedItems((feedItems) =>
      feedItems.map((feedItem) => {
        if (feedItem.storageId === feedData.storageId) return feedData
        return feedItem
      }),
    )

    setCurrentUserData((userData) => {
      return {
        ...userData,
        feed: userData.feed.map((feedItem) => {
          if (feedItem.storageId === feedData.storageId) return feedData
          return feedItem
        }),
      }
    })

    updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feedData),
    }).catch((error) => console.log(error.code))
    updateDoc(firestoreAllRef, {
      feed: arrayRemove(feedData),
    })
      .then(() => {
        uploadToFirestore(
          feedData.imageUrl,
          desc,
          location,
          isPrivate,
          feedData.storageId,
          feedData.uploadTime,
        )
      })
      .catch((error) => console.log(error.code))
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
