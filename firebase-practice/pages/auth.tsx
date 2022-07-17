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
import { authService } from "../src/FireBase"

export default function Auth() {
  const router = useRouter()
  const [Email, setEmail] = useState<string>("")
  const [Password, setPassword] = useState<string>("")
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false)
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
      createUserWithEmailAndPassword(authService, Email, Password).then(
        (response) => {
          if ((response.operationType = "signIn")) {
            signOut(authService)
            setIsNewAccount(false)
            alert(
              "회원가입에 성공 하셨습니다! 회원가입하신 정보로 로그인 바랍니다.",
            )
            setEmail("")
            setPassword("")
          }
        },
      )
      return
    }
    signInWithEmailAndPassword(authService, Email, Password).then(
      (response) => {
        if (response.operationType === "signIn") {
          router.push("/")
        }
      },
    )
  }

  const handleGoogleAuth = () => {
    const googleProvider = new GoogleAuthProvider()
    signInWithPopup(authService, googleProvider).then((response) => {
      if (response.operationType === "signIn") {
        router.push("/")
      }
    })
  }

  const handleGitHubAuth = () => {
    const githubProvider = new GithubAuthProvider()
    signInWithPopup(authService, githubProvider).then((response) => {
      if (response.operationType === "signIn") {
        router.push("/")
      }
    })
  }

  return (
    <>
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
