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
    min-height: 100vh;
    min-height: -webkit-fill-available;
    padding-top: 60px;
    position: relative;
  `,
}

export default function Layout({ children, isMobileDM }: Props) {
  return (
    <Style.Wrapper>
      <Header />
      {children}
      <Margin direction="column" size={30} />
      {isMobileDM || <Footer />}
    </Style.Wrapper>
  )
}
