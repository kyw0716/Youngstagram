import { DBService } from "@FireBase"
import { doc, DocumentData, getDoc } from "firebase/firestore"

export default async function getUserByUid(
  uid: string,
): Promise<DocumentData | void> {
  const profileRef = doc(DBService, "users", uid)
  const userData = await getDoc(profileRef).catch((error) =>
    console.log(error.code),
  )
  if (userData) {
    return userData.data()
  }
  return userData
}
