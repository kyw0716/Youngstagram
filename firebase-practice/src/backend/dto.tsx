export type UserImageDataAll = {
  image: string
  imageTitle: string
  private: boolean
  creator: string
  creatorProfile: string
}
//TODO: 이름 비교를 통해 삭제하던 방식을 id를 비교하여 삭제하는 방식으로 바꾸기
export type Creator = {
  name: string
  id: string
  ProfileImage: string
}

//TODO: dto 바뀐거 적용시켜서 재배포하기
// 이미지 주소, 이미지에 있는 설명, 해당 이미지의 장소(얜 써도되고 아니어도 됨), 공개 비공개 여부, 저장소 id
// 이미지를 생성한 사람의 정보(이름, id, 프로필 이미지 주소)
export type UserImageDataAllDemo = {
  image: string
  imageDesc: string
  location: string
  private: boolean
  storageId: string
  creator: Creator
}
