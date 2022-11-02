// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DBService } from "@FireBase"
import { FeedData } from "backend/dto"
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

/**
 * method : GET
 * request url : /api/feed
 * response : 메인 페이지의 피드 정보들
 *
 * TODO: 새로운 피드 등록과 피드 수정 기능 구분하기
 * method : POST
 * request url : /api/feed
 * request body : {imageUrl, desc, location, isPrivate, storageId, creator, uploadTime}
 * response: "Success"
 *
 * method : DELETE
 * request url : /api/feed
 * request body : {imageUrl, desc, location, isPrivate, storageId, creator, uploadTime}
 * response : Success
 */

export default async function getFeed(
  req: NextApiRequest,
  res: NextApiResponse<FeedData[] | string>,
) {
  if (req.method === "GET") {
    const getFeedRef = doc(DBService, "mainPage", "userFeedDataAll")
    const docSnapShot = await getDoc(getFeedRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()?.feed as FeedData[]
      res
        .status(200)
        .json(data.sort((a, b) => Number(a.uploadTime) - Number(b.uploadTime)))
    } else {
      res.status(500).json("Fail")
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
      } else {
        res.status(500).json(error.code)
      }
    })

    await updateDoc(firestorePersonalRef, {
      feed: arrayUnion(feed),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        await setDoc(firestorePersonalRef, {
          feed: [feed],
        })
      } else {
        res.status(500).json(error.code)
      }
    })

    res.status(200).json("Success")
  }
}
