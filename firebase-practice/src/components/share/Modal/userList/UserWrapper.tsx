import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { UserData, UserInfo } from "backend/dto"
import { ProfileIcon } from "icons"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { CustomH5Light, FlexBox } from "ui"

type Props = {
  userId: string
}

export default function FollowUserWrapper({ userId }: Props) {
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const currentUserData = useRecoilValue(userDataState)
  const router = useRouter()
  const [routingPath, setRoutingPath] = useState<string>("")
  const isDarkMode = useRecoilValue(darkModeState)

  useEffect(() => {
    getUserDataByUid(userId).then((data) => {
      if (data) {
        setUserInfo((data as UserData).info as UserInfo)
      }
    })
  }, [])
  useEffect(() => {
    if (routingPath !== "") router.replace(routingPath)
  }, [routingPath])
  return (
    <>
      {userInfo && (
        <FlexBox
          width={400}
          gap={10}
          onClick={() => {
            if (
              currentUserData !== undefined &&
              currentUserData.info.userId === userId
            ) {
              setRoutingPath(`/mypage`)
              return
            }
            setRoutingPath(`/profile/${userId}`)
          }}
          style={{ cursor: "pointer", flexShrink: 0 }}
        >
          {userInfo.profileImage ? (
            <Image
              width={44}
              height={44}
              src={userInfo.profileImage}
              alt="profile"
              style={{ borderRadius: 44, cursor: "pointer" }}
            />
          ) : (
            <ProfileIcon width={44} height={44} />
          )}
          <FlexBox
            column={true}
            width={"fit-content"}
            alignItems="flex-start"
            justifyContents="center"
            height={44}
          >
            <CustomH5Light
              style={{ fontSize: 18, color: isDarkMode ? "white" : "" }}
            >
              {userInfo.name}
            </CustomH5Light>
            <CustomH5Light
              style={{ fontSize: 12, color: isDarkMode ? "white" : "" }}
            >
              {userInfo.email}
            </CustomH5Light>
          </FlexBox>
        </FlexBox>
      )}
    </>
  )
}
