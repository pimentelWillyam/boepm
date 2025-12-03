import styled, { css } from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { TouchableOpacity } from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions'

export const Container = styled.View`
  width: ${responsiveWidth(90)}px;
  height: 125px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid #bbb;
  background-color: #fff;
`

export const ContainerInfo = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  flex: 1;
`

export const Info = styled(TouchableOpacity)`
  width: 90%;
`

export const ItemText = styled.Text`
  /* font-size: 12px; */
  font-size: ${responsiveFontSize(1.7)}px;
`
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  width: 100%;
  padding: 0px 10px 0px 5px;
`

export const DateText = styled.Text`
  font-size: ${responsiveFontSize(1.5)}px;
  margin-left: 5px;
`
export const Negrito = styled.Text`
  font-family: 'Roboto-Bold';
`

export const DisparaContateSuporte = styled(TouchableOpacity)``

export const Mike = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: ${responsiveFontSize(1.8)}px;
  color: #333;
`

export const DataECloud = styled.View`
  flex-direction: row;
  align-items: center;
`

interface PropsStatus {
  status: number
}

export const Status = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 3px 3px 5px;
`

export const BODP = styled.Text``

export const StatusText = styled.Text<PropsStatus>`
  padding: 2px 5px;
  font-size: ${responsiveFontSize(1.5)}px;
  font-weight: bold;
  border-radius: 8px;

  ${(props) => {
    if (props.status === 0)
      return css`
        background-color: #fbefef;
        color: #dc5b5e;
      `
    if (props.status === 1)
      return css`
        background-color: #ecf3fe;
        color: #3e88fa;
      `
    if (props.status === 2 || props.status === 4)
      return css`
        background-color: #e6ffcc;
        color: #00cc44;
      `
    return css`
      background-color: #ddd;
      color: #666;
    `
  }}
`

export const ContainerButtonEditar = styled.View`
  width: 30px;
`
export const ButtonIcon = styled.TouchableOpacity`
  text-align: center;
  align-items: flex-start;
`

export const IconMoreOption = styled(Icon)`
  font-size: ${responsiveFontSize(3.8)}px;
  color: #888;
`

export const TextDP = styled.Text`
  font-weight: bold;
  margin-left: 8px;
`

export const ComplementadoText = styled.Text`
  position: absolute;
  font-size: 35px;
  font-weight: bold;
  color: #ff531a;
  transform: rotate(-15deg);
`
