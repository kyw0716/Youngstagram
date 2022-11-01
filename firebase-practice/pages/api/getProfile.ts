import { DBService } from "@FireBase"
import { UserData } from "backend/dto"
import { doc, getDoc } from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * request url : /api/profile?userId=${유저 아이디}
 * method : GET
 * response : userId를 가진 유저의 프로필 정보
 */

export default async function getProfile(
  req: NextApiRequest,
  res: NextApiResponse<UserData | string>,
) {
  if (req.method === "GET") {
    const userId = req.query?.userId
    console.log(userId)
    const getProfileRef = doc(DBService, "users", `${userId}`)
    const docSnapShot = await getDoc(getProfileRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()
      res.status(200).json(data as UserData)
    } else {
      res.status(500).json("Fail")
    }
  }
}
