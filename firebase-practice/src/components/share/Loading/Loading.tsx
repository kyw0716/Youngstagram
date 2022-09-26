import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

type Props = {
  width: number | string
  height: number | string
  borderRadius?: number | string
  count?: number
}

export default function Loading({ width, height, borderRadius, count }: Props) {
  return (
    <SkeletonTheme baseColor="#e8e8e8" highlightColor="#f7f7f7">
      <Skeleton
        width={width}
        height={height}
        borderRadius={borderRadius}
        count={count}
      />
    </SkeletonTheme>
  )
}
