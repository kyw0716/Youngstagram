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

export const pickFeedDataType = atom<"all" | "public" | "private">({
  key: "FEEDTYPE",
  default: "all",
})
