import { darkModeState } from "@share/recoil/recoilList"
import { useRecoilValue, useSetRecoilState } from "recoil"

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

export function DotMenuIcon({ width, height }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      enableBackground="new 0 0 32 32"
      id="Glyph"
      version="1.1"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z"
        id="XMLID_287_"
      />
      <path
        d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z"
        id="XMLID_289_"
      />
      <path
        d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z"
        id="XMLID_291_"
      />
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

export function AllFileIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      enableBackground="new 0 0 24 24"
      xmlSpace="preserve"
      style={{ cursor: "pointer" }}
    >
      <g>
        <g>
          <g>
            <path d="M16,20H4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v18C17,19.6,16.6,20,16,20z M5,18h10V2H5V18z" />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M20,24H8c-0.6,0-1-0.4-1-1v-4c0-0.6,0.4-1,1-1s1,0.4,1,1v3h10V6h-3c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1v18
				C21,23.6,20.6,24,20,24z"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export function CameraIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 369.946 369.946"
      xmlSpace="preserve"
      style={{ cursor: "pointer" }}
      width={width}
      height={height}
    >
      <g>
        <path
          style={{ fill: "#010002" }}
          d="M361.658,130.161l0.37-0.322l-0.788-0.925C337.444,54.245,267.429,0,184.973,0
		C82.975,0,0,82.981,0,184.973c0,101.998,82.981,184.973,184.973,184.973s184.973-82.975,184.973-184.973
		C369.952,165.897,367.046,147.489,361.658,130.161z M347.767,126.337l-91.311,78.053l45.527-146.767
		C322.336,76.334,338.196,99.838,347.767,126.337z M292.09,49.227l-35.652,114.946L213.143,14.261
		C242.625,19.112,269.601,31.439,292.09,49.227z M238.353,146.916l0.871,0.656l0.251,0.865
		C239.122,147.919,238.723,147.429,238.353,146.916z M238.681,184.973c0,26.803-19.762,49.018-45.468,53.004l-8.407,0.686
		c-7.184-0.018-14.04-1.468-20.299-4.069l-14.446-8.903c-3.121-2.685-5.913-5.722-8.354-9.052l-7.572-14.511
		c-1.826-5.394-2.858-11.152-2.858-17.161c0-12.029,4.022-23.11,10.728-32.066l12.572-12.155c8.652-5.967,19.124-9.481,30.401-9.481
		C214.587,131.271,238.681,155.365,238.681,184.973z M184.973,11.934c5.149,0,10.233,0.269,15.275,0.716l33.438,115.769
		L105.5,31.344C129.32,18.969,156.332,11.934,184.973,11.934z M94.187,37.746l112.929,85.517
		c-6.928-2.494-14.362-3.926-22.143-3.926H24.9C38.868,85.404,63.303,56.858,94.187,37.746z M11.934,184.973
		c0-18.748,3.037-36.786,8.574-53.702h126.85c-5.424,3.813-10.221,8.425-14.273,13.664L24.589,249.815
		C16.457,229.772,11.934,207.898,11.934,184.973z M29.775,261.391l89.348-86.37l-8.706,165.986
		C75.469,324.228,46.947,296.118,29.775,261.391z M184.973,358.012c-22.185,0-43.373-4.266-62.879-11.904l6.695-127.637
		c0.889,1.486,1.712,3.019,2.715,4.427l70.051,134.302C196.095,357.72,190.57,358.012,184.973,358.012z M214.139,355.506
		l-58.326-111.819c1.044,0.519,2.076,1.056,3.145,1.516l128.377,79.18C266.099,340.01,241.175,350.9,214.139,355.506z
		 M297.258,316.477l-107.213-66.125c1.444-0.113,2.87-0.286,4.284-0.489l155.658-12.787
		C340.106,268.294,321.584,295.676,297.258,316.477z M353.334,224.826l-113.305,9.308l111.652-95.44
		c4.105,14.744,6.337,30.252,6.337,46.285C358.018,198.691,356.365,212.021,353.334,224.826z"
        />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function DeleteIcon({ width, height, onClick }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
    >
      <path
        d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"
        fill="#0D0D0D"
      />
    </svg>
  )
}

