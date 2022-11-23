import { DBService } from "@FireBase"
import { UserData, UserInfo } from "backend/dto"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * method : GET
 * request url : /api/profile?userId=${유저 아이디}
 * response : userId를 가진 유저의 프로필 정보
 *
 * method : POST
 * requset url : /api/profile
 * request body : {userId, userName, profileImage, email}
 * response : Success
 */

export default async function profile(
  req: NextApiRequest,
  res: NextApiResponse<UserData | string>,
) {
  if (req.method === "GET") {
    const userId = req.query?.userId
    const getProfileRef = doc(DBService, "users", `${userId}`)
    const docSnapShot = await getDoc(getProfileRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()
      res.status(200).json(data as UserData)
    } else {
      res.status(500).json("Fail")
    }
  } else if (req.method === "POST") {
    const { userId, userName, profileImage, email } = req.body
    const setProfileRef = doc(DBService, "users", `${userId}`)

    const profileForm: UserInfo = {
      userId: userId,
      profileImage: profileImage,
      name: userName,
      email: email,
    }

    await updateDoc(setProfileRef, {
      info: profileForm,
    })
      .catch((error) => res.status(500).json(error.code))
      .then(() => {
        res.status(200).json("Success")
      })
  }
}
