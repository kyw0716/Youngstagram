import { darkModeState } from "@share/recoil/recoilList"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { Margin } from "ui"
import Footer from "./Footer"
import Header from "./Header"

type Props = {
  children: React.ReactNode
  isMobileDM?: boolean
}

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: auto;
    min-height: calc(var(--vh, 1vh) * 100);
    padding-top: 60px;
    position: relative;
  `,
}

export default function Layout({ children, isMobileDM }: Props) {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <Style.Wrapper style={{ backgroundColor: isDarkMode ? "black" : "white" }}>
      <Header />
      {children}
      <Margin direction="column" size={30} />
      {isMobileDM || <Footer />}
    </Style.Wrapper>
  )
}
