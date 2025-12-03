import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Animated, Image, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import { IObjeto } from '../../interfaces/bo'
import {
  Objeto,
  AvatarObjeto,
  AvatarObjetoOff,
  Info,
  NomeEnvolvido,
  DadosObjetos,
  Negrito,
} from './styles'

interface Params {
  data: IObjeto
  handleRight(): void
  handleEditar(): void
}

export default function CardObjeto({
  data,
  handleRight,
  handleLeft,
  handleEditar,
  getFoto,
}): JSX.Element {
  const [permiteFoto, setPermiteFoto] = useState(false)
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

  const closeModal = () => {
    swipeable.current?.close()
    handleLeft()
  }

  function leftActions() {
    return (
      <RectButton style={styles.leftActions} onPress={closeModal}>
        <Animated.Text style={[styles.text]}>
          <Icon name="user" size={20} color="#fff" />
        </Animated.Text>
      </RectButton>
    )
  }

  useEffect(() => {
    if (
      data.ID_TIPO_OBJETO === '3' ||
      data.ID_TIPO_OBJETO === '4' ||
      data.ID_TIPO_OBJETO === '5' ||
      data.ID_TIPO_OBJETO === '6' ||
      data.ID_TIPO_OBJETO === '7' ||
      data.ID_TIPO_OBJETO === '8' ||
      data.ID_TIPO_OBJETO === '9' ||
      data.ID_TIPO_OBJETO === '22'
    )
      setPermiteFoto(true)
  }, [])
  return (
    <Swipeable
      renderRightActions={rightActions}
      renderLeftActions={leftActions}
      ref={swipeable}
    >
      <Objeto>
        {permiteFoto ? (
          <AvatarObjeto onPress={getFoto}>
            {data.FOTO ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${data.FOTO.FOTO}` }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="camera" size={20} color="#0f0" />
              </View>
            )}
          </AvatarObjeto>
        ) : (
          <AvatarObjetoOff>
            <Icon name="camera-off" size={20} color="#aaa" />
          </AvatarObjetoOff>
        )}
        <Info onPress={handleEditar}>
          <NomeEnvolvido>{data.NOME_ENVOLVIDO || 'DESCONHECIDO'}</NomeEnvolvido>
          <DadosObjetos>
            <Negrito>Tipo: </Negrito>
            {data.NM_TIPO_OBJETO}
          </DadosObjetos>
          <DadosObjetos>
            <Negrito>Categoria: </Negrito>
            {data.NM_CATEGORIA}
          </DadosObjetos>
          <DadosObjetos>
            <Negrito>Quantidade: </Negrito>
            {data.QTD_OBJETO}
          </DadosObjetos>
        </Info>
      </Objeto>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  rightActions: {
    backgroundColor: '#f00',
    justifyContent: 'center',
    margin: 5,
    height: 95,
    marginTop: 0,
    borderRadius: 5,
  },
  leftActions: {
    backgroundColor: '#999',
    justifyContent: 'center',
    margin: 5,
    height: 95,
    marginTop: 0,
    borderRadius: 5,
  },
  text: {
    fontSize: 17,
    color: '#fff',
    padding: 20,
  },
})
