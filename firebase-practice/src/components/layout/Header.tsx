import { authService } from "@FireBase"
import FeedUploadModal from "@share/Modal/feed/FeedUploadModal"
import { signOut } from "firebase/auth"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"

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
    top: 55px;
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
  return (
    <>
      <FeedUploadModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <Style.Container>
        <Style.Nav>
          <Style.Logo
            onClick={() => {
              if (router.asPath !== "/auth") router.push("/")
            }}
          >
            youngstagram
          </Style.Logo>
          <FlexBox width={"fit-content"} gap={30} alignItems="center">
            <Image
              width={30}
              height={30}
              src="/home.svg"
              alt="home"
              priority
              onClick={() => {
                if (router.asPath !== "/auth") router.push("/")
              }}
              style={{ cursor: "pointer" }}
            />
            <Image
              width={30}
              height={30}
              src="/image-plus.svg"
              alt="plus"
              priority
              onClick={() => {
                if (authService.currentUser) {
                  setIsModalOpen(true)
                  return
                }
                alert("로그인 후 이용 가능합니다")
              }}
              style={{ cursor: "pointer" }}
            />
            {authService.currentUser ? (
              <Image
                src={
                  authService.currentUser.photoURL
                    ? `${authService.currentUser.photoURL}`
                    : "/profile.svg"
                }
                priority
                onClick={handleMenuOpen}
                about="profile"
                width={30}
                height={30}
                alt="profile"
                style={{ cursor: "pointer", borderRadius: "30px" }}
              />
            ) : (
              <Image
                width={30}
                height={30}
                src="/line-menu.svg"
                onClick={handleMenuOpen}
                priority
                alt="menu"
                style={{ cursor: "pointer" }}
              />
            )}
          </FlexBox>

          {isMeunOpen ? (
            <>
              <Style.DropDownMenu
                onMouseLeave={() => {
                  setIsMenuOpen(false)
                }}
              >
                <Style.ProfileButton
                  onClick={() => {
                    if (
                      authService.currentUser?.uid !== null &&
                      authService.currentUser?.uid !== undefined
                    ) {
                      router.push(`/u/${authService.currentUser?.uid}`)
                    }
                  }}
                >
                  <Image
                    width={15}
                    height={15}
                    src="/profile.svg"
                    alt="profile"
                    priority
                  />
                  프로필
                </Style.ProfileButton>
                <Style.LogoutButton
                  onClick={() => {
                    signOut(authService)
                  }}
                >
                  <Image
                    width={15}
                    height={15}
                    priority
                    src="/logout.svg"
                    alt="logout"
                  />
                  로그아웃
                </Style.LogoutButton>
              </Style.DropDownMenu>
              <Style.ChatBalloon />
            </>
          ) : (
            <></>
          )}
        </Style.Nav>
      </Style.Container>
      <Margin direction="column" size={60} />
    </>
  )
}
