import styled from 'styled-components/native'
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions'
import FeatherIcon from 'react-native-vector-icons/Feather'

export const Container = styled.View`
  width: ${responsiveWidth(90)}px;
  height: ${responsiveWidth(14)}px;
  padding: 0 15px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 10px;

  flex-direction: row;
  align-items: center;
  border: 1px solid #dfdfdf;
`

export const TextInput = styled.TextInput`
  flex: 1;
  color: #000000;
  font-size: ${responsiveFontSize(2)}px;
  font-family: 'Roboto-Light';
`

export const Icon = styled(FeatherIcon)`
  margin-right: 8px;
`
