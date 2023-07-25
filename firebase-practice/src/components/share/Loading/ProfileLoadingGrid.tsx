import Loading from "@share/Loading/Loading"
import Layout from "components/layout"
import styled from "styled-components"
import { FlexBox } from "ui"

const Style = {
  Wrapper: styled.div`
    width: 50vw;
    height: fit-content;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(100px, auto));
    grid-template-rows: repeat(autofill, minmax(100px, auto));
    grid-auto-flow: row;
    @media (max-width: 900px) {
      width: 100vw;
      gap: 3px;
    }
  `,
}

export default function ProfileLoadingGrid() {
  return (
    <Layout>
      <FlexBox width={"100vw"} justifyContents={"center"}>
        <Style.Wrapper>
          <Loading width={"100%"} height={""} paddingTop={"100%"} />
          <Loading width={"100%"} height={""} paddingTop={"100%"} />
          <Loading width={"100%"} height={""} paddingTop={"100%"} />
          <Loading width={"100%"} height={""} paddingTop={"100%"} />
          <Loading width={"100%"} height={""} paddingTop={"100%"} />
          <Loading width={"100%"} height={""} paddingTop={"100%"} />
        </Style.Wrapper>
      </FlexBox>
    </Layout>
  )
}
