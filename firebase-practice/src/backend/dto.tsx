/**
 * 피드에 관련된 정보를 저장함
 * @imageUrl firebase의 downloadUrl을 나타냄 (렌더링시 이미지 src에 들어갈 정보)
 * @desc 이미지의 설명 정보
 * @location 이미지의 장소 정보
 * @private 공개 / 비공개 여부
 * @storageId 스토리지의 이미지 경로를 나타냄 'images/userId/storageId'
 * @creator 피드를 올린 사람의 userId
 * @uploadTime 피드의 업로드 시간 (components/lib/getCurrentTime.tsx 사용)
 */
export type FeedData = {
  imageUrl: string
  desc: string
  location: string
  private: boolean
  storageId: string
  creator: string
  uploadTime: string
}

/**
 * @userId 댓글을 작성한 사람의 userId (recoilValue userDataState.info.userId 사용)
 * @commentId 각 댓글의 고유 id (v4()함수 사용)
 * @comment 댓글 내용
 * @uploadTime 댓글의 업로드 시간 (components/lib/getCurrentTime.tsx 사용)
 */
export type Comment = {
  userId: string
  commentId: string
  comment: string
  uploadTime: string
}

/**
 *
 */
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
