import { FeedItem } from "backend/dto"
import { atom } from "recoil"

export const mainFeedItemsAtom = atom<FeedItem[]>({
  key: "mainFeedItemsKey",
  default: [],
  effects: [
    ({ setSelf, trigger }) => {
      const getFeedItems = async () => {
        const feedItems = await fetch("/api/feed", {
          method: "GET",
        }).then<FeedItem[]>((response) => response.json())

        setSelf(feedItems)
      }

      if (trigger === "get") getFeedItems()
    },
  ],
})
