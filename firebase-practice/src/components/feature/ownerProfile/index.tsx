import useWindowSize from "lib/useWindowSize"
import { Margin } from "ui"
import MobileHeader from "./MobileHeader"
import PCHeader from "./PCHeader"

export default function ProfileHeader() {
  const windowSize = useWindowSize()
  return (
    <>
      <Margin direction="column" size={30} />
      <>
        {windowSize > 900 ? <PCHeader /> : <MobileHeader />}
        <Margin direction="column" size={44} />
      </>
    </>
  )
}
