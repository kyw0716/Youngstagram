import { DBService } from "@FireBase"
import { UserData } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * method : GET
 * request url : /api/like?userId=${userId}
 * response : userId를 가진 유저가 좋아요 누른 피드 아이디 리스트
 *
 * method : GET
 * request url : /api/like?storageId=${storageId}
 * response : storageId를 가진 피드를 좋아요 한 유저들의 아이디 리스트
 *
 * method : PUT
 * requset url : /api/like
 * request body : {storageId, userId}
 * response : Success
 *
 * method : DELETE
 * requset url : /api/like
 * request body : {storageId, userId}
 * rseponse : Success
 */

export default async function getLike(
  req: NextApiRequest,
  res: NextApiResponse<string[] | string>,
) {
  if (req.method === "GET") {
    const { storageId, userId } = req.query

    if (userId !== undefined) {
      const getLikeFeedIdsRef = doc(DBService, "users", `${userId}`)
      const docSnapShot = await getDoc(getLikeFeedIdsRef)

      if (docSnapShot.exists()) {
        const likeFeedIds = docSnapShot.data().likeFeedIds

        res.status(200).json(likeFeedIds as string[])
        return
      }
      res.status(404).json("not-found")
      return
    }
    if (storageId !== undefined && typeof storageId === "string") {
      const querySnapShot = await getDocs(collection(DBService, "users"))
      const userIds: string[] = []

      querySnapShot.forEach((doc) => {
        const user = doc.data() as Omit<UserData, "feed">

        if ((user.likeFeedIds ?? []).includes(storageId))
          userIds.push(user.info.userId)
      })

      res.status(200).json(userIds)
    }
  } else if (req.method === "PUT") {
    const { storageId, userId } = req.body
    const userLikeFeedIdsRef = doc(DBService, "users", userId)

    updateDoc(userLikeFeedIdsRef, {
      likeFeedIds: arrayUnion(storageId),
    })
      .then(() => {
        res.status(200).json("success")
      })
      .catch((error) => {
        if (error === "not-found") {
          setDoc(userLikeFeedIdsRef, {
            likeFeedIds: [storageId],
          })
          return
        }
        res.status(500).json(error.code)
      })
  } else if (req.method === "DELETE") {
    const { storageId, userId } = req.query
    const likeFeedIdsRef = doc(DBService, "users", `${userId}`)

    await updateDoc(likeFeedIdsRef, {
      likeFeedIds: arrayRemove(storageId),
    })
      .catch((error) => {
        res.status(500).json(error.code)
      })
      .then(() => {
        res.status(200).json("Success")
      })
  }
}
