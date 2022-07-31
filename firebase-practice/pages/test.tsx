import ProfilePageImageInput from "@feature/profile/ProfilePageImageInput"
import Layout from "components/layout"
import { Margin } from "ui"

export default function test() {
  return (
    <Layout>
      <Margin direction="column" size={30} />
      <ProfilePageImageInput />
    </Layout>
  )
}
