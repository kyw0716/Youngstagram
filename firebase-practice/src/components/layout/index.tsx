import styled from "styled-components"
import { Margin } from "ui"
import Footer from "./Footer"
import Header from "./Header"

type Props = {
  children: React.ReactNode
}

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: 100%;
    min-height: calc(100vh + 60px);
    position: relative;
  `,
}

export default function Layout({ children }: Props) {
  return (
    <Style.Wrapper>
      <Header />
      {children}
      <Margin direction="column" size={30} />
      <Footer />
    </Style.Wrapper>
  )
}
