import { responsiveWidth } from 'react-native-responsive-dimensions'
import styled from 'styled-components/native'

export const Objeto = styled.View`
  background-color: #c4c4c4;
  border-radius: 5px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 5px;
  width: ${responsiveWidth(90)}px;
`

export const AvatarObjeto = styled.TouchableOpacity`
  background-color: #fff;
  margin: 0px 5px;
  border-radius: 30px;
`
export const AvatarObjetoOff = styled.View`
  background-color: #fff;
  padding: 20px;
  margin: 0px 5px;
  border-radius: 40px;
`

export const Info = styled.TouchableOpacity`
  width: ${responsiveWidth(80)}px;
  padding: 0px 5px;
`

export const NomeEnvolvido = styled.Text``
export const DadosObjetos = styled.Text``
export const Negrito = styled.Text`
  font-family: 'Roboto-Bold';
`
