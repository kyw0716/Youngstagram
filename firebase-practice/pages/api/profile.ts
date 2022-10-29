import { DBService } from "@FireBase"
import { UserData } from "backend/dto"
import { doc, getDoc } from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * request url : /api/profile?userId=${유저 아이디}
 * method : GET
 */

export default async function getProfile(
  req: NextApiRequest,
  res: NextApiResponse<UserData>,
) {
  if (req.method === "GET") {
    const userId = req.query?.userId
    console.log(userId)
    const getProfileRef = doc(DBService, "users", `${userId}`)
    const docSnapShot = await getDoc(getProfileRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()
      res.status(200).json(data as UserData)
    }
  }
}
