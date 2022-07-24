import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"
import { authService } from "@FireBase"
import Header from "layout/Header"

export default function Auth() {
  const router = useRouter()
  const [Email, setEmail] = useState<string>("")
  const [Password, setPassword] = useState<string>("")
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false)
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
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (isNewAccount === true) {
      createUserWithEmailAndPassword(authService, Email, Password)
        .then((response) => {
          if ((response.operationType = "signIn")) {
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
        if (response.operationType === "signIn") {
          router.push("/")
        }
      })
      .catch((error) => {
        console.log(error.code)
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
    <>
      <Header />
      <form onSubmit={handleOnSubmit}>
        <input
          type={"text"}
          placeholder="Email"
          required
          onChange={handleOnInputChange}
          name="Email"
          value={Email}
        />
        <input
          type={"password"}
          placeholder="Password"
          required
          onChange={handleOnInputChange}
          name="Password"
          value={Password}
        />
        <input
          type={"submit"}
          value={isNewAccount ? "Create Account" : "Log in"}
        />
      </form>
      <button
        onClick={() => {
          setIsNewAccount((current) => !current)
        }}
      >
        {isNewAccount ? "로그인" : "회원가입"}
      </button>
      <div>
        <button onClick={handleGoogleAuth}>Continue with Google</button>
        <button onClick={handleGitHubAuth}>Continue with GitHub</button>
      </div>
    </>
  )
}
