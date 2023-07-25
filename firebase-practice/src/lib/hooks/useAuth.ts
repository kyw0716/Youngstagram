import { DBService, authService } from "@FireBase"
import { userDataState } from "@share/recoil/recoilList"
import { UserData, UserInfo } from "backend/dto"
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSetRecoilState } from "recoil"

export const useAuth = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  const githubProvider = new GithubAuthProvider()
  const googleProvider = new GoogleAuthProvider()

  const setCurrentUser = useSetRecoilState(userDataState)

  const handleOnInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.target.name === "Email") {
      if (event.target.value === "서경") alert("사랑해")
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
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    if (email.length === 0) return
    if (password.length < 6) return
    if (isNewAccount === true) {
      await createUserWithEmailAndPassword(authService, email, password)
        .then((response) => {
          if (response && authService.currentUser !== null) {
            updateProfile(authService.currentUser, {
              displayName: name,
            })
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
            setConfirmPassword("")
            setPassword("")
          } else if (error.code === "auth/email-already-in-use") {
            alert("이미 사용중인 이메일 입니다.")
            setPassword("")
            setConfirmPassword("")
            setEmail("")
          } else if (error.code === "auth/invalid-email") {
            alert("올바른 이메일 형식을 입력해주세요")
            setEmail("")
          }
        })
      return
    }
    setPersistence(authService, browserSessionPersistence)
      .then(async () => {
        return signInWithEmailAndPassword(authService, email, password)
          .then(async (response) => {
            if (response) {
              setIsLogin(true)
              CreateNewUserToFirestore(response)
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
      })
      .catch((error) => console.log(error.code))
  }

  const handleGoogleAuth = async () => {
    signInWithPopup(authService, googleProvider)
      .then((response) => {
        CreateNewUserToFirestore(response)
      })
      .catch((error) => {
        if (error.code === "auth/cancelled-popup-request") {
          alert(
            "로그인 진행중에 오류가 발생하였습니다. 팝업창을 닫지 않도록 주의하시기 바랍니다.",
          )
        }
        if (error.code === "auth/account-exists-with-different-credential") {
          alert("동일한 이메일 주소로 이미 가입된 계정이 있습니다.")
        }
        router.push("/auth")
      })
  }

  const handleGitHubAuth = async () => {
    signInWithPopup(authService, githubProvider)
      .then((response) => {
        if (response) {
          CreateNewUserToFirestore(response)
        }
      })
      .catch((error) => {
        if (error.code === "auth/cancelled-popup-request") {
          alert(
            "로그인 진행중에 오류가 발생하였습니다. 팝업창을 닫지 않도록 주의하시기 바랍니다.",
          )
        }
        if (error.code === "auth/account-exists-with-different-credential") {
          alert("동일한 이메일 주소로 이미 가입된 계정이 있습니다.")
        }
        router.push("/auth")
      })
  }

  const CreateNewUserToFirestore = async (response: UserCredential) => {
    const newUserToFirestoreRef = doc(DBService, "users", response.user.uid)

    const UserDataForm: UserInfo = {
      userId: response.user.uid,
      profileImage: response.user.photoURL,
      name: response.user.displayName,
      email: response.user.email,
    }

    setIsLogin(true)

    await updateDoc(newUserToFirestoreRef, { info: UserDataForm }).catch(
      (error) => {
        setIsLogin(false)

        if (error.code === "not-found") {
          setDoc(newUserToFirestoreRef, { info: UserDataForm })
            .then(async () => {
              const userDocument = await getDoc(newUserToFirestoreRef)

              setCurrentUser(userDocument.data() as UserData)
              setIsLogin(true)
            })
            .catch((error) => console.log(error.code))
        }
      },
    )
  }

  return {
    isLogin,
    isNewAccount,
    email,
    name,
    password,
    confirmPassword,
    setIsLogin,
    setConfirmPassword,
    setIsNewAccount,
    handleOnInputChange,
    handleOnSubmit,
    handleNameOnChange,
    handleGitHubAuth,
    handleGoogleAuth,
  }
}
