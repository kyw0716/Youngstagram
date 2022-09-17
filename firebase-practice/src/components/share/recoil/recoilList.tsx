import { atom } from "recoil"
import { FeedData, UserData } from "backend/dto"

export const userDataState = atom<UserData>({
  key: "USERDATA",
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
  key: "FEEDFILTER",
  default: "all",
})

export const feedDataState = atom<FeedData>({
  key: "FEEDDATA",
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
