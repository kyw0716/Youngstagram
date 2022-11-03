import { authService } from "@FireBase"
import {
  browserSessionPersistence,
  GithubAuthProvider,
  setPersistence,
  signInWithPopup,
} from "firebase/auth"
import { NextApiRequest, NextApiResponse } from "next"

export default async function githubAuth(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET")
    await signInWithPopup(authService, new GithubAuthProvider())
      .catch((error) => {
        if (error.code === "auth/cancelled-popup-request")
          res
            .status(500)
            .json(
              "로그인 진행중에 오류가 발생하였습니다. 팝업창을 닫지 않도록 주의하시기 바랍니다.",
            )

        if (error.code === "auth/account-exists-with-different-credential")
          res
            .status(500)
            .json("동일한 이메일 주소로 이미 가입된 계정이 있습니다.")
      })
      .then(async (response) => {
        res.status(200).json(response)
      })
}
