import Image from "next/image"
import { CustomH4, FlexBox, Margin } from "ui"

type Props = {
  profileImage: string
  name: string
  comment: string
}

export default function CommentWrapper({ profileImage, name, comment }: Props) {
  return (
    <FlexBox
      width={499}
      height={"fit-content"}
      style={{ paddingLeft: "15px", minHeight: "50px" }}
    >
      <FlexBox width={32} height={32}>
        <Image
          width={32}
          height={32}
          style={{ borderRadius: "32px" }}
          src={profileImage}
          alt="profile"
        />
      </FlexBox>
      <Margin direction="row" size={10} />
      <FlexBox column={true} width="fit-content">
        <Margin direction="column" size={5} />
        <CustomH4>{name}</CustomH4>
        {comment}
      </FlexBox>
    </FlexBox>
  )
}
