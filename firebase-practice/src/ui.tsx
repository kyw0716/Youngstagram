import { SetStateAction, useState } from "react"
import styled from "styled-components"

type FlexBoxProperty = {
  justifyContents?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
  alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline"
  gap?: number
  column?: boolean
  wrap?: boolean
  width?: number | string
  height?: number | string
  minHeight?: string
  maxHeight?: string
}

export const FlexBox = styled.div<FlexBoxProperty>`
  width: ${({ width }) =>
    width ? (typeof width === "string" ? width : `${width}px`) : `100%`};
  height: ${({ height }) =>
    height ? (typeof height === "string" ? height : `${height}px`) : `auto`};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : 0)};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : "none")};
  display: flex;
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  gap: ${({ gap }) => (gap ? gap : 0)}px;
  justify-content: ${({ justifyContents }) =>
    justifyContents ? justifyContents : "flex-start"};
  align-items: ${({ alignItems }) => (alignItems ? alignItems : "stretch")};
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
`

type StyleMargin = {
  size: number
  direction: "row" | "column"
}

export const Margin = styled.div<StyleMargin>`
  height: ${({ direction, size }) => (direction === "column" ? size : 0)}px;
  width: ${({ direction, size }) => (direction === "column" ? 0 : size)}px;
`

const TextStyle = {
  CustomH1: styled.h1`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH2: styled.h2`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH3: styled.h3`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH4: styled.h4`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH5: styled.h5`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH6: styled.h6`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
}
export const CustomH1 = TextStyle.CustomH1
export const CustomH2 = TextStyle.CustomH2
export const CustomH3 = TextStyle.CustomH3
export const CustomH4 = TextStyle.CustomH4
export const CustomH5 = TextStyle.CustomH5
export const CustomH6 = TextStyle.CustomH6

export function Heart() {
  const [isHover, setIsHover] = useState<boolean>(false)
  return (
    <svg
      aria-label="좋아요"
      color={isHover ? "#b4b4b4" : "#262626"}
      fill={isHover ? "#b4b4b4" : "#262626"}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={() => {
        alert("아직 좋아요 기능은 개발 중이예요!")
      }}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
    >
      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
    </svg>
  )
}

type CommentProps = {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

export function Comment({ setIsOpen }: CommentProps) {
  const [isHover, setIsHover] = useState<boolean>(false)
  return (
    <svg
      aria-label="댓글 달기"
      color={isHover ? "#b4b4b4" : "#262626"}
      fill={isHover ? "#b4b4b4" : "#262626"}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={() => {
        setIsOpen(true)
      }}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
    >
      <path
        d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
    </svg>
  )
}
export function Share() {
  const [isHover, setIsHover] = useState<boolean>(false)

  return (
    <svg
      aria-label="게시물 공유"
      color={isHover ? "#b4b4b4" : "#262626"}
      fill={isHover ? "#b4b4b4" : "#262626"}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={() => {
        alert("아직 공유 기능은 개발 중이예요!")
      }}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
    >
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  )
}

export function FullHeart() {
  return (
    <svg
      aria-label="좋아요 취소"
      color="#ed4956"
      fill="#ed4956"
      height="24"
      role="img"
      viewBox="0 0 48 48"
      width="24"
    >
      <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
    </svg>
  )
}
