// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DBService } from "@FireBase"
import { FeedData } from "backend/dto"
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

/**
 * request url : /api/feedUpload
 * request body : FeedData
 * method : POST
 */

export default async function uploadFeed(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const {
      imageUrl,
      desc,
      location,
      isPrivate,
      storageId,
      creator,
      uploadTime,
    } = req.body as FeedData

    const firestoreAllRef = doc(DBService, "mainPage", `userFeedDataAll`)
    const firestorePersonalRef = doc(DBService, "users", `${creator}`)

    const feed: FeedData = {
      imageUrl: imageUrl,
      desc: desc,
      location: location,
      isPrivate: isPrivate,
      storageId: storageId,
      creator: creator,
      uploadTime: uploadTime,
    }

    await updateDoc(firestoreAllRef, {
      feed: arrayUnion(feed),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        await setDoc(firestoreAllRef, {
          feed: [feed],
        })
      }
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

    res.status(200).json("Success")
  }
}
