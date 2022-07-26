import { authService } from "@FireBase"
import Header from "components/layout/Header"
import styled from "styled-components"
import { CustomH2, CustomH3, FlexBox, Margin } from "ui"

type Props = {
  imageDataLength: number
  privateImageDataLength: number
}

const Style = {
  ProfileHeader: styled.div`
    width: 975px;
    height: 194px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    align-items: center;
    padding-bottom: 44px;
    padding-top: 10px;
  `,
  ProfileImage: styled.div`
    width: 150px;
    height: 150px;
    border-radius: 200px;
    border: 1px solid darkgrey;
  `,
  ProfileInfo: styled.div`
    width: 600px;
    height: 150px;
    display: flex;
    flex-direction: column;
    padding-top: 15px;
  `,
  ProfileEditButton: styled.div`
    width: 107px;
    height: 30px;
    -webkit-appearance: none;
    border: 1px solid lightgrey;
    border-radius: 10px;
    background-color: white;
    color: #616161;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
  `,
}

export default function ProfileHeader({
  imageDataLength,
  privateImageDataLength,
}: Props) {
  return (
    <>
      <Margin direction="column" size={30} />
      <>
        <Style.ProfileHeader>
          <Margin direction="row" size={80} />
          <Style.ProfileImage />
          <Margin direction="row" size={80} />
          <Style.ProfileInfo>
            <FlexBox alignItems="center">
              <CustomH2>{authService.currentUser?.displayName}</CustomH2>
              <Margin direction="row" size={20} />
              <Style.ProfileEditButton>프로필 편집</Style.ProfileEditButton>
            </FlexBox>
            <Margin direction="column" size={15} />
            <FlexBox>
              <CustomH3>이메일: {authService.currentUser?.email}</CustomH3>
            </FlexBox>
            <Margin direction="column" size={15} />
            <FlexBox gap={15}>
              <CustomH3>게시물: {imageDataLength}</CustomH3>
              <CustomH3>비공개 게시물: {privateImageDataLength}</CustomH3>
            </FlexBox>
          </Style.ProfileInfo>
        </Style.ProfileHeader>
        <Margin direction="column" size={44} />
      </>
    </>
  )
}
