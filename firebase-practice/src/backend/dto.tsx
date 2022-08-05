export type Creator = {
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
  creator: Creator
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
