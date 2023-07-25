import { darkModeState, feedDataState } from "@share/recoil/recoilList"
import { FeedItem } from "backend/dto"
import { SetStateAction } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"
import { CustomH5, CustomH5Light, CustomH6, FlexBox, Margin } from "ui"

type Props = {
  feedData: FeedItem
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
  name: string | null
}

const Style = {
  DescBox: styled.div`
    width: 100%;
    white-space: pre-wrap;
    padding: 0px 10px;
    max-height: 200px;
    display: flex;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  `,
}

export default function Desc({ feedData, setIsCommentModalOpen, name }: Props) {
  const setSelectedFeedData = useSetRecoilState(feedDataState)
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <Style.DescBox>
      <FlexBox alignItems="center">
        {feedData.desc.length > 0 ? (
          <CustomH5
            style={{ flexShrink: "0", color: isDarkMode ? "white" : "" }}
          >
            {name}
          </CustomH5>
        ) : (
          <CustomH6
            style={{
              cursor: "pointer",
              borderBottom: "1px solid lightgrey",
              color: isDarkMode ? "white" : "",
            }}
            onClick={() => {
              setSelectedFeedData(feedData)
              setIsCommentModalOpen(true)
            }}
          >
            더보기
          </CustomH6>
        )}
        <Margin direction="row" size={10} />
        {feedData.desc.length > 10 ? (
          <FlexBox alignItems="center">
            <CustomH5Light
              style={{ color: isDarkMode ? "white" : "" }}
            >{`${feedData.desc.slice(0, 11)}...`}</CustomH5Light>
            <Margin direction="row" size={5} />
            <CustomH6
              style={{
                cursor: "pointer",
                borderBottom: "1px solid lightgrey",
                color: isDarkMode ? "white" : "",
              }}
              onClick={() => {
                setSelectedFeedData(feedData)
                setIsCommentModalOpen(true)
              }}
            >
              더보기
            </CustomH6>
          </FlexBox>
        ) : (
          <CustomH5Light style={{ color: isDarkMode ? "white" : "" }}>
            {feedData.desc}
          </CustomH5Light>
        )}
      </FlexBox>
    </Style.DescBox>
  )
}
