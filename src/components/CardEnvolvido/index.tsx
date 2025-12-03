import React, { useRef } from 'react'
import { StyleSheet, Animated, Text } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'

import {
  Negrito,
  Container,
  Info,
  NomeEnvolvido,
  DadosEnvolvido,
} from './styles'

export default function CardEnvolvido({ data, handleRight, handleEditar }) {
  const swipeable = useRef<Swipeable>(null)
  function rightActions() {
    return (
      <RectButton style={styles.rightActions} onPress={handleRight}>
        <Animated.Text style={[styles.text]}>
          <Icon name="trash" size={20} color="#fff" />
        </Animated.Text>
      </RectButton>
    )
  }

  return (
    <Swipeable renderRightActions={rightActions} ref={swipeable}>
      <Container>
        <Info onPress={handleEditar}>
          <NomeEnvolvido>{data.NOME_RAZAO_SOCIAL}</NomeEnvolvido>
          <DadosEnvolvido>
            <Negrito>Condição: </Negrito>
            {data.NM_TIPO_ENVOLVIMENTO_PESSOA}
          </DadosEnvolvido>
          <DadosEnvolvido>
            <Negrito>Nascimento: </Negrito>
            {data.DATA_NASCIMENTO || 'NÃO INFORMADA'}
          </DadosEnvolvido>
        </Info>
      </Container>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  rightActions: {
    backgroundColor: '#f00',
    justifyContent: 'center',
    margin: 5,
    height: 90,
    marginTop: 0,
    borderRadius: 5,
  },
  text: {
    fontSize: 17,
    color: '#fff',
    padding: 20,
  },
})
