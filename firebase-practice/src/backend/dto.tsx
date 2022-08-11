export type ImageCreator = {
  name: string | null
  userId: string
  profileImage: string | null
}
export type FeedData = {
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
export type UserInfo = {
  userId: string
  profileImage: string | null
  name: string | null
  email: string | null
}
export type UserData = {
  info: UserInfo
  follow: UserInfo[]
  follower: UserInfo[]
  feed: FeedData[]
}
