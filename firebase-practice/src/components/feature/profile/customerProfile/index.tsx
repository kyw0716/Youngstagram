import MobileHeader from "./MobileHeader"
import PCHeader from "./PCHeader"
import { Margin } from "ui"
import { UserData } from "backend/dto"
import useWindowSize from "lib/useWindowSize"
import { SetStateAction } from "react"

type Props = {
  imageDataLength: number
  userData: UserData
  setIsUserListModalOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function ProfileHeader({
  userData,
  setIsUserListModalOpen,
}: Props) {
  const windowSize = useWindowSize()
  return (
    <>
      <Margin direction="column" size={30} />
      <>
        {windowSize > 900 ? (
          <PCHeader
            userData={userData}
            setIsUserListModalOpen={setIsUserListModalOpen}
          />
        ) : (
          <MobileHeader
            userData={userData}
            setIsUserListModalOpen={setIsUserListModalOpen}
          />
        )}
        <Margin direction="column" size={10} />
      </>
    </>
  )
}
