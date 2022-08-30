import { atom } from "recoil"
import { UserData } from "backend/dto"

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
