import styled from 'styled-components/native'
import { responsiveWidth } from 'react-native-responsive-dimensions'

export const Container = styled.View`
  background-color: #f2f2f2;
  align-items: center;
  justify-content: center;
`

export const Titulo = styled.Text`
  font-size: 16px;
  text-align: center;
  font-family: 'Roboto-Bold';
  margin: 20px 0 20px 0;
  text-transform: uppercase;
`
export const Content = styled.View`
  width: ${responsiveWidth(90)}px;
  height: 100%;
  margin-bottom: 50px;
  align-items: center;
`
export const Select = styled.View`
  border: 1px solid #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 290px;
  height: 40px;
  background-color: #ffffff;
`

export const Select2 = styled.View`
  border: 1px solid #ffffff;
  border-radius: 5px;
  justify-content: center;
  margin-bottom: 10px;
  width: 290px;
  height: 40px;
  background-color: #ffffff;
`

export const LabelInside = styled.Text`
  margin-bottom: 3px;
  font-size: 13px;
  align-self: flex-start;
  color: #aaa;
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
  width: ${responsiveWidth(40)}px;
  height: 30px;
  justify-content: center;
  /* margin: 10px 15px 10px; */
  margin-bottom: 15px;
  border-radius: 5px;
`
export const BtnText = styled.Text`
  text-align: center;
  color: #fff;
  font-family: 'Roboto-Bold';
`
export const ButtonVoltar = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: ${responsiveWidth(40)}px;
  height: 30px;
  /* margin: 10px 15px 10px; */
  margin-bottom: 15px;
  justify-content: center;
  border-radius: 5px;
`
