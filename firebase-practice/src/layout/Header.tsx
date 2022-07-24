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
  `,
  LineMenu: styled.img`
    width: 50px;
    height: 30px;
    cursor: pointer;
  `,
  Logo: styled.h3`
    cursor: pointer;
    padding: 16px 0px;
    margin: 0;
  `,
  DropDownMenu: styled.div`
    width: 107px;
    height: 60px;
    border: 1px solid lightgrey;
    position: absolute;
    right: -28px;
    top: 60px;
    background-color: white;
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
          {isMeunOpen ? <Style.DropDownMenu /> : <></>}
        </Style.Nav>
      </Style.Container>
      <Margin direction="column" size={60} />
    </>
  )
}
