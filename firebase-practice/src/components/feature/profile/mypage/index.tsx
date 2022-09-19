import useWindowSize from "lib/useWindowSize"
import { SetStateAction } from "react"
import { Margin } from "ui"
import MobileHeader from "./MobileHeader"
import PCHeader from "./PCHeader"

type Props = {
  setIsUserListModalOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function ProfileHeader({ setIsUserListModalOpen }: Props) {
  const windowSize = useWindowSize()
  return (
    <>
      <Margin direction="column" size={30} />
      <>
        {windowSize > 900 ? (
          <PCHeader setIsUserListModalOpen={setIsUserListModalOpen} />
        ) : (
          <MobileHeader setIsUserListModalOpen={setIsUserListModalOpen} />
        )}
        <Margin direction="column" size={44} />
      </>
    </>
  )
}
