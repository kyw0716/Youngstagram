import styled from "styled-components"
import { CustomH4, CustomH5 } from "ui"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
}

export default function Footer() {
  return (
    <Style.Wrapper>
      <CustomH4>&copy; 2022. 김영우 all rights reserved.</CustomH4>
    </Style.Wrapper>
  )
}
