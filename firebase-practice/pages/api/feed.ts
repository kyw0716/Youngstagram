// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DBService } from "@FireBase"
import { FeedData } from "backend/dto"
import { doc, getDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

/**
 * request url : /api/feed
 * method : GET
 * response : 메인 페이지의 피드 정보들
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
  }
}
