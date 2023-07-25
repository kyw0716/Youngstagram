import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  UserCredential,
} from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { authService, DBService } from "@FireBase"
import styled from "styled-components"
import { CustomH6Light, FlexBox, Margin } from "ui"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import Layout from "components/layout"
import { UserInfo } from "backend/dto"
import { GitHubIcon, GoogleIcon } from "icons"
import { useRecoilValue } from "recoil"
import { darkModeState } from "@share/recoil/recoilList"
import { useAuth } from "lib/hooks/useAuth"

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
    font-size: 16px;
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
  const isDarkMode = useRecoilValue(darkModeState)

  const {
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
    handleGitHubAuth,
    handleGoogleAuth,
    handleOnSubmit,
    handleNameOnChange,
  } = useAuth()

  useEffect(() => {
    if (isLogin) router.push("/")
    setIsLogin(false)
  }, [isLogin])

  return (
    <Layout>
      <Style.Wrapper style={isDarkMode ? { backgroundColor: "black" } : {}}>
        <Margin direction="column" size={60} />
        <Style.FormContainer
          onSubmit={handleOnSubmit}
          style={
            isDarkMode
              ? {
                  border: "1px solid lightgrey",
                  backgroundColor: "#373e47",
                }
              : {}
          }
        >
          <Margin direction="column" size={20} />
          <Style.Logo style={{ color: isDarkMode ? "white" : "black" }}>
            youngstagram
          </Style.Logo>
          <Margin direction="column" size={20} />
          <Style.InputBox
            type={"text"}
            placeholder="Email"
            required
            onChange={handleOnInputChange}
            name="Email"
            value={email}
            autoComplete="off"
            style={
              isDarkMode
                ? {
                    border: "1px solid lightgrey",
                    backgroundColor: "#373e47",
                    color: "white",
                  }
                : {}
            }
          />
          {email.search(/\@\w+\.com|\@\w+\.net/) === -1 && email.length > 3 ? (
            <span style={{ color: "red", width: "268px", fontSize: "13px" }}>
              올바르지 않은 이메일 형식입니다.
            </span>
          ) : (
            ""
          )}
          <Margin direction="column" size={6} />
          <Style.InputBox
            type={"password"}
            placeholder="Password"
            required
            onChange={handleOnInputChange}
            name="Password"
            value={password}
            style={
              password !== confirmPassword &&
              confirmPassword !== "" &&
              password !== ""
                ? { backgroundColor: "red" }
                : {
                    backgroundColor: isDarkMode ? "#373e47" : "white",
                    color: isDarkMode ? "white" : "black",
                  }
            }
          />
          {isNewAccount ? (
            <>
              <Margin direction="column" size={6} />
              <Style.InputBox
                placeholder="Password Again"
                required
                minLength={3}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                }}
                type="password"
                style={
                  password !== confirmPassword &&
                  confirmPassword !== "" &&
                  password !== ""
                    ? { backgroundColor: "red" }
                    : { backgroundColor: "white" }
                }
              />
              {password !== confirmPassword &&
              confirmPassword !== "" &&
              password !== "" ? (
                <CustomH6Light style={{ color: "red" }}>
                  비밀번호가 일치하지 않습니다
                </CustomH6Light>
              ) : (
                <></>
              )}
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
            color={
              isNewAccount
                ? email.length !== 0 &&
                  password.length >= 6 &&
                  password === confirmPassword &&
                  name !== ""
                  ? ""
                  : "fail"
                : email.length !== 0 && password.length >= 6
                ? ""
                : "fail"
            }
            disabled={
              isNewAccount
                ? !(
                    email.length !== 0 &&
                    password.length >= 6 &&
                    password === confirmPassword &&
                    confirmPassword !== "" &&
                    name !== ""
                  )
                : !(email.length !== 0 && password.length >= 6)
            }
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
            <GoogleIcon
              width={40}
              height={40}
              onClick={() => {
                setPersistence(authService, browserSessionPersistence).then(
                  () => {
                    handleGoogleAuth()
                  },
                )
              }}
            />
            <Margin direction="row" size={20} />
            <GitHubIcon
              width={40}
              height={40}
              onClick={() => {
                setPersistence(authService, browserSessionPersistence).then(
                  () => {
                    handleGitHubAuth()
                  },
                )
              }}
            />
          </FlexBox>
        </Style.FormContainer>
        <Margin direction="column" size={30} />
        <Style.SignUpContainer
          style={
            isDarkMode
              ? {
                  border: "1px solid lightgrey",
                  backgroundColor: "#373e47",
                }
              : {}
          }
        >
          <Style.StyledSpan style={{ color: isDarkMode ? "white" : "black" }}>
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
      <Margin direction="column" size={20} />
    </Layout>
  )
}
