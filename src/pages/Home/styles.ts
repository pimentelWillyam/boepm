import styled from 'styled-components/native'

import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'
import { FlatList, TouchableOpacity } from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import BO from '../../interfaces/bo'

export const Container = styled(LinearGradient).attrs({
  colors: ['#dfdfdf', '#fff'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  align-items: center;
`

export const HeaderContent = styled.View`
  align-items: center;
`

// export const Container = styled.View`
//   flex: 1;
//   align-items: center;
//   flex-direction: column;
//   background-color: #f2f2f2;
// `

export const Logo = styled.Image`
  width: ${responsiveWidth(35)}px;
  height: ${responsiveWidth(40)}px;

  resize-mode: contain;
  margin-top: -20px;
`

export const Titulo = styled.View`
  align-items: center;
  margin-top: 5px;
`

export const Nome = styled.Text`
  font-size: ${responsiveFontSize(2.5)}px;
  font-family: 'Roboto-Bold';
  text-align: center;
`

export const Orgao = styled.Text`
  font-size: ${responsiveFontSize(1.8)}px;
  font-weight: bold;
  color: #333333;
  font-family: 'Roboto-Regular';
`

export const Cargo = styled.Text`
  font-size: ${responsiveFontSize(1.8)}px;
  color: #333333;
  font-family: 'Roboto-Regular';
`

export const Unidade = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ButtonStats = styled.TouchableOpacity`
  margin-left: 5px;
`

export const ButtonStatsText = styled.Text`
  color: white;
`

export const BtnCriarBO = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 48px;
`

export const IconContainer = styled.Image``

export const ButtonSair = styled.TouchableOpacity`
  align-self: flex-end;
  padding-right: 5px;
  padding-top: 10px;
`

export const FotoPage = styled.Image`
  align-items: center;
  margin-top: 16px;
  width: 70px;
  height: 70px;
`

export const Desfecho = styled.View`
  /* background: #ff4477; */
  flex-direction: row;
  justify-content: space-around;
  width: ${responsiveWidth(90)}px;
  margin-top: 10px;
  margin-bottom: 24px;
`
export const Local = styled.View`
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 12px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 5px;
`
export const DP = styled.View`
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
`
export const TCO = styled.View`
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 5px;
`
export const Qtd = styled.Text`
  text-align: center;
  font-size: ${responsiveFontSize(3)}px;
  color: #444;
  font-family: 'Roboto-Bold';
`
export const TextDesfecho = styled.Text`
  font-size: ${responsiveFontSize(1.6)}px;
  text-align: center;
  color: #222;
`

export const BtnEmail = styled.TouchableOpacity`
  background-color: #2f80ed;
  margin-bottom: 10px;
  height: 48px;
  width: 270px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
export const IconMail = styled(IconMaterial)`
  font-size: 30px;
  color: #ffffff;
`

export const BtnVisualizarBO = styled.TouchableOpacity`
  background-color: #969faa;
  margin-bottom: 10px;
  height: 48px;
  width: 270px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

export const IconVisualizarBO = styled(IconMaterial)`
  font-size: 30px;
  color: #ffffff;
`
export const BtnTextModal = styled.Text`
  color: #fff;
  font-family: 'Roboto-Bold';
  text-align: center;

  padding: 10px;
  font-size: 18px;
`

export const ButtomContainer = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;

  align-items: center;
  background-color: #f2f2f2;
  flex-direction: row;
  justify-content: center;
`
export const ButtonVoltar = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: 290px;
  height: 40px;
  justify-content: center;
  margin: 10px 15px 10px;
  border-radius: 5px;
`

export const Lista = styled(FlatList as new () => FlatList<BO>)`
  padding: 5px;
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

export const ModalHeader = styled.View`
  padding: 10px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`
export const ModalHeaderText = styled.Text`
  font-size: 14px;
  color: #666;
`
export const ModalItem = styled.TouchableOpacity`
  flex-direction: row;
  padding: 10px 20px;
`
export const ModalItemText = styled.Text`
  padding-left: 10px;
`
export const ModalItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

export const DuvidasButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 75px;
  position: absolute;
  align-self: flex-start;
  padding-top: 10px;
`

export const TextGTI = styled.Text``
