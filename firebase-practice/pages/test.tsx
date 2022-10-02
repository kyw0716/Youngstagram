import Loading from "@share/Loading/Loading"
import Layout from "components/layout"
import { useEffect } from "react"

export default function Test() {
  useEffect(() => {
    fetch("/api/feed")
      .then((response) => response.json())
      .then((json) => console.log(json))
  }, [])
  return (
    <Layout>
      <Loading width={150} height={150} borderRadius={150} />
    </Layout>
  )
}
