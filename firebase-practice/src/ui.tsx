import { authService, DBService } from "@FireBase"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useRecoilValue } from "recoil"
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
  CustomH1Light: styled.h1`
    font-weight: 300;
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH2Light: styled.h2`
    font-weight: 300;
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH3Light: styled.h3`
    font-weight: 300;
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH4Light: styled.h4`
    font-weight: 300;
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH5Light: styled.h5`
    font-weight: 300;
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH6Light: styled.h6`
    font-weight: 300;
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
export const CustomH1Light = TextStyle.CustomH1Light
export const CustomH2Light = TextStyle.CustomH2Light
export const CustomH3Light = TextStyle.CustomH3Light
export const CustomH4Light = TextStyle.CustomH4Light
export const CustomH5Light = TextStyle.CustomH5Light
export const CustomH6Light = TextStyle.CustomH6Light

type HeartProps = { storgateId: string }

export function HeartIcon({ storgateId }: HeartProps) {
  const handleLike = async () => {
    const likeRef = doc(DBService, "like", storgateId)
    await updateDoc(likeRef, {
      likerList: arrayUnion(authService.currentUser?.uid),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        await setDoc(likeRef, {
          likerList: [authService.currentUser?.uid],
        })
      }
    })
  }
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <svg
      aria-label="좋아요"
      color={isDarkMode ? "white" : "#262626"}
      fill={isDarkMode ? "white" : "#262626"}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={handleLike}
    >
      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
    </svg>
  )
}

type CommentProps = {
  onClick: () => void
}

export function CommentIcon({ onClick }: CommentProps) {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <svg
      aria-label="댓글 달기"
      color={isDarkMode ? "white" : "#262626"}
      fill={isDarkMode ? "white" : "#262626"}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={onClick}
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
export function DMIcon() {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <Link href={authService.currentUser ? "/dm" : ""}>
      <svg
        aria-label="게시물 공유"
        color="#262626"
        fill={isDarkMode ? "white" : "#262626"}
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
        style={{ cursor: "pointer" }}
      >
        <line
          fill="none"
          stroke={isDarkMode ? "white" : "#262626"}
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
          stroke={isDarkMode ? "white" : "#262626"}
          strokeLinejoin="round"
          strokeWidth="2"
        ></polygon>
      </svg>
    </Link>
  )
}

export function ShareIcon() {
  const isDarkMode = useRecoilValue(darkModeState)

  return (
    <svg
      aria-label="게시물 공유"
      color={isDarkMode ? "white" : "#262626"}
      fill={isDarkMode ? "white" : "#262626"}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={() => {
        alert("아직 공유 기능은 개발 중이예요!")
      }}
    >
      <line
        fill="none"
        stroke={isDarkMode ? "white" : "#262626"}
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
        stroke={isDarkMode ? "white" : "#262626"}
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  )
}

export function HomeIcon() {
  const isDarkMode = useRecoilValue(darkModeState)
  const currentUserData = useRecoilValue(userDataState)
  return (
    <Link
      href={
        currentUserData !== undefined && currentUserData.info.userId !== ""
          ? "/"
          : ""
      }
    >
      <svg
        aria-label="홈"
        color={isDarkMode ? "white" : "#262626"}
        fill={isDarkMode ? "white" : "#262626"}
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
        style={{ cursor: "pointer" }}
      >
        <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z"></path>
      </svg>
    </Link>
  )
}

type ImageUploadIconProps = {
  onClick: () => void
}

