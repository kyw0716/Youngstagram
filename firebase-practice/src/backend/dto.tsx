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
