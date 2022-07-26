import { authService } from "@FireBase"
import Header from "components/layout/Header"
import styled from "styled-components"
import { Margin } from "ui"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: fit-content;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    display: flex;
    flex-direction: column;
  `,
  ProfileHeader: styled.div`
    width: 975px;
    height: 150px;
    border: 1px solid;
    display: flex;
    align-items: center;
  `,
  ProfileImage: styled.div`
    width: 150px;
    height: 150px;
    border-radius: 200px;
    border: 1px solid;
  `,
  ProfileInfo: styled.div`
    width: 600px;
    height: 150px;
    border: 1px solid;
    display: flex;
    flex-direction: column;
  `,
  CustomH1: styled.h1`
    margin: 0;
    padding: 0;
  `,
  CustomH2: styled.h2`
    margin: 0;
    padding: 0;
  `,
  CustomH3: styled.h3`
    margin: 0;
    padding: 0;
  `,
  CustomH4: styled.h4`
    margin: 0;
    padding: 0;
  `,
  CustomH5: styled.h5`
    margin: 0;
    padding: 0;
  `,
}

export default function test() {
  console.log(authService.currentUser?.displayName)
  return (
    <>
      <Header />
      <Margin direction="column" size={30} />
      <Style.Wrapper>
        <Style.ProfileHeader>
          <Margin direction="row" size={80} />
          <Style.ProfileImage />
          <Margin direction="row" size={80} />
          <Style.ProfileInfo>
            <Style.CustomH2>
              {authService.currentUser?.displayName}
            </Style.CustomH2>
          </Style.ProfileInfo>
        </Style.ProfileHeader>
        <Margin direction="column" size={44} />
      </Style.Wrapper>
    </>
  )
}
