import { userDataState } from "@share/recoil/recoilList"
import Layout from "components/layout"
import {
  AllFileIcon,
  CameraIcon,
  DeleteIcon,
  EditIcon,
  EmptyIcon,
  GitHubIcon,
  GoogleIcon,
  LeftArrowForCarouselIcon,
  LeftArrowIcon,
  LineMenuIcon,
  LocationIcon,
  LockIcon,
  LogoutIcon,
  RightArrowForCarouselIcon,
  RightArrowIcon,
  UnLockIcon,
} from "icons"
import { useRecoilValue } from "recoil"

export default function Test() {
  return (
    <Layout>
      <AllFileIcon width={30} height={30} />
      <CameraIcon width={30} height={30} />
      <DeleteIcon width={30} height={30} />
      <EditIcon width={30} height={30} />
      <EmptyIcon width={30} height={30} />
      <GitHubIcon width={30} height={30} />
      <GoogleIcon width={30} height={30} />
      <LeftArrowForCarouselIcon width={30} height={30} />
      <LeftArrowIcon width={30} height={30} />
      <LineMenuIcon width={30} height={30} />
      <LocationIcon width={30} height={30} />
      <LockIcon width={30} height={30} />
      <LogoutIcon width={30} height={30} />
      <RightArrowForCarouselIcon width={30} height={30} />
      <RightArrowIcon width={30} height={30} />
      <UnLockIcon width={30} height={30} />
    </Layout>
  )
}
