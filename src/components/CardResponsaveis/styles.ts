import styled from 'styled-components/native'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { responsiveWidth } from 'react-native-responsive-dimensions'

export const ListResponsavel = styled.View`
  align-items: center;
  width: ${responsiveWidth(90)}px;
  margin: 5px;
  margin-right: 0px;
  padding: 10px;
  background: #c4c4c4;
  flex-direction: row;
  border-radius: 5px;
`

export const ResponsavelText = styled.Text`
  margin-left: 10px;
`

export const Avatar = styled(IconMaterial)`
  font-size: 50px;
`

export const NascimentoText = styled.Text`
  font-size: 14px;
  font-family: 'Roboto-Bold';
`
export const MatriculaText = styled.Text`
  font-size: 14px;
  font-family: 'Roboto-Bold';
`
