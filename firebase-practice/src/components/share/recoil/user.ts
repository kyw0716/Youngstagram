import { atom, selector } from "recoil"
import { userDataState } from "./recoilList"
import axios from "axios"
import { UserData, UserInfo } from "backend/dto"

export const followUsersSelector = selector({
  key: "followUsersSelectorKey",
  get: async ({ get }) => {
    const currentUser = get(userDataState)
    const followUserIds = currentUser.follow ?? []
    const followUsers = await Promise.all(
      followUserIds.map(async (userId) => {
        const followUser = await axios
          .get(`/api/profile?userId=${userId}`)
          .then<UserData>((response) => response.data)

        return followUser.info
      }),
    )

    return followUsers
  },
})
