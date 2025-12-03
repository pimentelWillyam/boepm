import styled from 'styled-components/native'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'
import { RectButton } from 'react-native-gesture-handler'

export const Container = styled(RectButton)`
  width: ${responsiveWidth(90)}px;
  height: 38px;
  background-color: #354687;
  border-radius: 8px;

  justify-content: center;
  align-items: center;
`

export const ButtonText = styled.Text`
  color: #ffffff;
  font-family: 'Roboto-Bold';
  font-size: ${responsiveFontSize(2.2)}px;
`
