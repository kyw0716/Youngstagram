import { authService } from "@FireBase"
import { SetStateAction } from "react"
import styled from "styled-components"
import { CustomH6, FlexBox, Margin } from "ui"

type Props = {
  isPC: boolean
  userName: string
  setUserName: React.Dispatch<SetStateAction<string>>
}

const Input = styled.input`
  width: ${(props) => (props.about === "true" ? "350px" : "100%")};
  height: ${(props) => (props.about === "true" ? "50px" : "30px")};
  border: 1.5px solid #bdbdbd;
  border-radius: ${(props) => (props.about === "true" ? "10px" : "5px")};
  padding-left: 1vw;
  margin-bottom: ${(props) => (props.about === "true" ? "30px" : "5px")};
  font-size: 16px;
`

export default function NameInput({ isPC, userName, setUserName }: Props) {
  return (
    <FlexBox column={true}>
      <label>
        <CustomH6>이름 변경:</CustomH6>
      </label>
      <Margin direction="column" size={isPC ? 10 : 5} />
      <Input
        about={`${isPC}`}
        id="PROFILE-NAME-INPUT"
        placeholder={`${authService.currentUser?.displayName}`}
        onChange={(event) => {
          setUserName(event.target.value)
        }}
        value={userName}
      />
    </FlexBox>
  )
}
