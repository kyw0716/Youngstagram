import OtherMessageWrapper from "@feature/dm/OtherMessageWrapper"
import Layout from "components/layout"
import { Message, UserData, UserInfo } from "backend/dto"
import { CustomH4, FlexBox, Margin } from "ui"
import MyMessageWrapper from "@feature/dm/MyMessageWrapper"
import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import getUserDataByUid from "lib/getUserDataByUid"
import { authService, DBService } from "@FireBase"
import UserCard from "@feature/dm/UserCard"
import { v4 } from "uuid"
import { doc, onSnapshot } from "firebase/firestore"
import MessageInput from "@feature/dm/MessageInput"

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
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
    position: relative;
  `,
  MessageList: styled.div`
    width: 100%;
    height: calc(70vh - 120px);
    padding: 10px 0px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    ::-webkit-scrollbar {
      display: none;
    }
  `,
}

export default function Dm() {
  const [currentUserFollowList, setCurrentUserFollowList] = useState<string[]>(
    [],
  )
  const [currentUserFollowerList, setCurrentUserFollowerList] = useState<
    string[]
  >([])
  const [isFollowerList, setIsFollowerList] = useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [messageData, setMessageData] = useState<Message[]>([])

  const DMRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (DMRef.current === null) return
    DMRef.current.scrollIntoView({
      block: "start",
      behavior: "auto",
    })
  }, [messageData.length])
  useEffect(() => {
    getUserDataByUid(`${authService.currentUser?.uid}`).then((data) => {
      if (data) {
        setCurrentUserFollowList((data as UserData).follow)
        setCurrentUserFollowerList((data as UserData).follower)
      }
    })
  }, [])
  useEffect(() => {
    if (selectedUserId === "") {
      setMessageData([])
      return
    }
    onSnapshot(
      doc(DBService, `${authService.currentUser?.uid}`, selectedUserId),
      (data) => {
        if (data.data()?.message)
          setMessageData(data.data()?.message as Message[])
        else setMessageData([])
      },
    )
  }, [selectedUserId])
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
                flexShrink: 0,
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
                {currentUserFollowerList && (
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
                )}
              </>
            ) : (
              <>
                {currentUserFollowList && (
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
              </>
            )}
          </Style.FollowListSection>
          <Style.MessageSection>
            <FlexBox
              width={"100%"}
              alignItems="center"
              height={60}
              style={{
                borderBottom: selectedUserId ? "1px solid lightgrey" : "",
                position: "sticky",
                top: 0,
                flexShrink: 0,
                zIndex: 2,
                backgroundColor: "white",
              }}
            >
              {selectedUserId && <UserCard userId={`${selectedUserId}`} />}
            </FlexBox>
            {selectedUserId && (
              <Style.MessageList>
                {messageData.map((message) => {
                  return (
                    <>
                      {message.userId === `${authService.currentUser?.uid}` ? (
                        <MyMessageWrapper messageData={message} />
                      ) : (
                        <OtherMessageWrapper messageData={message} />
                      )}
                      <Margin
                        direction="column"
                        size={15}
                        style={{ flexShrink: 0 }}
                      />
                    </>
                  )
                })}
                <div ref={DMRef}></div>
              </Style.MessageList>
            )}
            {selectedUserId && <MessageInput selectedUserId={selectedUserId} />}
          </Style.MessageSection>
        </FlexBox>
      </Style.Wrapper>
    </Layout>
  )
}