export function EditIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 511.999 511.999"
      xmlSpace="preserve"
      width={width}
      height={height}
      style={{ cursor: "pointer" }}
    >
      <g>
        <g>
          <path
            d="M493.246,18.744c-24.992-24.993-65.508-24.993-90.501,0l-2.588,2.588H21.342c-11.782,0-21.333,9.551-21.333,21.333v448
        c0,11.782,9.551,21.333,21.333,21.333h448c11.782,0,21.333-9.551,21.333-21.333v-378.85l2.572-2.572
        C518.238,84.252,518.238,43.737,493.246,18.744z M463.076,48.914c8.33,8.33,8.33,21.831,0,30.161l-163.59,163.607l-40.899,40.899
        c-5.27,5.27-10.97,10.005-17.005,14.197c-14.144,9.82-30.168,16.606-47.057,19.907c4.65-24.352,16.514-46.895,34.209-64.59
        L432.915,48.914C441.245,40.584,454.746,40.584,463.076,48.914z M448.008,154.499v314.833H42.675V63.999h314.811L198.556,222.93
        c-28.714,28.714-45.981,66.916-48.573,107.463l-0.231,3.704l-0.378,5.856c-0.646,9.996,5.682,18.745,14.691,21.67
        c2.078,0.676,4.3,1.043,6.611,1.043c34.609,0,68.097-10.737,96.03-30.374c7.822-5.498,15.209-11.693,22.061-18.545l41.013-41.018
        L448.008,154.499z"
          />
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function EmptyIcon({ width, height, onClick }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      enableBackground="new 0 0 32 32"
      id="_x3C_Layer_x3E_"
      version="1.1"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="page_x2C__document_x2C__emoji_x2C__No_results_x2C__empty_page">
        <g id="XMLID_1521_">
          <path
            d="M21.5,14.75c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75    S21.09,14.75,21.5,14.75z"
            fill="#263238"
            id="XMLID_1887_"
          />
          <path
            d="M10.5,14.75c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75    S10.09,14.75,10.5,14.75z"
            fill="#263238"
            id="XMLID_1885_"
          />
        </g>
        <g id="XMLID_1337_">
          <g id="XMLID_4010_">
            <polyline
              fill="none"
              id="XMLID_4073_"
              points="     21.5,1.5 4.5,1.5 4.5,30.5 27.5,30.5 27.5,7.5    "
              stroke="#455A64"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
            <polyline
              fill="none"
              id="XMLID_4072_"
              points="     21.5,1.5 27.479,7.5 21.5,7.5 21.5,4    "
              stroke="#455A64"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
            <path
              d="     M14.5,18.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5"
              fill="none"
              id="XMLID_4071_"
              stroke="#455A64"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
            <g id="XMLID_4068_">
              <path
                d="      M20.75,15.5c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75s-0.34-0.75-0.75-0.75S20.75,15.09,20.75,15.5z"
                fill="none"
                id="XMLID_4070_"
                stroke="#455A64"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
              />
              <path
                d="      M11.25,15.5c0,0.41-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75s0.34-0.75,0.75-0.75S11.25,15.09,11.25,15.5z"
                fill="none"
                id="XMLID_4069_"
                stroke="#455A64"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
              />
            </g>
          </g>
          <g id="XMLID_2974_">
            <polyline
              fill="none"
              id="XMLID_4009_"
              points="     21.5,1.5 4.5,1.5 4.5,30.5 27.5,30.5 27.5,7.5    "
              stroke="#263238"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
            <polyline
              fill="none"
              id="XMLID_4008_"
              points="     21.5,1.5 27.479,7.5 21.5,7.5 21.5,4    "
              stroke="#263238"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
            <path
              d="     M14.5,18.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5"
              fill="none"
              id="XMLID_4007_"
              stroke="#263238"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
            <g id="XMLID_4004_">
              <path
                d="      M20.75,15.5c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75s-0.34-0.75-0.75-0.75S20.75,15.09,20.75,15.5z"
                fill="none"
                id="XMLID_4006_"
                stroke="#263238"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
              />
              <path
                d="      M11.25,15.5c0,0.41-0.34,0.75-0.75,0.75s-0.75-0.34-0.75-0.75s0.34-0.75,0.75-0.75S11.25,15.09,11.25,15.5z"
                fill="none"
                id="XMLID_4005_"
                stroke="#263238"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export function GitHubIcon({ width, height, onClick }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      id="i-github"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <path
        strokeWidth="0"
        fill="currentColor"
        d="M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z"
      />
    </svg>
  )
}

