import styled from "styled-components"

type FlexBoxProperty = {
  justifyContents?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
  alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline"
  gap?: number
  column?: boolean
  wrap?: boolean
  width?: number | string
  height?: number | string
  minHeight?: string
  maxHeight?: string
}

export const FlexBox = styled.div<FlexBoxProperty>`
  width: ${({ width }) =>
    width ? (typeof width === "string" ? width : `${width}px`) : `100%`};
  height: ${({ height }) =>
    height ? (typeof height === "string" ? height : `${height}px`) : `auto`};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : 0)};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : "none")};
  display: flex;
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  gap: ${({ gap }) => (gap ? gap : 0)}px;
  justify-content: ${({ justifyContents }) =>
    justifyContents ? justifyContents : "flex-start"};
  align-items: ${({ alignItems }) => (alignItems ? alignItems : "stretch")};
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
`

type StyleMargin = {
  size: number
  direction: "row" | "column"
}

export const Margin = styled.div<StyleMargin>`
  height: ${({ direction, size }) => (direction === "column" ? size : 0)}px;
  width: ${({ direction, size }) => (direction === "column" ? 0 : size)}px;
`

const TextStyle = {
  CustomH1: styled.h1`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH2: styled.h2`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH3: styled.h3`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH4: styled.h4`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
  CustomH5: styled.h5`
    margin: 0;
    padding: 0;
    color: #616161;
  `,
}
export const CustomH1 = TextStyle.CustomH1
export const CustomH2 = TextStyle.CustomH2
export const CustomH3 = TextStyle.CustomH3
export const CustomH4 = TextStyle.CustomH4
export const CustomH5 = TextStyle.CustomH5
