import MobileHeader from "./MobileHeader"
import PCHeader from "./PCHeader"
import { SetStateAction, useEffect, useState } from "react"
import { Margin } from "ui"

type Props = {
  imageDataLength: number
}

export default function ProfileHeader({ imageDataLength }: Props) {
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
          <PCHeader imageDataLength={imageDataLength} />
        ) : (
          <MobileHeader imageDataLength={imageDataLength} />
        )}
        <Margin direction="column" size={44} />
      </>
    </>
  )
}
