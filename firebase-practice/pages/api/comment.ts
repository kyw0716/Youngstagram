import { DBService } from "@FireBase"
import { Comment } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import getCurrentTime from "lib/getCurrentTime"
import { NextApiRequest, NextApiResponse } from "next"
import { v4 } from "uuid"

/**
 * method : GET
 * request url : /api/comment?commentId=${코멘트 아이디}
 * response : commentId를 가진 피드의 코멘트 정보 배열
 *
 * method : POST
 * request url : /api/comment
 * request body : {commentId?, oldComment?, uploadTime?, userId, comment, feedId}
 * response : Success
 *
 * update : commentId, oldComment, uploadTime 모두 포함한 데이터 전송
 * new comment : userId, comment, feedId 만을 포함한 데이터 전송
 *
 *
 * method : DELETE
 * request url : /api/comment
 * request body : {commentId, comment, uploadTime, userId, feedId}
 * response : Success
 */

export default async function getComment(
  req: NextApiRequest,
  res: NextApiResponse<Comment[] | string>,
) {
  if (req.method === "GET") {
    const commentId = req.query?.commentId
    const getCommentRef = doc(DBService, "Comments", `${commentId}`)
    const docSnapShot = await getDoc(getCommentRef)

    if (docSnapShot.exists()) {
      const data = docSnapShot.data()?.AllComments
      res.status(200).json(data as Comment[])
    } else {
      res.status(500).json("Fail")
    }
  }
  if (req.method === "POST") {
    const { commentId, userId, comment, feedId, uploadTime, oldComment } =
      req.body
    const commentRef = doc(DBService, "Comments", feedId)

    if (commentId) {
      const commentFormToRemove: Comment = {
        userId: userId,
        commentId: commentId,
        comment: oldComment,
        uploadTime: uploadTime,
      }
      const commentFormToUpdate: Comment = {
        userId: userId,
        commentId: commentId,
        comment: comment,
        uploadTime: uploadTime,
      }
      await updateDoc(commentRef, {
        AllComments: arrayRemove(commentFormToRemove),
      })
        .catch((error) => res.status(500).json(error.code))
        .then(async () => {
          await updateDoc(commentRef, {
            AllComments: arrayUnion(commentFormToUpdate),
          })
            .catch((error) => res.status(500).json(error.code))
            .then(() => {
              res.status(200).json("Success")
            })
        })
    } else {
      const commentForm: Comment = {
        userId: userId,
        commentId: v4(),
        comment: comment,
        uploadTime: getCurrentTime(),
      }
      await updateDoc(commentRef, {
        AllComments: arrayUnion(commentForm),
      })
        .catch(async (error) => {
          if (error.code === "not-found") {
            await setDoc(commentRef, {
              AllComments: [commentForm],
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
  if (req.method === "DELETE") {
    const { commentId, userId, comment, feedId, uploadTime } = req.body
    const commentRef = doc(DBService, "Comments", feedId)
    const commentFormToRemove: Comment = {
      userId: userId,
      commentId: commentId,
      comment: comment,
      uploadTime: uploadTime,
    }

    await updateDoc(commentRef, {
      AllComments: arrayRemove(commentFormToRemove),
    })
      .catch((error) => res.status(500).json(error.code))
      .then(() => {
        res.status(200).json("Success")
      })
  }
}
