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
    position: relative;
  `,
}

export default function Layout({ children, isMobileDM }: Props) {
  return (
    <Style.Wrapper
      style={{ minHeight: isMobileDM ? "100vh" : "calc(100vh + 60px)" }}
    >
      <Header />
      {children}
      <Margin direction="column" size={30} />
      {isMobileDM || <Footer />}
    </Style.Wrapper>
  )
}
