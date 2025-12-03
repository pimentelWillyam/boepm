import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'
import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  padding: 5px 5px;
`

export const ContainerDesfecho = styled.View`
  align-items: center;
  background-color: #f2f2f2;
  justify-content: center;
`
export const BtnFinalizar = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: 290px;
  height: 40px;
  justify-content: center;
  margin: 10px 15px 10px;
  border-radius: 5px;
`

export const BtnText = styled.Text`
  text-align: center;
  color: #fff;
  font-family: 'Roboto-Bold';
  font-size: 15px;
`
// ########################## Estilos utilizados na CERTIDAO ##############################

export const Certidao = styled.View`
  background-color: #fff;
  border: 1px solid #eee;
`
export const Header = styled.View`
  margin-top: 5px;
  align-items: center;
  padding: 0px 15px;
`

export const LogoSDS = styled.Image`
  width: ${responsiveWidth(30)}px;
  height: ${responsiveWidth(30)}px;
  margin-bottom: 5px;
`
export const H1 = styled.Text`
  font-size: ${responsiveFontSize(2)}px;
  font-family: 'Roboto-Bold';
`

export const Negrito = styled.Text`
  font-family: 'Roboto-Bold';
  text-align: justify;
`

export const TitleText = styled.Text`
  margin-top: 5px;
`

export const Section = styled.View``
export const SectionTitle = styled.Text`
  margin-top: 5px;
  background-color: #eee;
  padding: 3px 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  font-family: 'Roboto-Bold';
  font-size: 14px;
  color: #555;
`
export const SectionCount = styled.Text`
  color: #888;
`
export const SectionContent = styled.View`
  padding: 5px;
`

export const SectionItem = styled.Text``

export const ItemUsoForca = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #f00;
`

export const Hash = styled.Text`
  font-size: 10px;
`

export const HashError = styled.Text`
  font-size: 11px;
  color: #f00;
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
export const Desfecho = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
  align-items: center;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
`
export const DesfechoContent = styled.View`
  background-color: #f2f2f2;
  padding: 5px;
  align-items: center;
  width: 95%;
  border-radius: 5px;
`
export const BtnEscolherDesfecho = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: 290px;
  height: 40px;
  justify-content: center;
  margin: 10px 15px 10px;
  border-radius: 5px;
`

export const ContainerButtonChangeOcorrencia = styled.View`
  width: 250px;
  flex-direction: row;
  justify-content: space-between;
`

export const ButtonChangeOcorrencia = styled.TouchableOpacity`
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
export const ButtonVoltarChangeOcorrencia = styled.TouchableOpacity`
  width: 100px;
  height: 38px;
  background-color: #dc5b5e;
  border-radius: 10px;

  justify-content: center;
  align-items: center;
`
export const RascunhoText = styled.Text`
  position: absolute;
  font-size: 65px;
  font-weight: bold;
  color: #ff531a;
  transform: rotate(-35deg);
  margin-top: 330px;
`
