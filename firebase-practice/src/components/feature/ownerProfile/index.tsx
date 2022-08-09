import { SetStateAction, useEffect, useState } from "react"
import { Margin } from "ui"
import MobileHeader from "./MobileHeader"
import PCHeader from "./PCHeader"

type Props = {
  imageDataLength: number
  privateImageDataLength: number
  setPickImageData: React.Dispatch<SetStateAction<"all" | "public" | "private">>
  pickImageData: "all" | "public" | "private"
}

export default function ProfileHeader({
  imageDataLength,
  privateImageDataLength,
  setPickImageData,
  pickImageData,
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
          />
        ) : (
          <MobileHeader
            imageDataLength={imageDataLength}
            privateImageDataLength={privateImageDataLength}
            setPickImageData={setPickImageData}
            pickImageData={pickImageData}
          />
        )}
        <Margin direction="column" size={44} />
      </>
    </>
  )
}
