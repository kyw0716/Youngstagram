import { authService, DBService } from "@FireBase"
import FeedGrid from "@share/Feed/FeedGrid"
import { FeedData, UserData } from "backend/dto"
import Layout from "components/layout"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import styled from "styled-components"

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  `,
}

export default function Test() {
  const [feedData, setFeedData] = useState<FeedData[]>([])
  useEffect(() => {
    if (authService.currentUser)
      onSnapshot(
        doc(DBService, "users", `${authService.currentUser.uid}`),
        (data) => {
          if (data) {
            setFeedData((data.data() as UserData).feed)
          }
        },
      )
  }, [])

  return (
    <Layout>
      <Style.Wrapper>
        <FeedGrid feedDatas={feedData} />
      </Style.Wrapper>
    </Layout>
  )
}
