import styled from 'styled-components/native'
import IconFeather from 'react-native-vector-icons/Feather'
import { FlatList } from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'
import { IEnvolvido } from '../../interfaces/bo'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #f2f2f2;
  margin-bottom: 50px;
`

export const ImgEnvolvido = styled.Image`
  width: 77px;
  height: 77px;
`

export const ImgView = styled.View`
  align-items: center;
`

export const Titulo = styled.Text`
  font-size: ${responsiveFontSize(2.5)}px;
  font-family: 'Roboto-Bold';
  text-align: center;
`
export const SubTitulo = styled.Text`
  width: ${responsiveWidth(90)}px;
  margin: 2px;
  text-align: center;
  align-items: center;
`

export const ButtonEnv = styled.TouchableOpacity`
  background-color: #2fc117;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  margin: 30px 0 10px;
  width: ${responsiveWidth(90)}px;
  border-radius: 5px;
  padding: 10px;
`
export const ButtonText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-family: 'Roboto-Bold';
  right: 20px;
`

export const IconAdd = styled(IconFeather)`
  font-size: 20px;
  left: 20px;
`

export const Negrito = styled.Text`
  font-family: 'Roboto-Bold';
`

export const ButtomContainer = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
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
export const ButtonVoltar = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: 125px;
  height: 30px;
  margin: 10px 15px 10px;
  justify-content: center;
  border-radius: 5px;
`

export const ButtomVoltarText = styled.Text`
  text-align: center;
  color: #fff;
`

export const ButtomSeguirText = styled.Text`
  text-align: center;
  color: #fff;
`

export const Lista = styled(FlatList as new () => FlatList<IEnvolvido>)``
