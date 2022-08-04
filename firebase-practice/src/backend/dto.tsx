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
}
export type Comment = {
  name: string
  userId: string
  commentId: string
  comment: string
  profileImage: string
}
