import { StyleSheet, TouchableOpacity } from 'react-native'
import styled, { css } from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions'
import Button from '../../components/Button'

export const Header = styled.View`
  align-items: center;
  /* border: 1px solid green; */
  margin-top: ${responsiveHeight(4)}px;
`

export const Form = styled.View`
  align-items: center;
  justify-content: space-between;
  width: ${responsiveWidth(90)}px;
  /* border: 1px solid red; */
  margin-top: -${responsiveHeight(5)}px;
`

export const Container = styled(LinearGradient).attrs({
  colors: ['#d5d5d5', '#fff'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: ${responsiveHeight(2)}px ${responsiveWidth(2)}px;
`

export const ImageLogo = styled.Image`
  width: ${responsiveWidth(32)}px;
  height: ${responsiveHeight(22)}px;
  resize-mode: contain;
`

export const Titulo = styled.Text`
  /* width: 170px; */
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: ${responsiveFontSize(5)}px;
  font-family: 'Ubuntu-Bold';
`
export const Subtitulo = styled.Text`
  /* font-size: 16px; */
  font-size: ${responsiveFontSize(2.5)}px;
  color: #666;
`
export const Warning = styled.Text`
  font-size: 12px;
  color: #f00;
  margin-bottom: 10px;
`

interface ButtonLoginProps {
  enabled: boolean
}

export const ButtonLogin = styled(Button)<ButtonLoginProps>`
  margin-top: 2px;
  width: ${responsiveWidth(90)}px;
  height: 40px;
  align-items: center;
  justify-content: space-around;
  ${(props) => {
    return (
      props.enabled === false &&
      css`
        /* background-color: #ccc; */
      `
    )
  }}
`

export const ButtonAcessar = styled.TouchableOpacity`
  margin-top: ${responsiveWidth(8)}px;
  align-items: center;
  justify-content: center;
`
export const ButtonTextAcessar = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: ${responsiveFontSize(2)}px;
`

export const UpdateStatus = styled.Text``

export const Footer = styled.View`
  bottom: 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${responsiveWidth(90)}px;
  padding: 0px;
`

export const TextVersao = styled.Text`
  color: #888;
`

export const UpdateButton = styled(TouchableOpacity)``

export const DuvidasButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 75px;
`

export const TextGTI = styled.Text``

const styles = StyleSheet.create({
  input: {
    width: 220,
    height: 34,
    borderWidth: 1,
    borderColor: '#aaa',
  },
})

export default styles
