import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  align-items: center;
  justify-content: center;
`

export const Titulo = styled.Text`
  font-size: 16px;
  text-align: center;
  font-family: 'Roboto-Bold';
  margin: 20px 0 0px 0;
  text-transform: uppercase;
`
export const SubTitulo = styled.Text`
  width: 200px;
  margin: 2px;
  text-align: center;
  align-items: center;
  margin-bottom: 10px;
`
export const Content = styled.View`
  padding-bottom: 100px;
`

export const Select = styled.View`
  border: 1px solid #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 290px;
  height: 40px;
  background-color: #ffffff;
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

export const ContainerExtraOptions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: #dfdfdf;
  padding: 5px;
  padding-left: 20px;
  border-radius: 5px;
`
export const ButtonExtraOptions = styled.TouchableOpacity`
  margin-left: 15px;
`
export const ButtonTextExtraOptions = styled.Text`
  font-size: 16px;
  font-weight: bold;
`
export const ContainerButtonExtraOptions = styled.View`
  flex-direction: row;
  padding: 5px;
`

interface MsgError {
  error: boolean
}

export const BoxMsgError = styled.View<MsgError>`
  background-color: #f8d7da;
  align-items: center;
  padding: 3px;
  border-radius: 5px;
  margin-bottom: 5px;
  position: absolute;
  width: 80%;
  opacity: 0.7;

  ${(props) => {
    return (
      props.error &&
      css`
        background-color: #f8d7da;
      `
    )
  }}
`

export const TextMsgError = styled.Text`
  color: #d44b52;
`
