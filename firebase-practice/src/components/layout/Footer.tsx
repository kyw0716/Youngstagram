import { darkModeState } from "@share/recoil/recoilList"
import { useRecoilValue } from "recoil"
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
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <Style.Wrapper style={{ backgroundColor: isDarkMode ? "black" : "" }}>
      <CustomH4>&copy; 2022. Young Woo Kim. all rights reserved.</CustomH4>
    </Style.Wrapper>
  )
}
