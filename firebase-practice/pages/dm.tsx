import Layout from "components/layout"
import PCDM from "@feature/dm/PC/PC"
import useWindowSize from "lib/useWindowSize"
import MobileDM from "@feature/dm/Mobile/Mobile"

export default function Dm() {
  const windowSize = useWindowSize()
  return <Layout>{windowSize > 900 ? <PCDM /> : <MobileDM />}</Layout>
}
