// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { storageService } from "@FireBase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import type { NextApiRequest, NextApiResponse } from "next"
import { v4 } from "uuid"

/**
 * request url : /api/imageUpload
 * request body :
 * method : POST
 */

export default async function uploadImageToStorage(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let storageId = v4()
  let downloadUrl = ""

  if (req.method === "POST") {
    const { creator, imageFile } = req.body
    const storageRef = ref(storageService, `images/${creator}/${storageId}`)
    console.log(creator, imageFile)
    await uploadBytes(storageRef, imageFile)
      .then(
        async () =>
          await getDownloadURL(storageRef)
            .then((response) => {
              downloadUrl = response
            })
            .then(() => {
              res.status(200).json({ storageId, downloadUrl })
            }),
      )
      .catch((error) => {
        console.log(error.code)
      })
  }
}

// const uploadToStorage = async () => {
//   const storageRef = ref(
//     storageService,
//     `images/${authService.currentUser?.uid}/${randomId}`,
//   )
//   if (imageFile !== undefined)
//     await uploadBytes(storageRef, imageFile)
//       .then(
//         async () =>
//           await getDownloadURL(storageRef).then(async (response) => {
//             uploadToFirestore(response)
//           }),
//       )
//       .catch((error) => {
//         console.log(error.code)
//       })
// }
