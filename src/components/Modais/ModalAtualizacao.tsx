import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'

import { useStallionUpdate, sync, restart} from 'react-native-stallion'

export function ModalAtualizacao() {
  const { isRestartRequired, currentlyRunningBundle, newReleaseBundle } =
    useStallionUpdate()

  const [visivel, setVisivel] = useState(false)
  const [carregando, setCarregando] = useState(false)



  useEffect(() => {
    if (newReleaseBundle) {
      setVisivel(true)

    }
  }, [newReleaseBundle])

  const handleAtualizar = async () => {
    if (!newReleaseBundle) return
    setCarregando(true)
    try {
      sync()
      Alert.alert('Atualizado', 'O aplicativo foi atualizado com sucesso!')
      if (isRestartRequired) {
        
        Alert.alert('Reiniciando o aplicativo para aplicar as atualizações.')
        restart()
      }
      setCarregando(false)
      setVisivel(false)
    } catch (err) {
      setCarregando(false)
      Alert.alert('Erro', 'Falha ao atualizar o aplicativo.')
    }
  }

  // ======================== Fechar modal ========================
  const handleFechar = () => {
    if (!currentlyRunningBundle || currentlyRunningBundle.version === newReleaseBundle?.version) {
      setVisivel(false)
    } else {
      Alert.alert(
        'Atualização obrigatória',
        'Você precisa atualizar para continuar usando o app.',
      )
    }
  }

  // ======================== Render ========================
  if (!newReleaseBundle) return null // não renderiza se não houver update

  const { releaseNote } = newReleaseBundle

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={estilos.sobreposicao}>
        <View style={estilos.container}>
          <Text style={estilos.titulo}>Nova versão disponível!</Text>
          <Text style={estilos.descricao}>
            {releaseNote || 'Uma nova versão do aplicativo está disponível.'}
          </Text>

          {carregando ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={estilos.acoes}>
              <TouchableOpacity
                style={[estilos.botao, estilos.primario]}
                onPress={handleAtualizar}
              >
                <Text style={estilos.textoPrimario}>Atualizar agora</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[estilos.botao, estilos.secundario]}
                onPress={handleFechar}
              >
                <Text style={estilos.textoSecundario}>Depois</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const estilos = StyleSheet.create({
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
