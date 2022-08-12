import { authService, DBService } from "@FireBase"
import FollowListModal from "@share/Modal/follow/FollowListModal"
import { UserData, UserInfo } from "backend/dto"
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { useEffect, useState } from "react"
import styled from "styled-components"
import {
  CustomH2Light,
  CustomH3Light,
  CustomH4Light,
  FlexBox,
  Margin,
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
  }
  useEffect(() => {
    getUserDataByUid(userData.info.userId).then((data) => {
      if (data) {
        setUserDataByUserId(data as UserData)
      }
    })
  }, [])

  useEffect(() => {
    if (modalTitle === "") return
    if (modalTitle === "팔로우") setFollowData(userDataByUserId?.follow)
    if (modalTitle === "팔로워") setFollowData(userDataByUserId?.follower)
  }, [modalTitle])
  return (
    <>
      {/*TODO: 여기다 팔로워, 팔로잉 리스트 모달 추가하기 */}
      <FollowListModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={modalTitle}
        userList={followData !== undefined ? followData : []}
      />
      <Style.ProfileHeader>
        <Margin direction="row" size={80} />
        <Image
          src={
            userData.info.profileImage
              ? `${userData.info.profileImage}`
              : "/profile.svg"
          }
          width={150}
          height={150}
          style={
            userData.info.profileImage
              ? { borderRadius: 150 }
              : { borderRadius: "none" }
          }
          alt="profile"
        />
        <Margin direction="row" size={80} />
        <Style.ProfileInfo>
          <FlexBox alignItems="center">
            <CustomH2Light>{userData.info.name}</CustomH2Light>
            <Margin direction="row" size={20} />

            <Style.ProfileEditButton onClick={handleFollow}>
              {userDataByUserId?.follower.includes(
                `${authService.currentUser?.uid}`,
              )
                ? "팔로잉중"
                : "팔로우"}
            </Style.ProfileEditButton>
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
          <Image src="/all-file.svg" alt="allFile" width={15} height={15} />
        </Style.SortToAll>
      </Style.SortWrapper>
    </>
  )
}
