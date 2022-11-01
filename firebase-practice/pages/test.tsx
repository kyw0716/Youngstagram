import { authService } from "@FireBase"
import Loading from "@share/Loading/Loading"
import { userDataState } from "@share/recoil/recoilList"
import axios from "axios"
import Layout from "components/layout"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

export default function Test() {
  const userData = useRecoilValue(userDataState)

  useEffect(() => {
    if (userData.info.userId !== "")
      axios({
        method: "POST",
        url: "/api/setProfile",
        data: {
          userId: userData.info.userId,
          userName: "kyw0716",
          profileImage:
            "https://firebasestorage.googleapis.com/v0/b/fir-practice-d0e2e.appspot.com/o/images%2FUHDnmmsdJdOIb0LZOsyXQRf4sX03%2F5f782f60-e7d6-436c-bb0c-3045e7804b52?alt=media&token=22186e65-fdc9-418f-8eec-dbdc25b6dd19",
          email: "kyw0716@naver.com",
        },
      }).then((response) => console.log(response.data))
  }, [userData])
  return (
    <Layout>
      <Loading width={150} height={150} borderRadius={150} />
    </Layout>
  )
}
