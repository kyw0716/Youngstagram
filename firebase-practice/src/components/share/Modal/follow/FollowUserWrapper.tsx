import { UserData, UserInfo } from "backend/dto"
import getUserDataByUid from "lib/getUserDataByUid"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { CustomH5Light, FlexBox } from "ui"

type Props = {
  userId: string
}

export default function FollowUserWrapper({ userId }: Props) {
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const router = useRouter()
  useEffect(() => {
    getUserDataByUid(userId).then((data) => {
      if (data) {
        setUserInfo((data as UserData).info as UserInfo)
      }
    })
  }, [])
  return (
    <>
      {userInfo && (
        <FlexBox
          width={400}
          gap={10}
          onClick={() => {
            router.push(`/profile/${userId}`)
          }}
          style={{ cursor: "pointer", flexShrink: 0 }}
        >
          <Image
            width={44}
            height={44}
            src={
              userInfo.profileImage ? `${userInfo.profileImage}` : "/empty.svg"
            }
            alt="profile"
            style={{ borderRadius: 44, cursor: "pointer" }}
          />

          <FlexBox
            column={true}
            width={"fit-content"}
            alignItems="flex-start"
            justifyContents="center"
            height={44}
          >
            <CustomH5Light style={{ fontSize: 18 }}>
              {userInfo.name}
            </CustomH5Light>
            <CustomH5Light style={{ fontSize: 12 }}>
              {userInfo.email}
            </CustomH5Light>
          </FlexBox>
        </FlexBox>
      )}
    </>
  )
}