export function ImageUploadIcon({ onClick }: ImageUploadIconProps) {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <svg
      aria-label="새로운 게시물"
      color={isDarkMode ? "white" : "#262626"}
      fill={isDarkMode ? "white" : "#262626"}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <path
        d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z"
        fill="none"
        stroke={isDarkMode ? "white" : "#262626"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <line
        fill="none"
        stroke={isDarkMode ? "white" : "#262626"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="6.545"
        x2="17.455"
        y1="12.001"
        y2="12.001"
      ></line>
      <line
        fill="none"
        stroke={isDarkMode ? "white" : "#262626"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="12.003"
        x2="12.003"
        y1="6.545"
        y2="17.455"
      ></line>
    </svg>
  )
}

export function FeedUPloadModalIcon() {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <svg
      aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
      color={isDarkMode ? "white" : "#262626"}
      fill={isDarkMode ? "white" : "#262626"}
      height="77"
      role="img"
      viewBox="0 0 97.6 77.3"
      width="96"
    >
      <path
        d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
        fill={isDarkMode ? "white" : "#262626"}
      ></path>
      <path
        d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
        fill={isDarkMode ? "white" : "#262626"}
      ></path>
      <path
        d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
        fill={isDarkMode ? "white" : "#262626"}
      ></path>
    </svg>
  )
}

export function FullHeart({ storgateId }: HeartProps) {
  const likeRef = doc(DBService, "like", storgateId)
  const handleUnLike = async () => {
    await updateDoc(likeRef, {
      likerList: arrayRemove(authService.currentUser?.uid),
    })
  }
  return (
    <svg
      aria-label="좋아요 취소"
      color="#ed4956"
      fill="#ed4956"
      height="24"
      role="img"
      viewBox="0 0 48 48"
      width="24"
      style={{ cursor: "pointer" }}
      onClick={handleUnLike}
    >
      <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
    </svg>
  )
}

export function LoadingPage() {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        margin: "auto",
        backgroundColor: isDarkMode ? "black" : "#ffffff",
        display: "block",
        zIndex: 1,
        position: "relative",
      }}
      width="100vw"
      height="100vh"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="translate(547.5,357) scale(1,1) translate(-547.5,-357)">
        <g transform="translate(-100 659.9801872535908) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 659.9801872535908;1095 659.9801872535908"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-62.81185999092998s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 575.390756606118) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 575.390756606118;1095 575.390756606118"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-23.773180764838475s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 106.17605238154836) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 106.17605238154836;1095 106.17605238154836"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-42.23064107555256s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 323.4273631031813) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 323.4273631031813;1095 323.4273631031813"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-48.817594274300625s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 66.5884903661593) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 66.5884903661593;1095 66.5884903661593"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-15.733191024547615s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 611.4006320774364) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 611.4006320774364;1095 611.4006320774364"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-52.73719319780785s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 389.9230521093547) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 389.9230521093547;1095 389.9230521093547"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-25.73060732036449s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 394.19129738765776) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 394.19129738765776;1095 394.19129738765776"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-30.661534283161437s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 466.4106258984397) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 466.4106258984397;1095 466.4106258984397"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-12.975469725605512s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 122.16441151547518) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 122.16441151547518;1095 122.16441151547518"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-64.90144000971904s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 281.6884933929912) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 281.6884933929912;1095 281.6884933929912"
            dur="66.66666666666667s"
            repeatCount="indefinite"
            begin="-22.33870066647441s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(0.55)"
          ></path>
        </g>
        <g transform="translate(-100 193.50555915036264) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 193.50555915036264;1095 193.50555915036264"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-35.17445532733819s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 708.1532504883257) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 708.1532504883257;1095 708.1532504883257"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-62.45593365711816s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 264.19695175600054) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 264.19695175600054;1095 264.19695175600054"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-25.01277756953219s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 92.74415048812332) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 92.74415048812332;1095 92.74415048812332"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-3.2256332057498676s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 485.0856178877921) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 485.0856178877921;1095 485.0856178877921"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-46.15927851752712s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 303.8336084007419) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 303.8336084007419;1095 303.8336084007419"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-41.49275548803246s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 657.2150378860931) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 657.2150378860931;1095 657.2150378860931"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-4.220255554551308s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 303.0620764731378) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 303.0620764731378;1095 303.0620764731378"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-28.96973771729224s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 170.8728527120851) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 170.8728527120851;1095 170.8728527120851"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-25.261969673341394s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 360.0776536497376) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 360.0776536497376;1095 360.0776536497376"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-13.0986730232087s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 250.06482790723075) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 250.06482790723075;1095 250.06482790723075"
            dur="33.333333333333336s"
            repeatCount="indefinite"
            begin="-6.409690029880426s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#ffffff"
            transform="scale(0.7)"
          ></path>
        </g>
        <g transform="translate(-100 630.4070360468163) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 630.4070360468163;1095 630.4070360468163"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-23.48855369978796s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 49.660357462854236) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 49.660357462854236;1095 49.660357462854236"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-60.347378862213134s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 326.55897230105984) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 326.55897230105984;1095 326.55897230105984"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-9.28960151142427s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 667.9762742994194) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 667.9762742994194;1095 667.9762742994194"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-12.257993724605972s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 427.9615925302021) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 427.9615925302021;1095 427.9615925302021"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-33.248334119317036s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 479.3593973130984) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 479.3593973130984;1095 479.3593973130984"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-65.15952572178236s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 307.8969495252537) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 307.8969495252537;1095 307.8969495252537"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-10.325127698717623s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 413.3688816156617) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 413.3688816156617;1095 413.3688816156617"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-33.55511476696154s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 643.0180050754465) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 643.0180050754465;1095 643.0180050754465"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-48.358490994023626s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 344.0172344161933) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 344.0172344161933;1095 344.0172344161933"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-59.755564529777466s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 76.8706892440025) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 76.8706892440025;1095 76.8706892440025"
            dur="22.222222222222225s"
            repeatCount="indefinite"
            begin="-22.50514060758686s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#eaeaea"
            transform="scale(0.85)"
          ></path>
        </g>
        <g transform="translate(-100 112.53954124931448) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 112.53954124931448;1095 112.53954124931448"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-47.41499127211106s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 625.6296726680596) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 625.6296726680596;1095 625.6296726680596"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-46.071548076993324s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 290.95683360799114) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 290.95683360799114;1095 290.95683360799114"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-16.944779736471624s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 418.7200592567695) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 418.7200592567695;1095 418.7200592567695"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-43.755262369108344s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 655.7753728390195) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 655.7753728390195;1095 655.7753728390195"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-0.12304595146182726s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 191.42799809377564) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 191.42799809377564;1095 191.42799809377564"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-63.83945715174877s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 38.6111218925904) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 38.6111218925904;1095 38.6111218925904"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-15.031993298200893s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 659.2775637803363) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 659.2775637803363;1095 659.2775637803363"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-23.327004587441134s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 156.17553648738505) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 156.17553648738505;1095 156.17553648738505"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-24.764483178339898s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 598.0604947376211) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 598.0604947376211;1095 598.0604947376211"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-46.33773489904122s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 241.76519833061332) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 241.76519833061332;1095 241.76519833061332"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-38.75862427824683s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
        <g transform="translate(-100 261.21058282553633) rotate(0)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 261.21058282553633;1095 261.21058282553633"
            dur="16.666666666666668s"
            repeatCount="indefinite"
            begin="-34.92886319221906s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#e8f9ff"
            transform="scale(1)"
          ></path>
        </g>
      </g>
    </svg>
  )
}
