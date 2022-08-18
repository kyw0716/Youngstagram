import OtherMessageWrapper from "@feature/dm/OtherMessageWrapper"

import Layout from "components/layout"
import { Message } from "backend/dto"
import { FlexBox, Margin } from "ui"
import MyMessageWrapper from "@feature/dm/MyMessageWrapper"
import styled from "styled-components"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    height: max-content;
    min-height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}
export default function Test() {
  return (
    <Layout>
      <Style.Wrapper>
        <FlexBox
          width={400}
          height={"auto"}
          column={true}
          gap={15}
          style={{ padding: 10, border: "1px solid" }}
        >
          <OtherMessageWrapper
            messageData={
              {
                userId: "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
                message:
                  "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
                messageId: "1",
                uploadTime: "1",
              } as Message
            }
          />
          <MyMessageWrapper
            messageData={
              {
                userId: "4Sa2zzH9hJfdqO3KW3ZkPBMEJck1",
                message:
                  "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
                messageId: "1",
                uploadTime: "1",
              } as Message
            }
          />
        </FlexBox>
      </Style.Wrapper>
    </Layout>
  )
}