export function GoogleIcon({ width, height, onClick }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <path
        fill="#EA4335 "
        d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
      />
      <path
        fill="#34A853"
        d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
      />
      <path
        fill="#4A90E2"
        d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
      />
    </svg>
  )
}

export function LeftArrowForCarouselIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 54 54"
      enableBackground="0 0 54 54"
      xmlSpace="preserve"
      width={width}
      height={height}
      style={{ cursor: "pointer" }}
    >
      <g>
        <g>
          <path
            fill="#4FBA6F"
            d="M27,1L27,1c14.359,0,26,11.641,26,26v0c0,14.359-11.641,26-26,26h0C12.641,53,1,41.359,1,27v0
     C1,12.641,12.641,1,27,1z"
          />
          <path
            fill="#4FBA6F"
            d="M27,54C12.112,54,0,41.888,0,27S12.112,0,27,0s27,12.112,27,27S41.888,54,27,54z M27,2
     C13.215,2,2,13.215,2,27s11.215,25,25,25s25-11.215,25-25S40.785,2,27,2z"
          />
        </g>
        <path
          fill="#FFFFFF"
          d="M31.706,40c-0.256,0-0.512-0.098-0.707-0.293L19.501,28.209c-0.667-0.667-0.667-1.751,0-2.418
   l11.498-11.498c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414L21.12,27l11.293,11.293c0.391,0.391,0.391,1.023,0,1.414
   C32.218,39.902,31.962,40,31.706,40z"
        />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function LeftArrowIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 400.004 400.004"
      enableBackground="0 0 400.004 400.004"
      xmlSpace="preserve"
    >
      <g>
        <path
          d="M382.688,182.686H59.116l77.209-77.214c6.764-6.76,6.764-17.726,0-24.485c-6.764-6.764-17.73-6.764-24.484,0L5.073,187.757
   c-6.764,6.76-6.764,17.727,0,24.485l106.768,106.775c3.381,3.383,7.812,5.072,12.242,5.072c4.43,0,8.861-1.689,12.242-5.072
   c6.764-6.76,6.764-17.726,0-24.484l-77.209-77.218h323.572c9.562,0,17.316-7.753,17.316-17.315
   C400.004,190.438,392.251,182.686,382.688,182.686z"
        />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function LineMenuIcon({ width, height, onClick }: Props) {
  const isDarkMode = useRecoilValue(darkModeState)
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
        fill={isDarkMode ? "white" : "#262626"}
      />
    </svg>
  )
}

export function LocationIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 368.666 368.666"
      enableBackground="0 0 368.666 368.666;"
      xmlSpace="preserve"
    >
      <g id="XMLID_2_">
        <g>
          <g>
            <path
              d="M184.333,0C102.01,0,35.036,66.974,35.036,149.297c0,33.969,11.132,65.96,32.193,92.515
       c27.27,34.383,106.572,116.021,109.934,119.479l7.169,7.375l7.17-7.374c3.364-3.46,82.69-85.116,109.964-119.51
       c21.042-26.534,32.164-58.514,32.164-92.485C333.63,66.974,266.656,0,184.333,0z M285.795,229.355
       c-21.956,27.687-80.92,89.278-101.462,110.581c-20.54-21.302-79.483-82.875-101.434-110.552
       c-18.228-22.984-27.863-50.677-27.863-80.087C55.036,78.002,113.038,20,184.333,20c71.294,0,129.297,58.002,129.296,129.297
       C313.629,178.709,304.004,206.393,285.795,229.355z"
            />
            <path
              d="M184.333,59.265c-48.73,0-88.374,39.644-88.374,88.374c0,48.73,39.645,88.374,88.374,88.374s88.374-39.645,88.374-88.374
       S233.063,59.265,184.333,59.265z M184.333,216.013c-37.702,0-68.374-30.673-68.374-68.374c0-37.702,30.673-68.374,68.374-68.374
       s68.373,30.673,68.374,68.374C252.707,185.341,222.035,216.013,184.333,216.013z"
            />
          </g>
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function LockIcon({ width, height, onClick }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M6 9V7.25C6 3.845 8.503 1 12 1s6 2.845 6 6.25V9h.5a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5v-8A2.5 2.5 0 015.5 9H6zm1.5-1.75C7.5 4.58 9.422 2.5 12 2.5c2.578 0 4.5 2.08 4.5 4.75V9h-9V7.25zm-3 4.25a1 1 0 011-1h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1v-8z"
      />
    </svg>
  )
}

