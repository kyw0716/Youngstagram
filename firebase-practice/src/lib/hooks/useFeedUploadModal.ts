import { DBService, authService, storageService } from "@FireBase"
import { mainFeedItemsAtom } from "@share/recoil/feed"
import { userDataState } from "@share/recoil/recoilList"
import { FeedItems } from "backend/dto"
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
  feedData: FeedItems | undefined,
  imageFile: File | undefined,
  setImageFile: React.Dispatch<SetStateAction<File | undefined>>,
  setIsFileExist: React.Dispatch<SetStateAction<boolean>>,
  setIsOpen: (isOpen: boolean) => void,
) => {
  const randomId = v4()

  const setMainFeedItems = useSetRecoilState(mainFeedItemsAtom)

  const [isSubmit, setIsSubmit] = useState(false)
  const [desc, setDesc] = useState(feedData ? feedData.desc : "")
  const [location, setLocation] = useState(feedData ? feedData.location : "")
  const [isPrivate, setIsPrivate] = useState(
    feedData ? feedData.isPrivate : false,
  )

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
        setIsOpen(false)
        setIsSubmit(false)
        if (feedData) return
        setDesc("")
        setIsPrivate(false)
        setLocation("")
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
        await uploadToFirestore(feedData.imageUrl)
      })
      .catch((error) => console.log(error.code))
  }

  return {
    isPrivate,
    desc,
    location,
    isSubmit,
    setIsSubmit,
    EditToFireStore,
    uploadToStorage,
    setIsPrivate,
    setLocation,
    setDesc,
  }
}
