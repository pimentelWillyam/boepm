import { DeepMap, FieldError } from 'react-hook-form'
import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #f2f2f2;
`
export const Titulo = styled.Text`
  text-align: center;
  font-size: 16px;
  font-family: 'Roboto-Bold';
`
export const SubTitulo = styled.Text`
  text-align: center;
  font-size: 14px;
`

export const ImgTopoView = styled.View`
  align-items: center;
`

export const ImgTopo = styled.Image`
  width: 80px;
  height: 80px;
`

interface InputPros {
  error: DeepMap<Record<string, unknown>, FieldError>
}
export const Input = styled.TextInput<InputPros>`
  background-color: #ffffff;
  width: 283px;
  height: 255px;
  margin: 20px;

  ${(props) => {
    return (
      props.error &&
      css`
        border: 1px solid #f00;
      `
    )
  }}
`

export const InputText = styled.TextInput``

export const ButtomContainer = styled.View`
  background-color: #f2f2f2;
  position: absolute;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  right: 0;
`

export const ButtonVoltar = styled.TouchableOpacity`
  background-color: #2f80ed;
  width: 120px;
  height: 30px;
  margin: 20px;
  justify-content: center;
  border-radius: 5px;
`

export const ButtonVoltarText = styled.Text`
  text-align: center;
  color: #fff;
`

export const ButtonSeguir = styled.TouchableOpacity`
  background-color: #2fc117;
  width: 120px;
  height: 30px;
  justify-content: center;
  margin: 20px;
  border-radius: 5px;
`

export const ButtonSeguirText = styled.Text`
  text-align: center;
  color: #fff;
`
