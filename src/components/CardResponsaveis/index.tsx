import React from 'react'
import { View, Text, StyleSheet, Animated, Alert } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import {
  ListResponsavel,
  ResponsavelText,
  Avatar,
  MatriculaText,
  NascimentoText,
} from './styles'

function envolvimento(tipo: number): string {
  if (tipo === 0) return 'Condutor'
  if (tipo === 1) return 'Patrulheiro'
  return 'Apoio'
}

export default function ItemCard({ data, handleRight }) {
  function rightActions() {
    // const scale = dragX.interpolate({
    //   inputRange: [0, 100],
    //   outputRange: [0, 1],
    // })

    return (
      data.CD_TIPO_ENVOLVIMENTO !== 0 && (
        <RectButton style={styles.rightActions} onPress={handleRight}>
          <Animated.Text style={[styles.text]}>
            <Icon name="trash" size={20} color="#fff" />
          </Animated.Text>
        </RectButton>
      )
    )
  }
  return (
    <Swipeable renderRightActions={rightActions}>
      <ListResponsavel>
        <Avatar name="person" />
        <ResponsavelText>
          {data.NOME_COMPLETO}
          {'\n'}
          <MatriculaText>
            Matricula:
            {data.MATRICULA}
            {'\n'}
            <NascimentoText>
              Graduação:
              {data.CARGO}
              {'\n'}
            </NascimentoText>
            <NascimentoText>
              OME:
              {data.ORGANIZACAO_DISPOSICAO}
              {'\n'}
            </NascimentoText>
            <NascimentoText>
              {envolvimento(data.CD_TIPO_ENVOLVIMENTO)}
            </NascimentoText>
          </MatriculaText>
        </ResponsavelText>
      </ListResponsavel>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  rightActions: {
    backgroundColor: '#f00',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 17,
    color: '#fff',
    padding: 20,
  },
})
