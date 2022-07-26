import { authService } from "@FireBase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"
import { Margin } from "ui"

const Style = {
  Container: styled.div`
    width: 100vw;
    height: 60px;
    border-bottom: 1px solid lightgrey;
    background-color: white;
    position: fixed;
    top: 0;
    z-index: 9999999;
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
  LineMenu: styled.img`
    width: 50px;
    height: 30px;
    cursor: pointer;
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
    height: 60px;
    border: 1px solid lightgrey;
    position: absolute;
    right: -28px;
    top: 60px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  MenuItem: styled.div`
    width: 148px;
    height: 58px;
    -webkit-appearance: none;
    border: none;
    color: #5f5f5f;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    &:hover {
      background-color: #dcdcdc;
      width: 150px;
      border: 1px solid #dcdcdc;
    }
    cursor: pointer;
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
  return (
    <>
      <Style.Container>
        <Style.Nav>
          <Style.Logo
            onClick={() => {
              router.push("/")
            }}
          >
            youngstagram
          </Style.Logo>
          <Style.LineMenu src="/line-menu.svg" onClick={handleMenuOpen} />
          {isMeunOpen ? (
            <Style.DropDownMenu
              onMouseLeave={() => {
                setIsMenuOpen(false)
              }}
            >
              <Style.MenuItem
                onClick={() => {
                  signOut(authService)
                  router.push("/auth")
                }}
              >
                <Style.Icon src="/logout.svg" alt="logout" />
                로그아웃
              </Style.MenuItem>
              <Style.MenuItem
                onClick={() => {
                  if (
                    authService.currentUser?.uid !== null &&
                    authService.currentUser?.uid !== undefined
                  ) {
                    router.push(`/u/${authService.currentUser?.uid}`)
                  }
                }}
              >
                <Style.Icon src="/profile.svg" alt="profile" />
                프로필 페이지
              </Style.MenuItem>
            </Style.DropDownMenu>
          ) : (
            <></>
          )}
        </Style.Nav>
      </Style.Container>
      <Margin direction="column" size={60} />
    </>
  )
}
