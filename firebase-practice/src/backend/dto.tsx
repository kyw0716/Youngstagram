export type ImageCreator = {
  name: string | null
  id: string
  profileImage: string | null
}
export type UserImageDataAll = {
  imageUrl: string
  desc: string
  location: string
  private: boolean
  storageId: string
  creator: ImageCreator
  uploadTime: string
}
export type Comment = {
  name: string
  userId: string
  commentId: string
  comment: string
  profileImage: string
  uploadTime: string
}
export type UserData = {
  userId: string
  profileImage: string | null
  name: string | null
}
