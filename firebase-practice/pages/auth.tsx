import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"
import { authService, DBService } from "@FireBase"
import styled from "styled-components"
import { FlexBox, Margin } from "ui"
import { doc, setDoc } from "firebase/firestore"
import Layout from "components/layout"
import Image from "next/image"

const Style = {
  Wrapper: styled.div`
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  FormContainer: styled.form`
    width: 350px;
    height: fit-content;
    padding-bottom: 30px;
    border: 1px solid lightgrey;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  InputBox: styled.input`
    width: 268px;
    height: 36px;
    display: flex;
    align-items: center;
    -webkit-appearance: none;
    border: 1px solid lightgrey;
    padding-left: 15px;
    border-radius: 3px;
    &::placeholder {
      color: lightgrey;
    }
  `,
  SubmitButton: styled.input`
    width: 268px;
    height: 30px;
    -webkit-appearance: none;
    border: none;
    border-radius: 3px;
    background-color: #d7ecff;
    background-color: ${(props) =>
      props.color === "" ? "#37a2ff" : "#d7ecff"};
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: ${(props) => (props.color === "" ? "pointer" : "not-allowed")};
  `,
  Logo: styled.h3`
    font-family: "Dancing Script", Handwriting;
    cursor: pointer;
    padding: 16px 0px;
    margin: 0;
    font-size: 45px;
  `,
  HorizontalLine: styled.div`
    width: 104px;
    border-top: 1px solid lightgrey;
  `,
  StyledH5: styled.h5`
    font-size: 13px;
    color: #a9a8a8;
    padding: 0;
    margin: 0;
  `,
  SignUpContainer: styled.div`
    width: 350px;
    height: 80px;
    border: 1px solid lightgrey;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  StyledSpan: styled.span`
    font-size: 15px;
    color: #737373;
  `,
  SignUpButton: styled.span`
    font-size: 16px;
    color: #4891ff;
    font-weight: bold;
    cursor: pointer;
  `,
}

export default function Auth() {
  const router = useRouter()
  const [Email, setEmail] = useState<string>("")
  const [Password, setPassword] = useState<string>("")
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const githubProvider = new GithubAuthProvider()
  const googleProvider = new GoogleAuthProvider()

  const handleOnInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.target.name === "Email") {
      setEmail(event.target.value)
      return
    }
    setPassword(event.target.value)
  }
  const handleNameOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setName(event.target.value)
  }
  const uploadUserNameToFirestore = async (name: string) => {
    const userDataRef = doc(
      DBService,
      "userData",
      `${authService.currentUser?.uid}`,
    )
    await setDoc(userDataRef, {
      name: name,
    })
  }
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    if (Email.length === 0) return
    if (Password.length < 6) return
    if (isNewAccount === true) {
      await createUserWithEmailAndPassword(authService, Email, Password)
        .then((response) => {
          if (response && authService.currentUser !== null) {
            updateProfile(authService.currentUser, {
              displayName: name,
            })
            uploadUserNameToFirestore(name)
            signOut(authService)
            setIsNewAccount(false)
            alert(
              "회원가입에 성공 하셨습니다! 회원가입하신 정보로 로그인 바랍니다.",
            )
            setEmail("")
            setPassword("")
          }
        })
        .catch((error) => {
          if (error.code === "auth/weak-password") {
            alert("비밀번호는 최소 6자리 이상이어야 합니다.")
            setPassword("")
          } else if (error.code === "auth/email-already-in-use") {
            alert("이미 사용중인 이메일 입니다.")
            setPassword("")
            setEmail("")
          }
        })
      return
    }
    signInWithEmailAndPassword(authService, Email, Password)
      .then((response) => {
        if (response) {
          router.push("/")
        }
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          alert("비밀번호가 잘못되었습니다")
          setPassword("")
          return
        }
        if (error.code === "auth/invalid-email") {
          alert("이메일 똑바로 쓰세요")
        } else if (error.code === "auth/user-not-found") {
          alert("등록되지 않은 사용자 입니다")
        }
        setEmail("")
        setPassword("")
      })
  }

  const handleGoogleAuth = async () => {
    await signInWithPopup(authService, googleProvider)
      .then((response) => {
        if (response) {
          router.push("/")
        }
      })
      .catch((error) => {
        if (error.code === "auth/cancelled-popup-request") {
          alert(
            "로그인 진행중에 오류가 발생하였습니다. 팝업창을 닫지 않도록 주의하시기 바랍니다.",
          )
        }
      })
  }

  const handleGitHubAuth = async () => {
    await signInWithPopup(authService, githubProvider)
      .then((response) => {
        if (response) {
          router.push("/")
        }
      })
      .catch((error) => {
        if (error.code === "auth/cancelled-popup-request") {
          alert(
            "로그인 진행중에 오류가 발생하였습니다. 팝업창을 닫지 않도록 주의하시기 바랍니다.",
          )
        }
      })
  }

  return (
    <Layout>
      <Style.Wrapper>
        <Margin direction="column" size={60} />
        <Style.FormContainer onSubmit={handleOnSubmit}>
          <Margin direction="column" size={20} />
          <Style.Logo
            onClick={() => {
              router.push("/")
            }}
          >
            youngstagram
          </Style.Logo>
          <Margin direction="column" size={20} />
          <Style.InputBox
            type={"text"}
            placeholder="Email"
            required
            onChange={handleOnInputChange}
            name="Email"
            value={Email}
          />
          <Margin direction="column" size={6} />
          <Style.InputBox
            type={"password"}
            placeholder="Password"
            required
            onChange={handleOnInputChange}
            name="Password"
            value={Password}
          />
          {isNewAccount ? (
            <>
              <Margin direction="column" size={6} />
              <Style.InputBox
                placeholder="Name"
                required
                minLength={3}
                onChange={handleNameOnChange}
              />
            </>
          ) : (
            <></>
          )}
          <Margin direction="column" size={16} />
          <Style.SubmitButton
            type={"submit"}
            value={isNewAccount ? "Create Account" : "Log in"}
            color={Email.length !== 0 && Password.length >= 6 ? "" : "fail"}
          />
          <Margin direction="column" size={15} />
          <FlexBox width={350} justifyContents="center" alignItems="center">
            <Style.HorizontalLine />
            <Margin direction="row" size={18} />
            <Style.StyledH5>또는</Style.StyledH5>
            <Margin direction="row" size={18} />
            <Style.HorizontalLine />
          </FlexBox>
          <Margin direction="column" size={22} />
          <FlexBox justifyContents="center">
            <Image
              src={"/GoogleIcon.png"}
              alt="googleLogin"
              onClick={handleGoogleAuth}
              width={40}
              height={40}
              style={{ cursor: "pointer" }}
            />
            <Margin direction="row" size={20} />
            <Image
              src={"/GitHubIcon.png"}
              alt="githubLogin"
              onClick={handleGitHubAuth}
              width={40}
              height={40}
              style={{ cursor: "pointer" }}
            />
          </FlexBox>
        </Style.FormContainer>
        <Margin direction="column" size={30} />
        <Style.SignUpContainer>
          <Style.StyledSpan>
            {isNewAccount ? "계정이 있으신가요?" : "계정이 없으신가요?"}
          </Style.StyledSpan>
          <Margin direction="row" size={10} />
          <Style.SignUpButton
            onClick={() => {
              setIsNewAccount((current) => !current)
            }}
          >
            {isNewAccount ? "로그인" : "가입하기"}
          </Style.SignUpButton>
        </Style.SignUpContainer>
      </Style.Wrapper>
    </Layout>
  )
}
