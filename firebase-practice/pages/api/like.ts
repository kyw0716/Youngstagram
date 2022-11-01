import { DBService } from "@FireBase"
import { UserData } from "backend/dto"
import { doc, getDoc } from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * request url : /api/like?storageId=${이미지 저장 스토리지 아이디}
 * method : GET
 * response : storageId를 가진 피드를 좋아요 한 사람들 리스트
 */

export default async function getLike(
  req: NextApiRequest,
  res: NextApiResponse<string[]>,
) {
  if (req.method === "GET") {
    const storageId = req.query?.storageId
    console.log(storageId)
    const getLikeRef = doc(DBService, "like", `${storageId}`)
    const docSnapShot = await getDoc(getLikeRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()?.likerList
      res.status(200).json(data as string[])
    }
  }
}
