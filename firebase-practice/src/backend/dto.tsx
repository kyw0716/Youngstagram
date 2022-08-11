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
}
export type UserData = {
  info: UserInfo
  follow: UserInfoForFollow[]
  follower: UserInfoForFollow[]
  feed: FeedData[]
}
export type UserInfoForFollow = {
  userId: string
  profileImage: string | null
  name: string | null
}
