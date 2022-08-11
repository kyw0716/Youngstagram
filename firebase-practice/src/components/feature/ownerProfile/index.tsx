import { SetStateAction, useEffect, useState } from "react"
import { Margin } from "ui"
import MobileHeader from "./MobileHeader"
import PCHeader from "./PCHeader"

type Props = {
  imageDataLength: number
  privateImageDataLength: number
  setPickImageData: React.Dispatch<SetStateAction<"all" | "public" | "private">>
  pickImageData: "all" | "public" | "private"
  isOwner: boolean
}

export default function ProfileHeader({
  imageDataLength,
  privateImageDataLength,
  setPickImageData,
  pickImageData,
  isOwner,
}: Props) {
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
          <PCHeader
            imageDataLength={imageDataLength}
            setPickImageData={setPickImageData}
            pickImageData={pickImageData}
            privateImageDataLength={privateImageDataLength}
            isOwner={isOwner}
          />
        ) : (
          <MobileHeader
            imageDataLength={imageDataLength}
            privateImageDataLength={privateImageDataLength}
            setPickImageData={setPickImageData}
            pickImageData={pickImageData}
            isOwner={isOwner}
          />
        )}
        <Margin direction="column" size={44} />
      </>
    </>
  )
}
