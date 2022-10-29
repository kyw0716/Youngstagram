import Loading from "@share/Loading/Loading"
import Layout from "components/layout"
import { useEffect } from "react"

export default function Test() {
  useEffect(() => {
    fetch("/api/like?storageId=37958bfa-a656-4536-b596-62e0bfbe662f")
      .then((response) => response.json())
      .then((json) => console.log(json))
  }, [])
  return (
    <Layout>
      <Loading width={150} height={150} borderRadius={150} />
    </Layout>
  )
}
