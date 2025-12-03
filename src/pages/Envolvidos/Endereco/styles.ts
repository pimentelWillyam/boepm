import styled from 'styled-components/native'
import Button from '../../components/Button'

export const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  align-items: center;
  justify-content: center;
`

export const Titulo = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 16px;
  margin: 5px 0 2px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`

export const SubTitulo = styled.Text`
  opacity: 0.5;
  width: 220px;
  font-size: 14px;
  text-align: center;
  color: #969faa;
  font-family: 'Roboto-Bold';
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
`

export const Negrito = styled.Text`
  color: #000000;
`

export const ScrollViewContent = styled.ScrollView``

export const Select = styled.View`
  border: 1px solid #ffffff;
  border-radius: 5px;
  justify-content: center;

  margin-bottom: 10px;
  width: 290px;
  height: 40px;
  background-color: #ffffff;
`

export const ButtomContainer = styled.View`
  margin-top: 10px;
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
export const ModalHeader = styled.View`
  padding: 5px;
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
  padding: 10px 25px 10px 10px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`
export const ModalItemText = styled.Text`
  padding-left: 10px;
  font-size: 13px;
`
