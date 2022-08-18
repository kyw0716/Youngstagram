export type FeedData = {
  imageUrl: string
  desc: string
  location: string
  private: boolean
  storageId: string
  creator: string
  uploadTime: string
}
export type Comment = {
  userId: string
  commentId: string
  comment: string
  uploadTime: string
}
export type Message = {
  userId: string
  message: string
  messageId: string
  uploadTime: string
}
export type UserInfo = {
  userId: string
  profileImage: string | null
  name: string | null
  email: string | null
}
export type UserData = {
  info: UserInfo
  follow: string[]
  follower: string[]
  feed: FeedData[]
}
export type LikeData = {
  likerList: string[]
}