export function LogoutIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 96.943 96.943"
      enableBackground="0 0 96.943 96.943;"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path
            d="M61.168,83.92H11.364V13.025H61.17c1.104,0,2-0.896,2-2V3.66c0-1.104-0.896-2-2-2H2c-1.104,0-2,0.896-2,2v89.623
     c0,1.104,0.896,2,2,2h59.168c1.105,0,2-0.896,2-2V85.92C63.168,84.814,62.274,83.92,61.168,83.92z"
          />
          <path
            d="M96.355,47.058l-26.922-26.92c-0.75-0.751-2.078-0.75-2.828,0l-6.387,6.388c-0.781,0.781-0.781,2.047,0,2.828
     l12.16,12.162H19.737c-1.104,0-2,0.896-2,2v9.912c0,1.104,0.896,2,2,2h52.644L60.221,67.59c-0.781,0.781-0.781,2.047,0,2.828
     l6.387,6.389c0.375,0.375,0.885,0.586,1.414,0.586c0.531,0,1.039-0.211,1.414-0.586l26.922-26.92
     c0.375-0.375,0.586-0.885,0.586-1.414C96.943,47.941,96.73,47.433,96.355,47.058z"
          />
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function RightArrowForCarouselIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 54 54"
      enableBackground="0 0 54 54;"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path
            fill="#4FBA6F"
            d="M27,53L27,53C12.641,53,1,41.359,1,27v0C1,12.641,12.641,1,27,1h0c14.359,0,26,11.641,26,26v0
     C53,41.359,41.359,53,27,53z"
          />
          <path
            fill="#4FBA6F"
            d="M27,54C12.112,54,0,41.888,0,27S12.112,0,27,0s27,12.112,27,27S41.888,54,27,54z M27,2
     C13.215,2,2,13.215,2,27s11.215,25,25,25s25-11.215,25-25S40.785,2,27,2z"
          />
        </g>
        <path
          fill="#FFFFFF"
          d="M22.294,40c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414L32.88,27
   L21.587,15.707c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l11.498,11.498c0.667,0.667,0.667,1.751,0,2.418
   L23.001,39.707C22.806,39.902,22.55,40,22.294,40z"
        />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function RightArrowIcon({ width, height, onClick }: Props) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 330 330"
      enableBackground="0 0 330 330;"
      xmlSpace="preserve"
    >
      <path
        id="XMLID_27_"
        d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255
 s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0
 c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z"
      />
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  )
}

export function UnLockIcon({ width, height, onClick }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
  )
}

export function DarkModeIcon() {
  const setIsDarkmode = useSetRecoilState(darkModeState)
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="white"
      style={{ cursor: "pointer" }}
      onClick={() => {
        setIsDarkmode(false)
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.6144 14.6145C19.787 14.8653 18.9093 15.0001 18 15.0001C13.0294 15.0001 9 10.9707 9 6.00013C9 5.09088 9.13484 4.21311 9.3856 3.38574C5.69007 4.50583 3 7.93883 3 12.0001C3 16.9707 7.02944 21.0001 12 21.0001C16.0613 21.0001 19.4943 18.3101 20.6144 14.6145Z"
        fill="white"
      ></path>
    </svg>
  )
}

export function LightModeIcon() {
  const setIsDarkmode = useSetRecoilState(darkModeState)
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ cursor: "pointer" }}
      onClick={() => {
        setIsDarkmode(true)
      }}
    >
      <path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm6.312-10.897c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z"></path>
    </svg>
  )
}
