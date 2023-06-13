import { darkModeState } from "@share/recoil/recoilList"
import { XIcon } from "icons"
import useWindowSize from "lib/hooks/useWindowSize"
import React, { ReactNode, SetStateAction } from "react"
import ReactModal from "react-modal"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH4, FlexBox } from "ui"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  title: string
  width: string
  height: string
  children: ReactNode
}

const Style = {
  Wrapper: styled.div`
    width: 100%;
    height: 100%;
  `,
  Header: styled.div`
    width: 100%;
    height: 40px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 15px;
    position: relative;
  `,
}

export default function YoungstagramModal({
  isOpen,
  setIsOpen,
  title,
  width,
  height,
  children,
}: Props) {
  const windowSize = useWindowSize()
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <ReactModal
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: "9999999",
        },
        content: {
          top: "50%",
          left: windowSize > 900 ? "50%" : "2.5vw",
          transform:
            windowSize > 900 ? "translate(-50%,-50%)" : "translateY(-50%)",
          padding: 0,
          width,
          height,
          border: "solid 1px #d3d3d3",
          borderRadius: "10px",
          boxShadow: "3px 3px 20px 0 rgba(0, 0, 0, 0.25)",
          overflow: "clip",
          backgroundColor: isDarkMode ? "black" : "white",
          position: "relative",
        },
      }}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      ariaHideApp={false}
    >
      <Style.Header
        style={{ borderBottom: isDarkMode ? "1px solid lightgrey" : "" }}
      >
        <CustomH4 style={{ color: isDarkMode ? "white" : "" }}>
          {title}
        </CustomH4>
        <FlexBox
          width={15}
          height={15}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "50%",
            right: "15px",
            transform: "translateY(-50%)",
          }}
        >
          <XIcon
            width={15}
            height={15}
            onClick={() => {
              setIsOpen(false)
            }}
          />
        </FlexBox>
      </Style.Header>
      <Style.Wrapper>{children}</Style.Wrapper>
    </ReactModal>
  )
}
