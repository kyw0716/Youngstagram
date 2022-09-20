import { DBService } from "@FireBase"
import { darkModeState, userDataState } from "@share/recoil/recoilList"
import { UserData } from "backend/dto"
import { doc, onSnapshot } from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH6Light, FlexBox, Margin } from "ui"
import { ProfileIcon } from "icons"

type Props = {
  userId: string
}
const Style = {
  Wrapper: styled.div`
    width: 56px;
    height: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  `,
}
export default function FollowCard({ userId }: Props) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>()
  const currentUser = useRecoilValue(userDataState)
  const isDarkMode = useRecoilValue(darkModeState)
  useEffect(() => {
    onSnapshot(doc(DBService, "users", userId), (data) => {
      if (data) setUserData(data.data() as UserData)
    })
  }, [])
  return (
    <>
      {userData && (
        <Style.Wrapper
          onClick={() => {
            if (
              currentUser !== undefined &&
              currentUser.info.userId === userId
            ) {
              router.push("/loading?path=mypage")
              return
            }
            router.push(`/loading?path=profile/${userId}`)
          }}
        >
          <FlexBox width={56} height={56}>
            {userData.info.profileImage ? (
              <Image
                width={56}
                height={56}
                src={userData.info.profileImage}
                alt="profile"
                style={{ borderRadius: 56 }}
              />
            ) : (
              <ProfileIcon width={56} height={56} />
            )}
          </FlexBox>
          <Margin direction="column" size={7} />
          {userData.info.name && (
            <CustomH6Light style={{ color: isDarkMode ? "white" : "" }}>
              {userData.info.name?.length > 4
                ? `${userData.info.name.slice(0, 4)}..`
                : userData.info.name}
            </CustomH6Light>
          )}
        </Style.Wrapper>
      )}
    </>
  )
}
