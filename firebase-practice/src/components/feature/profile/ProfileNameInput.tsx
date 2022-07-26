import { useState } from "react"
import styled from "styled-components"
import { authService, DBService } from "@FireBase"
import { updateProfile } from "firebase/auth"

const Style = {
  NameInput: styled.input`
    width: 200px;
    height: 50px;
  `,
  NameSubmit: styled.input`
    width: 50px;
    height: 50px;
  `,
}

export default function ProfileNameInput() {
  const [name, setName] = useState<string>("")
  const handleNameOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setName(event.target.value)
  }

  const handleUserDataSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    if (authService.currentUser === null) return
    await updateProfile(authService.currentUser, {
      displayName: name,
    }).then(() => {
      setName("")
    })
  }
  return (
    <form onSubmit={handleUserDataSubmit}>
      <Style.NameInput
        type="text"
        placeholder="이름 입력시 이미지 업로드 가능"
        onChange={handleNameOnChange}
        value={name}
      />
      <Style.NameSubmit type="submit" value="send" />
    </form>
  )
}
