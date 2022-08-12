import { authService, DBService } from "@FireBase"
import FollowListModal from "@share/Modal/follow/FollowListModal"
import { UserData, UserInfo } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { CustomH2Light, CustomH4Light, FlexBox, Margin } from "ui"

type Props = {
  userData: UserData
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

export default function MobileHeader({ userData }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [userDataByUserId, setUserDataByUserId] = useState<UserData>()
  const [followData, setFollowData] = useState<string[]>()
  const [isCurrentUserFollowed, setIsCurrentUserFollowed] =
    useState<boolean>(false)

  const handleFollow = async () => {
    const myFirestoreRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
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
      follower: arrayUnion(authService.currentUser?.uid),
    }).catch((error) => {
      if (error.code === "not-found") {
        setDoc(otherFirestoreRef, {
          follower: [authService.currentUser?.uid],
        })
      }
    })
    setIsCurrentUserFollowed(true)
  }
  const handleUnFollow = async () => {
    const myFirestoreRef = doc(
      DBService,
      "users",
      `${authService.currentUser?.uid}`,
    )
    const otherFirestoreRef = doc(DBService, "users", `${userData.info.userId}`)

    await updateDoc(myFirestoreRef, {
      follow: arrayRemove(userData.info.userId),
    })
    await updateDoc(otherFirestoreRef, {
      follower: arrayRemove(authService.currentUser?.uid),
    })
    setIsCurrentUserFollowed(false)
  }

  useEffect(() => {
    getUserDataByUid(userData.info.userId).then((data) => {
      if (data) {
        setUserDataByUserId(data as UserData)
      }
    })
  }, [])

  useEffect(() => {
    if (userDataByUserId === undefined) return
    if (authService.currentUser === null) return
    setIsCurrentUserFollowed(
      userDataByUserId?.follower.includes(authService.currentUser?.uid),
    )
  }, [userDataByUserId, authService.currentUser])

  useEffect(() => {
    if (modalTitle === "") return
    if (modalTitle === "팔로우") setFollowData(userDataByUserId?.follow)
    if (modalTitle === "팔로워") setFollowData(userDataByUserId?.follower)
  }, [modalTitle])
  return (
    <>
      <FollowListModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={modalTitle}
        userList={followData !== undefined ? followData : []}
      />
      <Style.ProfileWrapper>
        <FlexBox width={"100%"}>
          <Image
            src={
              userData.info.profileImage
                ? `${userData.info.profileImage}`
                : "/profile.svg"
            }
            alt="profile"
            width={90}
            height={90}
            style={
              userData.info.profileImage
                ? { borderRadius: "100px" }
                : { borderRadius: "none" }
            }
          />
          <Margin direction="row" size={15} />
          <FlexBox column={true} width="fit-content">
            <CustomH2Light>{userData.info.name}</CustomH2Light>
            <Margin direction="column" size={13} />
            {isCurrentUserFollowed ? (
              <Style.ProfileEditButton
                onClick={() => {
                  let wantToUnFollow = confirm("팔로우를 취소하시겠습니까?")
                  if (wantToUnFollow) handleUnFollow()
                }}
              >
                팔로잉중
              </Style.ProfileEditButton>
            ) : (
              <Style.ProfileEditButton onClick={handleFollow}>
                팔로우
              </Style.ProfileEditButton>
            )}
          </FlexBox>
        </FlexBox>
      </Style.ProfileWrapper>
      <Margin direction="column" size={15} />
      <Style.ProfileInfoWrapper>
        <Style.SortToAll>
          <CustomH4Light>게시물</CustomH4Light>
          <CustomH4Light>
            {userData.feed ? userData.feed.length : 0}
          </CustomH4Light>
        </Style.SortToAll>
        <Style.SortToPublic>
          <CustomH4Light>팔로워</CustomH4Light>
          <CustomH4Light>
            {userData.follower ? userData.follower.length : 0}
          </CustomH4Light>
        </Style.SortToPublic>
        <Style.SortToPrivate>
          <CustomH4Light>팔로우</CustomH4Light>
          <CustomH4Light>
            {userData.follow ? userData.follow.length : 0}
          </CustomH4Light>
        </Style.SortToPrivate>
      </Style.ProfileInfoWrapper>
    </>
  )
}
