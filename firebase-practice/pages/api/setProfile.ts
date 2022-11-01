import { DBService } from "@FireBase"
import { UserData, UserInfo } from "backend/dto"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * @requestUrl /api/profile?userId=${유저 아이디}
 * @requestData {
 *  userId: string => 유저 uid
 *  profileImage: string => 프로필 이미지 url
 *  name: string => 유저 이름
 *  email: string => 유저 이메일
 *  currentUser: User => authService.currentUser
 * }
 * @method GET
 * @response userId를 가진 유저의 프로필 정보
 */

export default async function getProfile(
  req: NextApiRequest,
  res: NextApiResponse<UserData | string>,
) {
  if (req.method === "POST") {
    const { userId, userName, profileImage, email, currentUser } = req.body
    const setProfileRef = doc(DBService, "users", `${userId}`)

    const profileForm: UserInfo = {
      userId: userId,
      profileImage: profileImage,
      name: userName,
      email: email,
    }

    await updateProfile(currentUser, {
      displayName: userName,
      photoURL: profileImage,
    }).catch((error) => res.status(500).json(error.code))
    await updateDoc(setProfileRef, {
      info: profileForm,
    }).catch((error) => res.status(500).json(error.code))

    res.status(200).json("Success")
  }
}
