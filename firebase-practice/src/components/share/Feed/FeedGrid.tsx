import { FeedData } from "backend/dto"
import styled from "styled-components"
import FeedGridCard from "./FeedGridCard"
import { v4 } from "uuid"
import { useEffect, useState } from "react"

type Props = {
  feedDatas: FeedData[]
}

const Style = {
  Wrapper: styled.div`
    height: fit-content;
    display: grid;
    row-gap: 10px;
    column-gap: 10px;
    grid-template-columns: repeat(3, minmax(100px, auto));
    grid-template-rows: repeat(autofill, minmax(100px, auto));
    grid-auto-flow: row;
  `,
}

export default function FeedGrid({ feedDatas }: Props) {
  const [windowSize, setWindowSize] = useState<number>(0)
  useEffect(() => {
    setWindowSize(window.innerWidth)
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth)
    })
  }, [])
  return (
    <Style.Wrapper
      style={{
        width: windowSize < 900 ? "100vw" : "50vw",
        gap: windowSize < 900 ? "3px" : "10px",
      }}
    >
      {feedDatas !== undefined && (
        <>
          {feedDatas.map((feedData) => {
            return (
              <FeedGridCard
                feedData={feedData}
                key={v4()}
                windowSize={windowSize}
              />
            )
          })}
        </>
      )}
    </Style.Wrapper>
  )
}
