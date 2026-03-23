import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'

import { useStallionUpdate, sync, restart } from 'react-native-stallion'

export function ModalAtualizacao() {
  const { newReleaseBundle, currentlyRunningBundle, isRestartRequired } =
    useStallionUpdate()

  const [visivel, setVisivel] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const jaPerguntou = useRef(false)
  const jaSincronizou = useRef(false)

  useEffect(() => {
    if (newReleaseBundle && currentlyRunningBundle && !jaPerguntou.current) {
      const novaData = new Date(newReleaseBundle.createdAt).getTime()
      const atualData = new Date(currentlyRunningBundle.createdAt).getTime()

      if (novaData > atualData) {
        jaPerguntou.current = true
        setVisivel(true)
      }
    }
  }, [newReleaseBundle, currentlyRunningBundle])

  const handleAtualizar = async () => {
    if (carregando || jaSincronizou.current) return

    jaSincronizou.current = true
    setCarregando(true)

    try {
      await sync()
      Alert.alert('Atualizado', 'O aplicativo foi atualizado com sucesso!')
    } catch {
      Alert.alert('Erro', 'Falha ao atualizar o aplicativo.')
      jaSincronizou.current = false
      setCarregando(false)
      return
    }

    setCarregando(false)
    setVisivel(false)
  }

  useEffect(() => {
    if (isRestartRequired) {
      setTimeout(() => restart(), 300)
    }
  }, [isRestartRequired])

  const handleDepois = () => {
    setVisivel(false)
  }

  if (!newReleaseBundle || !currentlyRunningBundle) return null

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.sobreposicao}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Nova versão disponível</Text>

          <Text style={styles.descricao}>
            {newReleaseBundle.releaseNote ||
              'Uma atualização está disponível. Deseja atualizar agora?'}
          </Text>

          {carregando ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={styles.acoes}>
              <TouchableOpacity
                style={[styles.botao, styles.primario]}
                onPress={handleAtualizar}
              >
                <Text style={styles.textoPrimario}>Atualizar agora</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.secundario]}
                onPress={handleDepois}
              >
                <Text style={styles.textoSecundario}>Depois</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  sobreposicao: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descricao: {
    fontSize: 15,
    marginBottom: 20,
    color: '#555',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  botao: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  primario: {
    backgroundColor: '#1E88E5',
  },
  secundario: {
    backgroundColor: '#E0E0E0',
  },
  textoPrimario: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoSecundario: {
    color: '#333',
  },
})
