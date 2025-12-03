import styled from 'styled-components/native'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'

export const Container = styled.View`
  background-color: #c4c4c4;
  width: ${responsiveWidth(90)}px;
  height: 90px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 5px;
`

export const Info = styled.TouchableOpacity`
  width: 240px;
`

export const NomeEnvolvido = styled.Text`
  font-size: ${responsiveFontSize(2)}px;
`

export const Negrito = styled.Text`
  font-family: 'Roboto-Bold';
`

export const DadosEnvolvido = styled.Text``
