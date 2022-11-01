import { DBService } from "@FireBase"
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * method : GET
 * request url : /api/like?storageId=${이미지 저장 스토리지 아이디}
 * response : storageId를 가진 피드를 좋아요 한 사람들 리스트
 *
 * method : PUT
 * requset url : /api/like
 * request data : {storageId, userId}
 * response : Success
 *
 * method : DELETE
 * requset url : /api/like
 * request data : {storageId, userId}
 * rseponse : Success
 */

export default async function getLike(
  req: NextApiRequest,
  res: NextApiResponse<string[] | string>,
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
  } else if (req.method === "DELETE") {
    const { storageId, userId } = req.body
    const likeRef = doc(DBService, "like", storageId)

    await updateDoc(likeRef, {
      likerList: arrayRemove(userId),
    })
      .catch((error) => {
        res.status(500).json(error.code)
      })
      .then(() => {
        res.status(200).json("Success")
      })
  } else if (req.method === "PUT") {
    const { storageId, userId } = req.body
    const likeRef = doc(DBService, "like", storageId)

    await updateDoc(likeRef, {
      likerList: arrayUnion(userId),
    })
      .catch(async (error) => {
        if (error.code === "not-found") {
          await setDoc(likeRef, {
            likerList: [userId],
          }).catch((error) => res.status(500).json(error.code))
        } else {
          res.status(500).json(error.code)
        }
      })
      .then(() => {
        res.status(200).json("Success")
      })
  }
}
