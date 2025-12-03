import React from 'react'

import {
  Modal,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native'

const ModalDoc: React.FC = () => {
  return (
    <Modal transparent visible>
      <TouchableNativeFeedback>
        <View style={styles.background} />
      </TouchableNativeFeedback>

      <View style={styles.Container}>
        <Text style={styles.Header}>Nova Tarefa</Text>

        <TextInput style={styles.Input} />

        <View style={styles.Buttons}>
          <TouchableOpacity>
            <Text style={styles.Button}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.Button}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableNativeFeedback>
        <View style={styles.background} />
      </TouchableNativeFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  Container: {
    flex: 4,
    backgroundColor: '#FFF',
  },
  Header: {
    backgroundColor: 'blue',
    color: '#FFF',
    textAlign: 'center',
    padding: 15,
    fontSize: 19,
  },
  Input: {
    margin: 15,
    height: 40,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
  },
  Buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  Button: {
    margin: 20,
    marginRight: 30,
    color: 'blue',
  },
})

export default ModalDoc
