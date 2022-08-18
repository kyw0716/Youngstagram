import OtherMessageWrapper from "@feature/dm/OtherMessageWrapper"
import Layout from "components/layout"
import { Message, UserData, UserInfo } from "backend/dto"
import { CustomH4, FlexBox, Margin } from "ui"
import MyMessageWrapper from "@feature/dm/MyMessageWrapper"
import styled from "styled-components"
import { useEffect, useState } from "react"
import getUserDataByUid from "lib/getUserDataByUid"
import { authService, DBService } from "@FireBase"
import UserCard from "@feature/dm/UserCard"
import { v4 } from "uuid"
import { doc, onSnapshot } from "firebase/firestore"

const Style = {
  Wrapper: styled.div`
    margin-top: 10vh;
    width: 100vw;
    height: max-content;
    display: flex;
    justify-content: center;
  `,
  FollowListSection: styled.div`
    width: 349px;
    height: 70vh;
    border: 1px solid lightgrey;
    border-right: none;
    display: flex;
    flex-direction: column;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
  `,
  SelectFollowOrFollowerBtn: styled.div`
    width: fit-content;
    height: fit-content;
    padding: 5px;
    border: 1px solid lightgrey;
    background-color: ${(props) => props.about};
    border-radius: 20px;
    cursor: pointer;
  `,
  MessageSection: styled.div`
    width: 583px;
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 15;
    border: 1px solid lightgrey;
    overflow: auto;
    padding-bottom: 15px;
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
  `,
}
export default function Test() {
  const [currentUserFollowList, setCurrentUserFollowList] = useState<string[]>(
    [],
  )
  const [currentUserFollowerList, setCurrentUserFollowerList] = useState<
    string[]
  >([])
  const [isFollowerList, setIsFollowerList] = useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  useEffect(() => {
    getUserDataByUid(`${authService.currentUser?.uid}`).then((data) => {
      if (data) {
        setCurrentUserFollowList((data as UserData).follow)
        setCurrentUserFollowerList((data as UserData).follower)
      }
    })
  }, [])
  return (
    <Layout>
      <Style.Wrapper>
        <FlexBox width={"932px"} height={"70vh"}>
          <Style.FollowListSection>
            <FlexBox
              width={"100%"}
              alignItems={"center"}
              height={60}
              style={{
                borderBottom: "1px solid lightgrey",
                position: "sticky",
                top: 0,
                marginBottom: 15,
              }}
            >
              <UserCard userId={`${authService.currentUser?.uid}`} />
              <Margin direction="row" size={15} />
              <Style.SelectFollowOrFollowerBtn
                about={isFollowerList ? "lightgrey" : "white"}
                onClick={() => {
                  setIsFollowerList((current) => !current)
                  setSelectedUserId("")
                }}
              >
                {isFollowerList ? "팔로우로 전환" : "팔로워로 전환"}
              </Style.SelectFollowOrFollowerBtn>
            </FlexBox>
            <FlexBox width={"100%"} justifyContents="center">
              <CustomH4>
                {isFollowerList ? "팔로워 목록" : "팔로우 목록"}
              </CustomH4>
            </FlexBox>
            <Margin direction="column" size={10} />
            {isFollowerList ? (
              <>
                {currentUserFollowerList.map((data) => {
                  return (
                    <FlexBox
                      width={"100%"}
                      height={60}
                      key={v4()}
                      alignItems="center"
                      onClick={() => {
                        if (selectedUserId === data) {
                          setSelectedUserId("")
                          return
                        }
                        setSelectedUserId(data)
                      }}
                      style={{
                        backgroundColor:
                          data === selectedUserId ? "lightgrey" : "white",
                        cursor: "pointer",
                      }}
                    >
                      <UserCard userId={data} />
                    </FlexBox>
                  )
                })}
              </>
            ) : (
              <>
                {currentUserFollowList.map((data) => {
                  return (
                    <FlexBox
                      width={"100%"}
                      height={60}
                      key={v4()}
                      alignItems="center"
                      onClick={() => {
                        if (selectedUserId === data) {
                          setSelectedUserId("")
                          return
                        }
                        setSelectedUserId(data)
                      }}
                      style={{
                        backgroundColor:
                          data === selectedUserId ? "lightgrey" : "white",
                        cursor: "pointer",
                      }}
                    >
                      <UserCard userId={data} />
                    </FlexBox>
                  )
                })}
              </>
            )}
          </Style.FollowListSection>
          <Style.MessageSection>
            <FlexBox
              width={"100%"}
              alignItems="center"
              height={60}
              style={{
                borderBottom: "1px solid lightgrey",
                position: "sticky",
                top: 0,
                flexShrink: 0,
                zIndex: 2,
                backgroundColor: "white",
                marginBottom: 15,
              }}
            >
              {selectedUserId && <UserCard userId={`${selectedUserId}`} />}
            </FlexBox>
            <OtherMessageWrapper
              messageData={
                {
                  userId: "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
                  message:
                    "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
                  messageId: "1",
                  uploadTime: "1",
                } as Message
              }
            />
            <MyMessageWrapper
              messageData={
                {
                  userId: "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
                  message:
                    "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
                  messageId: "1",
                  uploadTime: "1",
                } as Message
              }
            />
            <OtherMessageWrapper
              messageData={
                {
                  userId: "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
                  message:
                    "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
                  messageId: "1",
                  uploadTime: "1",
                } as Message
              }
            />
            <MyMessageWrapper
              messageData={
                {
                  userId: "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
                  message:
                    "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
                  messageId: "1",
                  uploadTime: "1",
                } as Message
              }
            />
            <OtherMessageWrapper
              messageData={
                {
                  userId: "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
                  message:
                    "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
                  messageId: "1",
                  uploadTime: "1",
                } as Message
              }
            />
          </Style.MessageSection>
        </FlexBox>
      </Style.Wrapper>
    </Layout>
  )
}
