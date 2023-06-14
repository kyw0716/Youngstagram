import { darkModeState, feedDataState } from "@share/recoil/recoilList"
import { FeedItem } from "backend/dto"
import {
  DeleteIcon,
  DotMenuIcon,
  EditIcon,
  LockIcon,
  LogoutIcon,
  UnLockIcon,
} from "icons"
import { useFeedCRUD } from "lib/hooks/useFeedCRUD"
import { SetStateAction, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"

type Props = {
  feedData: FeedItem
  setIsFeedUploadModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const Style = {
  ThreeDotMenuBox: styled.div`
    width: 60px;
    height: 58px;
    display: flex;
    align-items: center;
    z-index: 10000;
  `,
  ThreeDotMenu: styled.div`
    display: flex;
    width: 100px;
    height: 58px;
    align-items: center;
    padding-right: 20px;
    justify-content: flex-end;
  `,
  ButtonBox: styled.div`
    width: 152px;
    height: 160px;
    border-bottom: none;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    position: absolute;
    top: 65px;
    right: 11px;
    box-shadow: rgba(99, 99, 99, 0.4) 0px 5px 4px 0px;
    border-radius: 9px;
    z-index: 2;
    background-color: white;
  `,
  ChatBalloon: styled.div`
    width: 30px;
    height: 30px;
    background-color: white;
    transform: rotate(45deg);
    position: absolute;
    right: 35px;
    top: 50px;
    box-shadow: rgba(99, 99, 99, 0.4) 0px 2px 8px 0px;
    z-index: 1;
  `,
  Deletebutton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    background-color: white;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
  PrivateToggleButton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    background-color: white;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
  ExitButton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    background-color: white;
    border-bottom: 1px solid lightgrey;
    border-radius: 0px 0px 9px 9px;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
  EditButton: styled.div`
    gap: 10px;
    width: 150px;
    height: 40px;
    -webkit-appearance: none;
    border: none;
    border-radius: 9px 9px 0px 0px;
    background-color: white;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
    display: flex;
    align-items: center;
    padding-left: 20px;
  `,
}

export default function ThreeDotMenu({
  feedData,
  setIsFeedUploadModalOpen,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const setSelectedFeedData = useSetRecoilState(feedDataState)
  const isDarkMode = useRecoilValue(darkModeState)

  const handleThreeDotMenuClick = () => {
    setIsMenuOpen((current) => !current)
  }

  const { handleDeleteFeed, handlePrivateToggle } = useFeedCRUD({
    handleThreeDotMenuClick,
  })

  return (
    <>
      <Style.ThreeDotMenu onClick={handleThreeDotMenuClick}>
        <DotMenuIcon width={20} height={15} />
      </Style.ThreeDotMenu>
      {isMenuOpen && (
        <>
          <Style.ButtonBox
            onMouseLeave={handleThreeDotMenuClick}
            style={isDarkMode ? { border: "1px solid lightgrey" } : {}}
          >
            <Style.EditButton
              onClick={() => {
                setSelectedFeedData(feedData)
                setIsFeedUploadModalOpen(true)
              }}
              style={
                isDarkMode ? { backgroundColor: "black", color: "white" } : {}
              }
            >
              <EditIcon width={15} height={15} />
              편집
            </Style.EditButton>
            <Style.PrivateToggleButton
              onClick={() => handlePrivateToggle(feedData)}
              style={
                isDarkMode ? { backgroundColor: "black", color: "white" } : {}
              }
            >
              {feedData.isPrivate ? (
                <UnLockIcon width={15} height={15} />
              ) : (
                <LockIcon width={15} height={15} />
              )}

              {feedData.isPrivate ? "공개" : "비공개"}
            </Style.PrivateToggleButton>
            <Style.Deletebutton
              onClick={() => handleDeleteFeed(feedData)}
              style={
                isDarkMode ? { backgroundColor: "black", color: "white" } : {}
              }
            >
              <DeleteIcon width={15} height={15} />
              삭제
            </Style.Deletebutton>
            <Style.ExitButton
              onClick={handleThreeDotMenuClick}
              style={
                isDarkMode ? { backgroundColor: "black", color: "white" } : {}
              }
            >
              <LogoutIcon width={15} height={15} />
              취소
            </Style.ExitButton>
          </Style.ButtonBox>
          <Style.ChatBalloon
            style={
              isDarkMode
                ? {
                    backgroundColor: "black",
                    color: "white",
                    borderLeft: "1px solid lightgrey",
                    borderTop: "1px solid lightgrey",
                    zIndex: 3,
                    boxShadow: "none",
                  }
                : {}
            }
          />
        </>
      )}
    </>
  )
}
