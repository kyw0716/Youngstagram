import { DBService } from "@FireBase"
import { FeedData, UserData, Comment } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/router"
import { SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH4, CustomH6, FlexBox, Margin } from "ui"
import CommentWrapper from "./CommentWrapper"
import { v4 } from "uuid"
import { useRecoilValue } from "recoil"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { ProfileIcon } from "icons"

type Props = {
  feedData: FeedData
  commentAreaRef: React.RefObject<HTMLDivElement>
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
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
    width: 100%;
    height: fit-content;
    padding-left: 15px;
    flex-shrink: 0;
    @media (max-width: 900px) {
      width: 90vw;
    }
  `,
}

export default function CommentList({
  feedData,
  commentAreaRef,
  setIsOpen,
}: Props) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>()
  const [commentData, setCommentData] = useState<Comment[]>([])
  const currentUserData = useRecoilValue(userDataState)
  const isDarkMode = useRecoilValue(darkModeState)

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
        <FlexBox width={32} height={32} style={{ flexShrink: 0 }}>
          {userData?.info.profileImage ? (
            <Image
              width={32}
              height={32}
              style={{ borderRadius: "32px", cursor: "pointer" }}
              src={userData?.info.profileImage}
              onClick={() => {
                if (userData?.info.userId === currentUserData.info.userId) {
                  router.push(`/mypage`)
                  return
                }
                router.push(`/profile/${userData?.info.userId}`)
              }}
              alt="profile"
            />
          ) : (
            <ProfileIcon
              width={32}
              height={32}
              onClick={() => {
                if (userData?.info.userId === currentUserData.info.userId) {
                  router.push(`/mypage`)
                  return
                }
                router.push(`/profile/${userData?.info.userId}`)
              }}
            />
          )}
        </FlexBox>
        <Margin direction="row" size={14} />
        <FlexBox column={true}>
          <CustomH4 style={{ color: isDarkMode ? "white" : "black" }}>
            {userData?.info.name}
          </CustomH4>
          <CustomH6>{feedData.location}</CustomH6>
        </FlexBox>
      </Style.Header>
      <Margin direction="column" size={10} />
      <Style.CommentWrapper>
        <Style.CommentAreaHeader>
          <FlexBox height={32} width={32} style={{ flexShrink: 0 }}>
            {userData?.info.profileImage ? (
              <Image
                width={32}
                height={32}
                src={userData?.info.profileImage}
                alt="profile"
                onClick={() => {
                  if (userData?.info.userId === currentUserData.info.userId) {
                    router.push(`/mypage`)
                    return
                  }
                  router.push(`/profile/${userData?.info.userId}`)
                }}
                style={{ borderRadius: "32px", cursor: "pointer" }}
                priority={true}
              />
            ) : (
              <ProfileIcon
                width={32}
                height={32}
                onClick={() => {
                  if (userData?.info.userId === currentUserData.info.userId) {
                    router.push(`/mypage`)
                    return
                  }
                  router.push(`/profile/${userData?.info.userId}`)
                }}
              />
            )}
          </FlexBox>
          <Margin direction="row" size={10} />
          <FlexBox
            column={true}
            width={"fit-content"}
            style={{ paddingRight: "20px", color: isDarkMode ? "white" : "" }}
          >
            <Margin direction="column" size={5} />
            <CustomH4 style={{ color: isDarkMode ? "white" : "black" }}>
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
                <FlexBox
                  key={v4()}
                  width={"max-content"}
                  height={"max-content"}
                  style={{ flexShrink: 0, marginBottom: 20 }}
                >
                  {index === commentData.length - 1 && (
                    <div ref={commentAreaRef}></div>
                  )}
                  <CommentWrapper
                    commentData={data}
                    storageId={feedData.storageId}
                    setIsOpen={setIsOpen}
                  />
                </FlexBox>
              )
            })}
      </Style.CommentWrapper>
      <Margin direction="column" size={10} />
    </>
  )
}
