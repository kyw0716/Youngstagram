import { DBService, authService, storageService } from "@FireBase"
import { mainFeedItemsAtom } from "@share/recoil/feed"
import { userDataState } from "@share/recoil/recoilList"
import { FeedItem } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import getCurrentTime from "lib/getCurrentTime"
import { SetStateAction, useState } from "react"
import { useSetRecoilState } from "recoil"
import { v4 } from "uuid"

export const useFeedUploadModal = (
  imageFile: File | undefined,
  setImageFile?: React.Dispatch<SetStateAction<File | undefined>>,
  setIsFileExist?: React.Dispatch<SetStateAction<boolean>>,
  setIsOpen?: (isOpen: boolean) => void,
  resetInputs?: () => void,
  setIsSubmit?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const randomId = v4()

  const setMainFeedItems = useSetRecoilState(mainFeedItemsAtom)

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
      desc: desc,
      location: location,
      isPrivate: isPrivate,
      storageId: storageId ?? randomId,
      uploadTime: uploadTime ?? getCurrentTime(),
      creator: `${authService.currentUser?.uid}`,
    }

    setMainFeedItems((feedItems) => [feed, ...feedItems])

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
        setIsOpen?.(false)
        resetInputs?.()
        setIsSubmit?.(false)
        if (storageId) return
        resetInputs?.()
        setImageFile?.(undefined)
        setIsFileExist?.(false)
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
    const feed: FeedItem = {
      imageUrl: feedData.imageUrl,
      desc: feedData.desc,
      location: feedData.location,
      isPrivate: feedData.isPrivate,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
      creator: feedData.creator,
    }

    setMainFeedItems((feedItems) =>
      feedItems.map((feedItem) => {
        if (feedItem.storageId === feed.storageId) return feed
        return feedItem
      }),
    )

    await updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feed),
    }).catch((error) => console.log(error.code))
    await updateDoc(firestoreAllRef, {
      feed: arrayRemove(feed),
    })
      .then(async () => {
        await uploadToFirestore(
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

  return {
    EditToFireStore,
    uploadToStorage,
  }
}
