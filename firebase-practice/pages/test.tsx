import Loading from "@share/Loading/Loading"
import { userDataState } from "@share/recoil/recoilList"
import axios from "axios"
import Layout from "components/layout"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

export default function Test() {
  const userData = useRecoilValue(userDataState)
  const [image, setImage] = useState<File>()

  useEffect(() => {
    if (image) {
      axios({
        method: "POST",
        url: "/api/imageUpload",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          imageFile: image,
          creator: userData.info.userId,
        },
      }).then((response) => console.log(response.data))
    }
  }, [image])
  return (
    <Layout>
      <input
        type={"file"}
        onChange={(e) => {
          if (e.target.files !== null) {
            setImage(e.target.files[0])
          }
        }}
      />
      <Loading width={150} height={150} borderRadius={150} />
    </Layout>
  )
}
