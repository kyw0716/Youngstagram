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
  `,
}

export default function Header() {
  return (
    <>
      <Style.Container>
        <Style.Nav>
          <h3>youngstagram</h3>
          <span>메뉴들</span>
        </Style.Nav>
      </Style.Container>
      <Margin direction="column" size={60} />
    </>
  )
}
