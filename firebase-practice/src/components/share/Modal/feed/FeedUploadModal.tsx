import { SetStateAction, useState } from "react"
import ModalForImageUpload from "./ModalForFeedUpload"
import { FeedItem } from "backend/dto"
import useWindowSize from "lib/hooks/useWindowSize"
import TextInput from "./TextInput"
import ImageInput from "./ImageInput"

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  feedData?: FeedItem
}

export default function FeedUploadModal({
  setIsOpen,
  isOpen,
  feedData,
}: Props) {
  const [isFileExist, setIsFileExist] = useState<boolean>(false)
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")
  const windowSize = useWindowSize()
  const [imageFile, setImageFile] = useState<File>()

  return (
    <ModalForImageUpload
      width={
        windowSize < 900
          ? "95%"
          : isFileExist
          ? "835px"
          : feedData
          ? "835px"
          : "495px"
      }
      height={windowSize < 900 && isFileExist ? "550px" : "537px"}
      title={feedData ? "게시글 편집하기" : "새 게시물 만들기"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPC={true}
      isFileExist={feedData?.imageUrl ? true : isFileExist}
      setIsFileExist={setIsFileExist}
      isModifyMode={feedData ? true : false}
    >
      {isFileExist || feedData !== undefined ? (
        <TextInput
          feedData={feedData}
          imagePreviewSrc={imagePreviewSrc}
          setIsOpen={setIsOpen}
          imageFile={imageFile}
          setImageFile={setImageFile}
          setIsFileExist={setIsFileExist}
        />
      ) : (
        <ImageInput
          feedData={feedData}
          setIsFileExist={setIsFileExist}
          setImagePreviewSrc={setImagePreviewSrc}
          setImageFile={setImageFile}
        />
      )}
    </ModalForImageUpload>
  )
}
