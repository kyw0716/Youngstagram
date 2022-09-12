import Layout from "components/layout"
import PCDM from "@feature/dm/PC"
import useWindowSize from "lib/useWindowSize"
import MobileDM from "@feature/dm/Mobile"
import { useRecoilValue } from "recoil"
import { userDataState } from "@share/recoil/recoilList"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Dm() {
  const windowSize = useWindowSize()
  const currentUserData = useRecoilValue(userDataState)
  const router = useRouter()
  useEffect(() => {
    if (currentUserData.info.userId === "") router.replace("/loading?path=dm")
  }, [currentUserData])
  return (
    <Layout isMobileDM={windowSize < 900}>
      {windowSize > 900 ? <PCDM /> : <MobileDM />}
    </Layout>
  )
}
