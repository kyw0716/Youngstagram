import { DBService } from "@FireBase"
import CommentModal from "@share/Modal/comment/CommentModal"
import { feedDataState } from "@share/recoil/recoilList"
import { Comment, FeedData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import { SetStateAction, useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import styled from "styled-components"
import { Margin } from "ui"

type Props = {
  feedData: FeedData
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
    onSnapshot(doc(DBService, "Comments", feedData.storageId), (data) => {
      if (data) setCommentData(data.data()?.AllComments as Comment[])
    })
    onSnapshot(doc(DBService, "like", feedData.storageId), (data) => {
      if (data) setLikeData(data.data()?.likerList as string[])
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
