import { DBService } from "@FireBase"
import { FeedData, UserData, Comment } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH4, CustomH6, FlexBox, Margin } from "ui"
import CommentWrapper from "./CommentWrapper"
import { v4 } from "uuid"
import { useRecoilValue } from "recoil"
import { userDataState } from "@share/recoil/recoilList"

type Props = {
  feedData: FeedData
  commentAreaRef: React.RefObject<HTMLDivElement>
}

const Style = {
  CommentWrapper: styled.div`
    width: 100%;
    height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow-y: scroll;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      display: none;
    }
    @media (max-width: 900px) {
      width: 95vw;
      height: 27vh;
    }
  `,
  Header: styled.div`
    display: flex;
    height: 70px;
    width: 100%;
    border-bottom: 1px solid lightgrey;
    align-items: center;
    padding-left: 15px;
    @media (max-width: 900px) {
      height: 50px;
      width: 95vw;
    }
  `,
  CommentAreaHeader: styled.div`
    display: flex;
    width: 50%;
    height: fit-content;
    padding-left: 15px;
    flex-shrink: 0;
    @media (max-width: 900px) {
      width: 90vw;
    }
  `,
}

export default function CommentList({ feedData, commentAreaRef }: Props) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>()
  const [commentData, setCommentData] = useState<Comment[]>([])
  const currenUserData = useRecoilValue(userDataState)

  useEffect(() => {
    onSnapshot(doc(DBService, "users", `${feedData.creator}`), (data) => {
      if (data) setUserData(data.data() as UserData)
    })
    onSnapshot(doc(DBService, "Comments", `${feedData.storageId}`), (data) => {
      if (data) setCommentData(data.data()?.AllComments)
    })
  }, [])
  return (
    <>
      <Style.Header>
        <Image
          width={32}
          height={32}
          style={{ borderRadius: "32px", cursor: "pointer" }}
          src={
            userData?.info.profileImage
              ? userData.info.profileImage
              : "/profile.svg"
          }
          onClick={() => {
            if (userData?.info.userId === currenUserData.info.userId) {
              router.push(`/u/${currenUserData.info.userId}`)
              return
            }
            router.push(`/profile/${userData?.info.userId}`)
          }}
          alt="profile"
        />
        <Margin direction="row" size={14} />
        <FlexBox column={true}>
          <CustomH4 style={{ color: "black" }}>{userData?.info.name}</CustomH4>
          <CustomH6>{feedData.location}</CustomH6>
        </FlexBox>
      </Style.Header>
      <Margin direction="column" size={10} />
      <Style.CommentWrapper>
        <Style.CommentAreaHeader>
          <FlexBox height={32} width={32}>
            <Image
              width={32}
              height={32}
              src={
                userData?.info.profileImage
                  ? userData?.info.profileImage
                  : "/profile.svg"
              }
              alt="profile"
              onClick={() => {
                if (userData?.info.userId === currenUserData.info.userId) {
                  router.push(`/u/${currenUserData.info.userId}`)
                  return
                }
                router.push(`/profile/${userData?.info.userId}`)
              }}
              style={{ borderRadius: "32px", cursor: "pointer" }}
            />
          </FlexBox>
          <Margin direction="row" size={10} />
          <FlexBox
            column={true}
            width={"fit-content"}
            style={{ paddingRight: "20px" }}
          >
            <Margin direction="column" size={5} />
            <CustomH4 style={{ color: "black" }}>
              {userData?.info.name}
            </CustomH4>
            {feedData.desc}
          </FlexBox>
        </Style.CommentAreaHeader>
        <Margin direction="column" size={25} style={{ flexShrink: 0 }} />
        {commentData !== undefined &&
          commentData
            .sort(function (a, b) {
              return Number(a.uploadTime) - Number(b.uploadTime)
            })
            .map((data, index) => {
              return (
                <>
                  {index === commentData.length - 1 && (
                    <div ref={commentAreaRef}></div>
                  )}
                  <CommentWrapper
                    key={v4()}
                    commentData={data}
                    storageId={feedData.storageId}
                  />
                </>
              )
            })}
      </Style.CommentWrapper>
      <Margin direction="column" size={10} />
    </>
  )
}
