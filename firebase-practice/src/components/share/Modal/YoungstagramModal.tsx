import Image from "next/image"
import React, { ReactNode, SetStateAction } from "react"
import ReactModal from "react-modal"
import styled from "styled-components"
import { CustomH4, FlexBox } from "ui"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  title: string
  width: string
  height: string
  children: ReactNode
  isPC?: boolean
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
  isPC,
}: Props) {
  return (
    <ReactModal
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: "9999999",
        },
        content: {
          top: isPC ? "50%" : "100px",
          left: isPC ? "50%" : "2.5vw",
          transform: isPC ? "translate(-50%,-50%)" : "",
          padding: 0,
          width,
          height,
          border: "solid 1px #d3d3d3",
          borderRadius: "10px",
          boxShadow: "3px 3px 20px 0 rgba(0, 0, 0, 0.25)",
          overflow: "clip",
          backgroundColor: "white",
          position: "relative",
        },
      }}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      ariaHideApp={false}
    >
      <Style.Header>
        <CustomH4>{title}</CustomH4>
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
          <Image
            src="/x.webp"
            alt="x"
            onClick={() => {
              setIsOpen(false)
            }}
            width={15}
            height={15}
          />
        </FlexBox>
      </Style.Header>
      <Style.Wrapper>{children}</Style.Wrapper>
    </ReactModal>
  )
}
