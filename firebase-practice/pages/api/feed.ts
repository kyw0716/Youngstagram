import { DBService } from "@FireBase"
import { FeedItem } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import getCurrentTime from "lib/getCurrentTime"
import type { NextApiRequest, NextApiResponse } from "next"

/**
 * method : GET
 * request url : /api/feed
 * response : 메인 페이지의 피드 정보들
 *
 * method : POST
 * request url : /api/feed
 * request body for new feed : {imageUrl, desc, location, isPrivate, creator}
 * response : Success
 *
 * uploadTime이 new feed 인 경우
 * method : POST
 * request url : /api/feed
 * request body for new feed : {imageUrl, desc, location, isPrivate, storageId, creator, uploadTime, newDesc, newLocation, newIsPrivate}
 * response : Success
 *
 * method : DELETE
 * request url : /api/feed
 * request body : {imageUrl, desc, location, isPrivate, storageId, creator, uploadTime}
 * response : Success
 */

export default async function getFeed(
  req: NextApiRequest,
  res: NextApiResponse<FeedItem[] | string>,
) {
  if (req.method === "GET") {
    const getFeedRef = doc(DBService, "mainPage", "userFeedDataAll")
    const docSnapShot = await getDoc(getFeedRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()?.feed as FeedItem[]
      res
        .status(200)
        .json(data.sort((a, b) => Number(b.uploadTime) - Number(a.uploadTime)))
    } else {
      res.status(404).json("not found")
    }
  } else if (req.method === "POST") {
    const {
      imageUrl,
      desc,
      location,
      isPrivate,
      storageId,
      creator,
      uploadTime,
    } = req.body

    const firestoreRef = doc(DBService, "mainPage", `userFeedDataAll`)

    const isNewFeed = uploadTime === "new feed"

    if (isNewFeed) {
      const feed: FeedItem = {
        imageUrl,
        desc,
        location,
        isPrivate,
        storageId,
        creator,
        uploadTime: getCurrentTime(),
      }

      await updateDoc(firestoreRef, {
        feed: arrayUnion(feed),
      }).catch(async (error) => {
        if (error.code === "not-found") {
          setDoc(firestoreRef, {
            feed: [feed],
          })
        } else {
          res.status(500).json(error.code)
        }
      })
    }
    if (!isNewFeed) {
      const { newDesc, newLocation, newIsPrivate } = req.body

      const feedToRemove: FeedItem = {
        imageUrl,
        desc,
        location,
        isPrivate,
        storageId,
        creator,
        uploadTime,
      }
      const newFeed: FeedItem = {
        imageUrl,
        desc: newDesc,
        location: newLocation,
        isPrivate: newIsPrivate,
        storageId,
        creator,
        uploadTime,
      }

      updateDoc(firestoreRef, {
        feed: arrayRemove(feedToRemove),
      })
        .then(() => {
          updateDoc(firestoreRef, {
            feed: arrayUnion(newFeed),
          }).catch((error) => res.status(500).json(error.code))
        })
        .catch((error) => res.status(500).json(error.code))
    }
  } else if (req.method === "DELETE") {
    const {
      imageUrl,
      desc,
      location,
      isPrivate,
      storageId,
      creator,
      uploadTime,
    } = req.body as FeedItem

    const firestoreAllRef = doc(DBService, "mainPage", `userFeedDataAll`)

    const feed: FeedItem = {
      imageUrl,
      desc,
      location,
      isPrivate,
      storageId,
      creator,
      uploadTime,
    }

    await updateDoc(firestoreAllRef, {
      feed: arrayRemove(feed),
    }).catch((error) => {
      res.status(500).json(error.code)
    })

    res.status(200).json("Success")
  }
}
