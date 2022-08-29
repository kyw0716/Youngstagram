import { atom } from "recoil"
import { UserData } from "backend/dto"

export const userDataState = atom<UserData>({
  key: "USERDATA",
})
