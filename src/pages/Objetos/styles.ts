import styled from 'styled-components/native'
import IconFeather from 'react-native-vector-icons/Feather'
import IconEvilIcons from 'react-native-vector-icons/EvilIcons'

import { FlatList } from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'
import Button from '../../components/Button'
import { IObjeto } from '../../interfaces/bo'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #f2f2f2;
  margin-bottom: 50px;
`

export const Titulo = styled.Text`
  text-align: center;
  font-size: ${responsiveFontSize(2.5)}px;
  font-family: 'Roboto-Bold';
`
export const SubTitulo = styled.Text`
  text-align: center;
  font-size: ${responsiveFontSize(1.8)}px;
`

export const ImgTopoView = styled.View`
  align-items: center;
`

export const ImgTopo = styled.Image`
  width: ${responsiveWidth(20)}px;
  height: ${responsiveWidth(20)}px;
`

export const ButtonObjeto = styled.TouchableOpacity`
  background-color: #2fc117;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 20px;
  margin-top: 20px;
  width: ${responsiveWidth(90)}px;
  border-radius: 5px;
  padding: 10px;
`

export const ButtonObjetoText = styled.Text`
  text-align: center;
  font-family: 'Roboto-Bold';
`

export const IconAdd = styled(IconFeather)`
  font-size: 20px;
  left: 50px;
`

export const ButtomContainer = styled.View`
  align-items: center;
  margin: 20px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 150px;
`

export const ButtonVoltar = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: 120px;
  height: 30px;
  margin: 20px;
  justify-content: center;
`

export const ButtonVoltarText = styled.Text`
  text-align: center;
  color: #fff;
`

export const ButtonSeguir = styled.TouchableOpacity`
  background-color: #2fc117;
  width: 125px;
  height: 30px;
  justify-content: center;
  margin: 10px 15px 10px;
  border-radius: 5px;
`

export const ButtonSeguirText = styled.Text`
  text-align: center;
  color: #fff;
`
export const ComboButton = styled.View`
  background-color: #f2f2f2;
  position: absolute;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  left: 0;
  bottom: 0;
  right: 0;
`
export const ButtonOne = styled(Button)`
  background-color: #2f80ed;
  width: 125px;
  height: 30px;
  margin: 10px 15px 10px;
`
export const ButtonTwo = styled(Button)`
  background-color: #2fc117;
  width: 125px;
  height: 30px;
  margin: 10px 15px 10px;
`

export const Lista = styled(FlatList as new () => FlatList<IObjeto>)``

export const ModalHeader = styled.View`
  padding: 10px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`
export const ModalHeaderText = styled.Text`
  font-size: 16px;
  color: #666;
`
export const ModalItem = styled.TouchableOpacity`
  flex-direction: row;
  padding: 10px 20px;
`
export const ModalItemText = styled.Text`
  padding-left: 10px;
`
