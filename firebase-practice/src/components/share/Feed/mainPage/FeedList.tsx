import { FeedItem } from "backend/dto"
import { CameraIcon } from "icons"
import { SetStateAction } from "react"
import styled from "styled-components"
import { CustomH2Light, CustomH5Light } from "ui"
import FeedCard from "./FeedCard"
import { useRecoilValue } from "recoil"
import { mainFeedItemsAtom } from "@share/recoil/feed"

type Props = {
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
  setIsLikeModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  Container: styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 50px;
  `,
}

export default function FeedList({
  setIsCommentModalOpen,
  setIsLikeModalOpen,
}: Props) {
  const feedItems = useRecoilValue(mainFeedItemsAtom)

  return (
    <Style.Container>
      {feedItems.length !== 0 ? (
        feedItems
          .filter((feed) => !feed.isPrivate)
          .map((data) => {
            return (
              <FeedCard
                key={data.storageId}
                feedData={data}
                setIsCommentModalOpen={setIsCommentModalOpen}
                setIsLikeModalOpen={setIsLikeModalOpen}
              />
            )
          })
      ) : (
        <>
          <CameraIcon width={62} height={62} />
          <CustomH2Light>사진 공유</CustomH2Light>
          <CustomH5Light>
            상단 바에 있는 아이콘을 클릭하여 사진을 공유할 수 있습니다.
          </CustomH5Light>
        </>
      )}
    </Style.Container>
  )
}
