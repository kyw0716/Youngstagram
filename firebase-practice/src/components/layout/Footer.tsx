import styled from "styled-components"
import { CustomH4 } from "ui"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
  `,
}

export default function Footer() {
  return (
    <Style.Wrapper>
      <CustomH4>&copy; 2022. Young Woo Kim. all rights reserved.</CustomH4>
    </Style.Wrapper>
  )
}
