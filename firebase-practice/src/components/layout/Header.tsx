import { authService } from "@FireBase"
import FeedUploadModal from "@share/Modal/feed/FeedUploadModal"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { signOut } from "firebase/auth"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { useRecoilValue, useResetRecoilState } from "recoil"
import styled from "styled-components"
import { DMIcon, FlexBox, HomeIcon, ImageUploadIcon } from "ui"
import {
  DarkModeIcon,
  LightModeIcon,
  LineMenuIcon,
  LogoutIcon,
  ProfileIcon,
} from "icons"
import Link from "next/link"

const Style = {
  Container: styled.div`
    width: 100vw;
    height: 60px;
    border-bottom: 1px solid lightgrey;
    background-color: white;
    position: fixed;
    top: 0;
    z-index: 5;
    display: flex;
    justify-content: center;
  `,
  Nav: styled.div`
    width: 975px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    @media (max-width: 900px) {
      width: 90%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
  `,
  Logo: styled.h3`
    font-family: "Dancing Script", Handwriting;
    cursor: pointer;
    padding: 16px 0px;
    margin: 0;
    font-size: 30px;
  `,
  DropDownMenu: styled.div`
    width: 150px;
    height: 100px;
    box-shadow: rgba(99, 99, 99, 0.4) 0px 5px 4px 0px;
    position: absolute;
    right: -28px;
    top: 65px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 9px;
    z-index: 7;
  `,
  ProfileButton: styled.div`
    width: 150px;
    height: 50px;
    border: none;
    color: #5f5f5f;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 20px;
    border-radius: 9px 9px 0px 0px;
    &:hover {
      background-color: #f0f0f0;
    }
    cursor: pointer;
  `,
  LogoutButton: styled.div`
    width: 150px;
    height: 50px;
    border: none;
    color: #5f5f5f;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 20px;
    border-radius: 0px 0px 9px 9px;
    &:hover {
      background-color: #f0f0f0;
    }
    cursor: pointer;
  `,
  ChatBalloon: styled.div`
    width: 25px;
    height: 25px;
    transform: rotate(45deg);
    background-color: white;
    position: absolute;
    right: 2px;
    top: 53px;
    z-index: 6;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  `,
  Icon: styled.img`
    width: 15px;
  `,
}

export default function Header() {
  const router = useRouter()

  const [isMeunOpen, setIsMenuOpen] = useState<boolean>(false)
  const handleMenuOpen = () => {
    setIsMenuOpen((current) => !current)
  }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const userData = useRecoilValue(userDataState)
  const resetUserData = useResetRecoilState(userDataState)

  const isDarkMode = useRecoilValue(darkModeState)

  return (
    <>
      <FeedUploadModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <Style.Container
        style={{ backgroundColor: isDarkMode ? "black" : "white" }}
      >
        <Style.Nav>
          <Link
            href={
              userData !== undefined && userData.info.userId !== "" ? "/" : ""
            }
          >
            <Style.Logo style={{ color: isDarkMode ? "white" : "black" }}>
              youngstagram
            </Style.Logo>
          </Link>
          <FlexBox width={"fit-content"} gap={15} alignItems="center">
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            <HomeIcon />
            <ImageUploadIcon
              onClick={() => {
                if (userData !== undefined && userData.info.userId !== "") {
                  setIsModalOpen(true)
                  return
                }
                alert("로그인 후 이용 가능합니다")
              }}
            />
            <DMIcon />
            {authService.currentUser === null ? (
              <LineMenuIcon width={30} height={30} />
            ) : (
              <>
                {userData.info.profileImage !== "" &&
                userData.info.profileImage !== null ? (
                  <Image
                    src={userData.info.profileImage}
                    onClick={handleMenuOpen}
                    about="profile"
                    width={24}
                    height={24}
                    alt="profile"
                    style={{ cursor: "pointer", borderRadius: "30px" }}
                  />
                ) : (
                  <ProfileIcon width={24} height={24} />
                )}
              </>
            )}
          </FlexBox>
          {isMeunOpen ? (
            <>
              <Style.DropDownMenu
                onMouseLeave={() => {
                  setIsMenuOpen(false)
                }}
              >
                <Link href={"/mypage"}>
                  <Style.ProfileButton
                    style={
                      isDarkMode
                        ? {
                            backgroundColor: "black",
                            border: "1px solid lightgrey",
                            color: "white",
                          }
                        : {}
                    }
                  >
                    <ProfileIcon width={15} height={15} />
                    프로필
                  </Style.ProfileButton>
                </Link>
                <Link href={"/auth"}>
                  <Style.LogoutButton
                    onClick={() => {
                      signOut(authService)
                      resetUserData()
                    }}
                    style={
                      isDarkMode
                        ? {
                            backgroundColor: "black",
                            border: "1px solid lightgrey",
                            color: "white",
                          }
                        : {}
                    }
                  >
                    <LogoutIcon width={15} height={15} />
                    로그아웃
                  </Style.LogoutButton>
                </Link>
              </Style.DropDownMenu>
              <Style.ChatBalloon
                style={
                  isDarkMode
                    ? {
                        backgroundColor: "black",
                        borderTop: "1px solid lightgrey",
                        borderLeft: "1px solid lightgrey",
                        zIndex: 9,
                      }
                    : {}
                }
              />
            </>
          ) : (
            <></>
          )}
        </Style.Nav>
      </Style.Container>
    </>
  )
}
