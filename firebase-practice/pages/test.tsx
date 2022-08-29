import { userDataState } from "@share/recoil/recoilList"
import Layout from "components/layout"
import { useRecoilValue } from "recoil"

export default function Test() {
  const userData = useRecoilValue(userDataState)
  console.log(userData)
  return <Layout>g</Layout>
}
