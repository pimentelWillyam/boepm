import styled, { css } from 'styled-components/native'

import Icon from 'react-native-vector-icons/Feather'
import { CheckBox } from 'react-native-elements'
import { DeepMap, FieldError } from 'react-hook-form'
import { ViewProps } from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const Img = styled.Image`
  width: ${responsiveWidth(30)}px;
  height: ${responsiveWidth(30)}px;
`

export const Titulo = styled.Text`
  margin-top: 4px;
  font-family: 'Roboto-Bold';
  font-size: ${responsiveFontSize(2.2)}px;
`
export const Texto = styled.Text`
  font-family: 'Roboto-Bold';
`

export const SubTitulo = styled.Text`
  width: ${responsiveWidth(90)}px;
  text-align: center;
  margin: 10px;
  margin-top: 2px;
  margin-bottom: 20px;
  font-size: ${responsiveFontSize(1.8)}px;
  font-family: 'Roboto-Thin';
`

interface SelectProps extends ViewProps {
  error: DeepMap<Record<string, unknown>, FieldError>
}

export const Select = styled.View<SelectProps>`
  border: 1px solid #fff;
  border-radius: 5px;
  justify-content: center;

  margin-bottom: 10px;
  width: 290px;
  height: 40px;
  background-color: #ffffff;
  ${props => {
    return props.error
      ? css`
          border-color: #f00;
        `
      : css`
          border-color: #fff;
        `
  }}
`

export const ButtomContainer = styled.View`
  /* position: absolute;
  left: 0;
  bottom: 0;
  right: 0; */
  align-items: center;
  background-color: #f2f2f2;
  flex-direction: row;
  justify-content: space-between;
`
export const ButtonSeguir = styled.TouchableOpacity`
  background-color: #2fc117;
  width: 125px;
  height: 30px;
  justify-content: center;
  margin: 10px 15px 10px;
  border-radius: 5px;
`
export const BtnText = styled.Text`
  text-align: center;
  color: #fff;
  font-family: 'Roboto-Bold';
`

export const CheckAltoria = styled(CheckBox)`
  height: 40px;
  width: 290px;
  align-content: center;
  flex-direction: row;
  justify-content: center;
  background-color: #fff;
  border-radius: 5px;
`
export const CheckCrime = styled(CheckBox)`
  height: 40px;
  width: 290px;
  align-content: center;
  flex-direction: row;
  justify-content: center;
  background-color: #fff;
  border-radius: 5px;
`
