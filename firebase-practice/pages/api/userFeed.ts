import { DBService } from "@FireBase"
import axios from "axios"
import { FeedItem } from "backend/dto"
import { doc, getDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

/**
 * method : GET
 * request url : /api/userFeed?userId={userId}
 * response : userId를 가진 유저의 피드 목록
 */

export default async function getFeed(
  req: NextApiRequest,
  res: NextApiResponse<FeedItem[] | string>,
) {
  if (req.method === "GET") {
    const userId = req.query.userId

    const getFeedRef = doc(DBService, "mainPage", "userFeedDataAll")
    const getProfileRef = doc(DBService, "users", `${userId}`)

    const docSnapShot = await getDoc(getFeedRef)
    const userInfoDocSnapShot = await getDoc(getProfileRef)

    if (userId === undefined) res.status(400).json("userId query is missing")

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()?.feed as (Omit<FeedItem, "creator"> & {
        creator: string
      })[]
      const userData = data
        .filter((feedItem) => feedItem.creator === userId)
        .map((feedItem) => ({
          ...feedItem,
          creator: userInfoDocSnapShot.data()?.info,
        }))

      userData.sort((a, b) => Number(b.uploadTime) - Number(a.uploadTime))

      res.status(200).json(userData)
    } else {
      res.status(500).json("Fail")
    }

    res.status(400).json("method error")
  }
}
