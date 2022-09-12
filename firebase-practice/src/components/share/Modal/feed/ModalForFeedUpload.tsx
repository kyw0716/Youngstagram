import { LeftArrowIcon, XIcon } from "icons"
import Image from "next/image"
import React, { ReactNode, SetStateAction } from "react"
import ReactModal from "react-modal"
import styled from "styled-components"
import { CustomH4 } from "ui"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  title: string
  width: string
  height: string
  children: ReactNode
  isPC?: boolean
  isFileExist: boolean
  setIsFileExist: React.Dispatch<SetStateAction<boolean>>
  isModifyMode: boolean
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
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
    position: relative;
  `,
  Title: styled.div`
    width: fit-content;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `,
}

export default function ModalForImageUpload({
  isOpen,
  setIsOpen,
  title,
  width,
  height,
  children,
  isPC,
  isFileExist,
  isModifyMode,
  setIsFileExist,
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
          maxWidth: isFileExist ? 835 : 495,
          height,
          border: "solid 1px #d3d3d3",
          borderRadius: "10px",
          boxShadow: "3px 3px 20px 0 rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          backgroundColor: "white",
        },
      }}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      ariaHideApp={false}
    >
      <Style.Wrapper>
        {isFileExist ? (
          <>
            <Style.Header>
              <XIcon
                width={15}
                height={15}
                onClick={() => {
                  setIsOpen(false)
                  setIsFileExist(false)
                }}
              />
              <Style.Title>
                <CustomH4>{title}</CustomH4>
              </Style.Title>
              {isModifyMode || (
                <LeftArrowIcon
                  width={15}
                  height={15}
                  onClick={() => {
                    setIsFileExist(false)
                  }}
                />
              )}
            </Style.Header>
          </>
        ) : (
          <Style.Header>
            <Style.Title>
              <CustomH4>{title}</CustomH4>
            </Style.Title>
            <XIcon
              width={15}
              height={15}
              onClick={() => {
                setIsOpen(false)
                setIsFileExist(false)
              }}
            />
          </Style.Header>
        )}

        {children}
      </Style.Wrapper>
    </ReactModal>
  )
}
