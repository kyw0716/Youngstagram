import { DBService, storageService } from "@FireBase"
import {
  darkModeState,
  feedDataState,
  userDataState,
} from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import {
  DeleteIcon,
  DotMenuIcon,
  EditIcon,
  LockIcon,
  LogoutIcon,
  UnLockIcon,
} from "icons"
import { SetStateAction, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"

type Props = {
  feedData: FeedData
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
  const setCurrentUserData = useSetRecoilState(userDataState)
  const isDarkMode = useRecoilValue(darkModeState)

  const handleThreeDotMenuClick = () => {
    setIsMenuOpen((current) => !current)
  }

  const handleDeleteFeed = async () => {
    const feed: FeedData = {
      creator: feedData.creator,
      desc: feedData.desc,
      imageUrl: feedData.imageUrl,
      location: feedData.location,
      private: feedData.private,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
    }
    const storageImageRef = ref(
      storageService,
      `images/${feedData.creator}/${feedData.storageId}`,
    )
    const firestoreAllRef = doc(DBService, "mainPage", "userFeedDataAll")
    const firestoreCommentRef = doc(DBService, "Comments", feedData.storageId)
    const firestorePersonalRef = doc(DBService, `users`, `${feedData.creator}`)
    const firestoreLikeRef = doc(DBService, "like", feedData.storageId)

    handleThreeDotMenuClick()

    await updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feed),
    }).catch((error) => console.log(error.code))
    await updateDoc(firestoreAllRef, {
      feed: arrayRemove(feed),
    }).catch((error) => console.log(error.code))

    await deleteObject(storageImageRef).catch((error) =>
      console.log(error.code),
    )
    await deleteDoc(firestoreCommentRef).catch((error) =>
      console.log(error.code),
    )
    await deleteDoc(firestoreLikeRef).catch((error) => console.log(error.code))
  }
  const handlePrivateToggle = async () => {
    const firestoreImageAllRef = doc(DBService, "mainPage", "userFeedDataAll")
    const firestorePersonalRef = doc(DBService, `users`, `${feedData.creator}`)
    const feed: FeedData = {
      creator: feedData.creator,
      desc: feedData.desc,
      imageUrl: feedData.imageUrl,
      location: feedData.location,
      private: feedData.private,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
    }
    const toggleFeed: FeedData = {
      creator: feedData.creator,
      desc: feedData.desc,
      imageUrl: feedData.imageUrl,
      location: feedData.location,
      private: !feedData.private,
      storageId: feedData.storageId,
      uploadTime: feedData.uploadTime,
    }

    handleThreeDotMenuClick()
    await updateDoc(firestorePersonalRef, {
      feed: arrayRemove(feed),
    }).then(async () => {
      await updateDoc(firestorePersonalRef, {
        feed: arrayUnion(toggleFeed),
      })
    })
    await updateDoc(firestoreImageAllRef, {
      feed: arrayRemove(feed),
    }).then(async () => {
      await updateDoc(firestoreImageAllRef, {
        feed: arrayUnion(toggleFeed),
      })
    })
  }

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
              onClick={handlePrivateToggle}
              style={
                isDarkMode ? { backgroundColor: "black", color: "white" } : {}
              }
            >
              {feedData.private ? (
                <UnLockIcon width={15} height={15} />
              ) : (
                <LockIcon width={15} height={15} />
              )}

              {feedData.private ? "공개" : "비공개"}
            </Style.PrivateToggleButton>
            <Style.Deletebutton
              onClick={handleDeleteFeed}
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
