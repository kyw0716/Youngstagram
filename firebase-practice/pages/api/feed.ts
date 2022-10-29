// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DBService } from "@FireBase"
import { FeedData } from "backend/dto"
import { doc, getDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function getFeed(
  req: NextApiRequest,
  res: NextApiResponse<FeedData[]>,
) {
  if (req.method === "GET") {
    const getFeedRef = doc(DBService, "mainPage", "userFeedDataAll")
    const docSnapShot = await getDoc(getFeedRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()?.feed as FeedData[]
      res
        .status(200)
        .json(data.sort((a, b) => Number(a.uploadTime) - Number(b.uploadTime)))
    }
  }
}
