import { DBService } from "@FireBase"
import { Comment, UserData } from "backend/dto"
import { doc, getDoc } from "firebase/firestore"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * request url : /api/comment?commentId=${코멘트 아이디}
 * method : GET
 * response : commentId를 가진 피드의 코멘트 정보 배열
 */

export default async function getComment(
  req: NextApiRequest,
  res: NextApiResponse<Comment[] | string>,
) {
  if (req.method === "GET") {
    const commentId = req.query?.commentId
    console.log(commentId)
    const getCommentRef = doc(DBService, "Comments", `${commentId}`)
    const docSnapShot = await getDoc(getCommentRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()?.AllComments
      res.status(200).json(data as Comment[])
    } else {
      res.status(500).json("Fail")
    }
  }
}
