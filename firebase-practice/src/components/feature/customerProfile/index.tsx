import MobileHeader from "./MobileHeader"
import PCHeader from "./PCHeader"
import { useEffect, useState } from "react"
import { Margin } from "ui"
import { UserData } from "backend/dto"

type Props = {
  imageDataLength: number
  userData: UserData
}

export default function ProfileHeader({ userData }: Props) {
  const [windowSize, setWindowSize] = useState<number>(0)
  useEffect(() => {
    setWindowSize(window.innerWidth)
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth)
    })
  }, [])
  return (
    <>
      <Margin direction="column" size={30} />
      <>
        {windowSize > 900 ? (
          <PCHeader userData={userData} />
        ) : (
          <MobileHeader userData={userData} />
        )}
        <Margin direction="column" size={44} />
      </>
    </>
  )
}
