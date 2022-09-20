import { atom } from "recoil"
import { FeedData, UserData } from "backend/dto"

export const userDataState = atom<UserData>({
  key: "USERDATAATOM",
  default: {
    info: {
      userId: "",
      profileImage: "",
      name: "",
      email: "",
    },
    follow: [],
    follower: [],
    feed: [],
  },
})

export const FeedDataFilter = atom<"all" | "public" | "private">({
  key: "FEEDFILTERATOM",
  default: "all",
})

export const feedDataState = atom<FeedData>({
  key: "FEEDDATAATOM",
  default: {
    imageUrl: "",
    desc: "",
    location: "",
    private: true,
    storageId: "",
    creator: "",
    uploadTime: "",
  },
})

export const userListState = atom<string[]>({
  key: "USERLISTATOM",
  default: [],
})

export const darkModeState = atom<boolean>({
  key: "DARKMODEATOM",
  default: false,
})
