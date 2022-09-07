import { DBService } from "@FireBase"
import FollowListModal from "@share/Modal/follow/FollowListModal"
import { userDataState } from "@share/recoil/recoilList"
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
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import {
  CustomH2Light,
  CustomH3Light,
  CustomH4Light,
  FlexBox,
  Margin,
  ProfileIcon,
} from "ui"

type Props = {
  userData: UserData
}

const Style = {
  ProfileHeader: styled.div`
    width: 975px;
    height: 194px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    align-items: center;
    padding-bottom: 44px;
    padding-top: 10px;
  `,
  ProfileInfo: styled.div`
    width: fit-content;
    height: 150px;
    display: flex;
    flex-direction: column;
    padding-top: 15px;
  `,
  ProfileEditButton: styled.div`
    width: 107px;
    height: 30px;
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
  SortWrapper: styled.div`
    width: 600px;
    display: flex;
    height: 60px;
    justify-content: center;
  `,
  SortToAll: styled.div`
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-top: 3px solid grey;
    cursor: pointer;
  `,
}

export default function PCHeader({ userData }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [userDataByUserId, setUserDataByUserId] = useState<UserData>()
  const [followData, setFollowData] = useState<string[]>()
  const [isCurrentUserFollowed, setIsCurrentUserFollowed] =
    useState<boolean>(false)
  const [isFollowingDataModified, setIsFollowingDataModified] =
    useState<boolean>(false)
  const currentUserData = useRecoilValue(userDataState)

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
    getUserDataByUid(userData.info.userId).then((data) => {
      if (data) {
        setUserDataByUserId(data as UserData)
      }
    })
    setIsOpen(false)
  }, [isFollowingDataModified, userData])
  useEffect(() => {
    if (userDataByUserId === undefined) return
    if (userDataByUserId.follower === undefined) return
    setIsCurrentUserFollowed(
      userDataByUserId?.follower.includes(currentUserData.info.userId),
    )
  }, [userDataByUserId])
  useEffect(() => {
    if (modalTitle === "") return
    if (modalTitle === "팔로우") setFollowData(userDataByUserId?.follow)
    if (modalTitle === "팔로워") setFollowData(userDataByUserId?.follower)
    setIsFollowingDataModified(false)
  }, [modalTitle, userDataByUserId])
  return (
    <>
      <FollowListModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={modalTitle}
        userList={followData !== undefined ? followData : []}
        isPC={true}
      />
      <Style.ProfileHeader>
        <Margin direction="row" size={80} />
        {userData.info.profileImage ? (
          <Image
            src={userData.info.profileImage}
            width={150}
            height={150}
            style={{ borderRadius: 150 }}
            alt="profile"
          />
        ) : (
          <ProfileIcon width={150} height={150} />
        )}

        <Margin direction="row" size={80} />
        <Style.ProfileInfo>
          <FlexBox alignItems="center">
            <CustomH2Light>{userData.info.name}</CustomH2Light>
            <Margin direction="row" size={20} />

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
          <Margin direction="column" size={15} />
          <FlexBox>
            <CustomH3Light>이메일: {userData.info.email}</CustomH3Light>
          </FlexBox>
          <Margin direction="column" size={15} />
          <FlexBox gap={40}>
            <CustomH3Light>
              게시물: {userData.feed ? userData.feed.length : 0}
            </CustomH3Light>
            <CustomH3Light
              onClick={() => {
                setModalTitle("팔로워")
                setIsOpen(true)
              }}
              style={{ cursor: "pointer" }}
            >
              팔로워: {userData.follower ? userData.follower.length : 0}
            </CustomH3Light>
            <CustomH3Light
              onClick={() => {
                setModalTitle("팔로우")
                setIsOpen(true)
              }}
              style={{ cursor: "pointer" }}
            >
              팔로우: {userData.follow ? userData.follow.length : 0}
            </CustomH3Light>
          </FlexBox>
        </Style.ProfileInfo>
      </Style.ProfileHeader>
      <Style.SortWrapper>
        <Style.SortToAll>
          <CustomH4Light>게시물</CustomH4Light>
          <Image src="/all-file.webp" alt="allFile" width={15} height={15} />
        </Style.SortToAll>
      </Style.SortWrapper>
    </>
  )
}
