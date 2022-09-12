type Props = {
  width: number
  height: number
  onClick?: () => void
}

export function ProfileIcon({ onClick, width, height }: Props) {
  return (
    <svg
      aria-label="프로필"
      color="#262626"
      fill="#262626"
      height={height}
      role="img"
      viewBox="0 0 24 24"
      width={width}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <circle
        cx="12.004"
        cy="12.004"
        fill="none"
        r="10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></circle>
      <path
        d="M18.793 20.014a6.08 6.08 0 00-1.778-2.447 3.991 3.991 0 00-2.386-.791H9.38a3.994 3.994 0 00-2.386.791 6.09 6.09 0 00-1.779 2.447"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></path>
      <circle
        cx="12.006"
        cy="9.718"
        fill="none"
        r="4.109"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
      ></circle>
    </svg>
  )
}

export function BottomArrowIcon({ width, height, onClick }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      id="i-chevron-bottom"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <path d="M30 12 L16 24 2 12" />
    </svg>
  )
}

export function XIcon({ width, height, onClick }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
