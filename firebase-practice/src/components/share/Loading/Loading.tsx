import { darkModeState } from "@share/recoil/recoilList"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useRecoilValue } from "recoil"

type Props = {
  width: number | string
  height: number | string
  borderRadius?: number | string
  count?: number
  paddingTop?: string
}

export default function Loading({
  width,
  height,
  borderRadius,
  count,
  paddingTop,
}: Props) {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <SkeletonTheme
      baseColor={isDarkMode ? "#212121" : "#e8e8e8"}
      highlightColor={isDarkMode ? "#4a4a4a" : "#f7f7f7"}
    >
      <Skeleton
        width={width}
        height={height}
        borderRadius={borderRadius}
        count={count}
        style={{ paddingTop: `${paddingTop}` }}
      />
    </SkeletonTheme>
  )
}
