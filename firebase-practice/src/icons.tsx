type Props = {
  width: number
  height: number
  onClick?: () => void
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
