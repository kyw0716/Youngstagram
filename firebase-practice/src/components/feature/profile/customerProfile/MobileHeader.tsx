import { DBService } from "@FireBase"
import {
  darkModeState,
  userDataState,
  userListState,
} from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { SetStateAction, useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"
import { CustomH2Light, CustomH4Light, FlexBox, Margin } from "ui"
import { ProfileIcon } from "icons"
import Loading from "@share/Loading/Loading"

type Props = {
  userData: UserData
  setIsUserListModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  ProfileWrapper: styled.div`
    width: 95%;
    height: 120px;
    border-bottom: 1px solid lightgrey;
  `,
  ProfileImage: styled.img`
    width: 90px;
    height: 90px;
    border-radius: 100px;
  `,
  ProfileEditButton: styled.div`
    width: 250px;
    height: 40px;
    -webkit-appearance: none;
    border: 2px solid lightgrey;
    border-radius: 10px;
    background-color: white;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
  `,
  ProfileInfoWrapper: styled.div`
    width: 100%;
    height: 70px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    justify-content: space-between;
  `,
  SortToPublic: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "public" ? "grey" : "none")};
  `,
  SortToPrivate: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "private" ? "grey" : "none")};
  `,
  SortToAll: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "all" ? "grey" : "none")};
  `,
}

export default function MobileHeader({
  userData,
  setIsUserListModalOpen,
}: Props) {
  const [userDataByUserId, setUserDataByUserId] = useState<UserData>()
  const [isCurrentUserFollowed, setIsCurrentUserFollowed] =
    useState<boolean>(false)
  const [isFollowingDataModified, setIsFollowingDataModified] =
    useState<boolean>(false)
  const currentUserData = useRecoilValue(userDataState)

  const setUserList = useSetRecoilState(userListState)
  const isDarkMode = useRecoilValue(darkModeState)

  const handleFollow = async () => {
    const myFirestoreRef = doc(
      DBService,
      "users",
      `${currentUserData.info.userId}`,
    )
    const otherFirestoreRef = doc(DBService, "users", `${userData.info.userId}`)

    await updateDoc(myFirestoreRef, {
      follow: arrayUnion(userData.info.userId),
    }).catch((error) => {
      if (error.code === "not-found") {
        setDoc(myFirestoreRef, {
          follow: [userData.info.userId],
        })
      }
    })
    await updateDoc(otherFirestoreRef, {
      follower: arrayUnion(currentUserData.info.userId),
    }).catch((error) => {
      if (error.code === "not-found") {
        setDoc(otherFirestoreRef, {
          follower: [currentUserData.info.userId],
        })
      }
    })
    setIsCurrentUserFollowed(true)
    setIsFollowingDataModified(true)
  }
  const handleUnFollow = async () => {
    const myFirestoreRef = doc(
      DBService,
      "users",
      `${currentUserData.info.userId}`,
    )
    const otherFirestoreRef = doc(DBService, "users", `${userData.info.userId}`)

    await updateDoc(myFirestoreRef, {
      follow: arrayRemove(userData.info.userId),
    })
    await updateDoc(otherFirestoreRef, {
      follower: arrayRemove(currentUserData.info.userId),
    })
    setIsCurrentUserFollowed(false)
    setIsFollowingDataModified(true)
  }

  useEffect(() => {
    if (userData)
      getUserDataByUid(userData.info.userId).then((data) => {
        if (data) {
          setUserDataByUserId(data as UserData)
        }
      })
  }, [isFollowingDataModified, userData])

  useEffect(() => {
    if (userDataByUserId === undefined) return
    if (userDataByUserId.follower === undefined) return
    setIsCurrentUserFollowed(
      userDataByUserId?.follower.includes(currentUserData.info.userId),
    )
  }, [userDataByUserId])
  return (
    <>
      <Style.ProfileWrapper>
        <FlexBox width={"100%"}>
          <FlexBox width={90} height={90} style={{ flexShrink: 0 }}>
            {userData === undefined ? (
              <Loading width={90} height={90} borderRadius={90} />
            ) : (
              <>
                {userData.info.profileImage !== null ? (
                  <Image
                    src={userData.info.profileImage}
                    alt="profile"
                    width={90}
                    height={90}
                    style={{ borderRadius: "100px" }}
                  />
                ) : (
                  <ProfileIcon width={90} height={90} />
                )}
              </>
            )}
          </FlexBox>
          <Margin direction="row" size={15} />
          <FlexBox column={true} width="fit-content">
            {userData === undefined ? (
              <Loading width={100} height={40} />
            ) : (
              <CustomH2Light
                style={{ fontSize: "20px", color: isDarkMode ? "white" : "" }}
              >
                {userData.info.name}
              </CustomH2Light>
            )}

            <Margin direction="column" size={13} />
            {userData === undefined ? (
              <Loading width={250} height={40} borderRadius={10} />
            ) : (
              <>
                {isCurrentUserFollowed ? (
                  <Style.ProfileEditButton
                    onClick={() => {
                      let wantToUnFollow = confirm("팔로우를 취소하시겠습니까?")
                      if (wantToUnFollow) handleUnFollow()
                    }}
                    style={
                      isDarkMode
                        ? { backgroundColor: "black", color: "white" }
                        : {}
                    }
                  >
                    팔로잉중
                  </Style.ProfileEditButton>
                ) : (
                  <Style.ProfileEditButton
                    onClick={handleFollow}
                    style={
                      isDarkMode
                        ? { backgroundColor: "black", color: "white" }
                        : {}
                    }
                  >
                    팔로우
                  </Style.ProfileEditButton>
                )}
              </>
            )}
          </FlexBox>
        </FlexBox>
      </Style.ProfileWrapper>
      <Margin direction="column" size={15} />
      {userData === undefined ? (
        <Loading width={"95vw"} height={70} borderRadius={10} />
      ) : (
        <Style.ProfileInfoWrapper>
          <Style.SortToAll>
            <CustomH4Light style={{ color: isDarkMode ? "white" : "" }}>
              게시물
            </CustomH4Light>
            <CustomH4Light style={{ color: isDarkMode ? "white" : "" }}>
              {userData.feed ? userData.feed.length : 0}
            </CustomH4Light>
          </Style.SortToAll>
          <Style.SortToPublic
            onClick={() => {
              setUserList(userData.follower)
              setIsUserListModalOpen(true)
            }}
          >
            <CustomH4Light style={{ color: isDarkMode ? "white" : "" }}>
              팔로워
            </CustomH4Light>
            <CustomH4Light style={{ color: isDarkMode ? "white" : "" }}>
              {userData.follower ? userData.follower.length : 0}
            </CustomH4Light>
          </Style.SortToPublic>
          <Style.SortToPrivate>
            <CustomH4Light
              onClick={() => {
                setUserList(userData.follow)
                setIsUserListModalOpen(true)
              }}
              style={{ color: isDarkMode ? "white" : "" }}
            >
              팔로우
            </CustomH4Light>
            <CustomH4Light style={{ color: isDarkMode ? "white" : "" }}>
              {userData.follow ? userData.follow.length : 0}
            </CustomH4Light>
          </Style.SortToPrivate>
        </Style.ProfileInfoWrapper>
      )}
    </>
  )
}
