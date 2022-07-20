import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"
import { DBService } from "../../FireBase"

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
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const handleNameOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setName(event.target.value)
  }
  const uploadUserNameToFirestore = async (name: string) => {
    const userDataRef = doc(DBService, "userData", `${router.asPath.slice(3)}`)
    await setDoc(userDataRef, {
      name: name,
    })
  }

  const handleUserDataSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    uploadUserNameToFirestore(name)
    setName("")
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
