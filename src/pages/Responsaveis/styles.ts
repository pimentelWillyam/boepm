import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { FlatList } from 'react-native'
import { IResponsavel } from '../../interfaces/responsavel'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 10px;
`

export const ContainerForm = styled.View`
  margin-top: 8px;
`

export const ImgResposavel = styled.Image`
  width: 80px;
  height: 80px;
`

export const ImgView = styled.View`
  align-items: center;
`

export const Titulo = styled.Text`
  font-size: 16px;
  font-family: 'Roboto-Bold';
  text-align: center;
`

export const SubTitulo = styled.Text`
  margin: 2px;
  text-align: center;
  align-items: center;
`

export const ContainerButton = styled.View`
  flex-direction: row;
  align-items: flex-end;
`

export const ButtonResposavel = styled.TouchableOpacity`
  background-color: #2fc117;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 10px 10px 10px;
  width: 110px;
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
  background-color: #f2f2f2;
  /* position: absolute; */
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  right: 0;
`
export const ButtomVoltar = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: 120px;
  height: 30px;
  margin: 20px;
  justify-content: center;
  border-radius: 5px;
`

export const ButtomSeguir = styled.TouchableOpacity`
  background-color: #2fc117;
  width: 120px;
  height: 30px;
  justify-content: center;
  margin: 20px;
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

export const Lista = styled(FlatList as new () => FlatList<IResponsavel>)``
