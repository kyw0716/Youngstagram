import { feedDataState } from "@share/recoil/recoilList"
import axios from "axios"
import { Comment, FeedItems } from "backend/dto"
import { SetStateAction, useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import styled from "styled-components"
import { Margin } from "ui"

type Props = {
  feedData: FeedItems
  setIsCommentModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  GridItem: styled.div`
    width: 100%;
    padding-top: 100%;
    background-image: url(${(props) => props.about});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
  `,
  GridShadow: styled.div`
    width: 100%;
    padding-top: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
  `,
  ItemTextArea: styled.div`
    display: flex;
    font-size: 20px;
    font-weight: bold;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  `,
}

export default function FeedGridCard({
  feedData,
  setIsCommentModalOpen,
}: Props) {
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [likeData, setLikeData] = useState<string[]>()
  const [isHover, setIsHover] = useState<boolean>(false)
  const setSelectedFeedData = useSetRecoilState(feedDataState)

  useEffect(() => {
    axios<Comment[]>({
      method: "GET",
      url: `/api/comment?commentId=${feedData.storageId}`,
    }).then((response) => {
      setCommentData(response.data)
    })

    axios<string[]>({
      method: "GET",
      url: `/api/like?storageId=${feedData.storageId}`,
    }).then((response) => {
      setLikeData(response.data)
    })
  }, [])

  return (
    <>
      <Style.GridItem
        about={feedData.imageUrl}
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
        onClick={() => {
          setSelectedFeedData(feedData)
          setIsCommentModalOpen(true)
        }}
      >
        {isHover && (
          <>
            <Style.GridShadow />
            <Style.ItemTextArea>
              {likeData && <span>🤍{`${likeData.length}`}</span>}
              <Margin direction="row" size={10} />
              {commentData && <span>💬{`${commentData.length}`}</span>}
            </Style.ItemTextArea>
          </>
        )}
      </Style.GridItem>
    </>
  )
}
