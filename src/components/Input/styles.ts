import { DeepMap, FieldError } from 'react-hook-form'
import styled, { css } from 'styled-components/native'
import { TextInputMask } from 'react-native-masked-text'
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions'

export const Container = styled.View`
  margin-top: 0px;
`

interface InputInside {
  error: DeepMap<Record<string, unknown>, FieldError>
}

export const LabelInside = styled.Text`
  margin-bottom: 3px;
  font-size: ${responsiveFontSize(1.8)}px;
  align-self: flex-start;
  color: #aaa;
`

export const InputInside = styled(TextInputMask)<InputInside>`
  width: ${responsiveWidth(90)}px;
  height: ${responsiveWidth(11)}px;
  padding: 0 15px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #dfdfdf;
  margin-bottom: 10px;
  ${props => {
    return (
      props.error &&
      css`
        border: 1px solid #f00;
      `
    )
  }}
`
