import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { FlatList } from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'
import { IResponsavel } from '../../interfaces/responsavel'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 10px;
  background-color: #f2f2f2;
`

export const Imagem = styled.Image`
  width: ${responsiveWidth(40)}px;
  height: ${responsiveWidth(40)}px;
  resize-mode: contain;
`

export const Header = styled.View`
  align-items: center;
`

export const Titulo = styled.Text`
  font-size: ${responsiveFontSize(3)}px;
  font-family: 'Roboto-Bold';
  text-align: center;
`

export const SubTitulo = styled.Text`
  margin: 2px;
  margin-bottom: 15px;
  text-align: center;
  align-items: center;
  font-size: ${responsiveFontSize(2)}px;
`

export const ContainerButton = styled.View`
  flex-direction: row;
  align-items: flex-end;
  width: ${responsiveWidth(90)}px;
`

export const ButtonResposavel = styled.TouchableOpacity`
  background-color: #2fc117;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 10px 10px 10px;
  width: ${responsiveWidth(28)}px;
  border-radius: 5px;
  padding: 10px;
`

export const ButtonResposavelText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-family: 'Roboto-Bold';
`

export const IconAdd = styled(Icon)`
  font-size: 20px;
`

export const ButtomContainer = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

export const ButtomSeguir = styled.TouchableOpacity`
  background-color: #2fc117;
  width: 120px;
  height: 30px;
  justify-content: center;
  border-radius: 5px;
  position: absolute;
  right: 10px;
  bottom: 10px;
`

export const ButtonSair = styled.TouchableOpacity`
  align-self: flex-end;
  position: absolute;
  top: 20px;
  right: 20px;
`

export const ButtomSeguirText = styled.Text`
  text-align: center;
  color: #fff;
`

export const ContainerBoxInput = styled.View`
  width: 250px;
  flex-direction: row;
  justify-content: space-between;
`

export const ButtonSetValue = styled.TouchableOpacity`
  width: 100px;
  height: 38px;
  background-color: #2e3763;
  border-radius: 10px;

  justify-content: center;
  align-items: center;

  color: #ffffff;
  font-family: 'Roboto-Bold';
  font-size: 14px;
`
export const ButtonSairBox = styled.TouchableOpacity`
  width: 100px;
  height: 38px;
  background-color: #dc5b5e;
  border-radius: 10px;

  justify-content: center;
  align-items: center;
`

export const Lista = styled(FlatList as new () => FlatList<IResponsavel>)`
  /* border: 1px solid red; */
`
