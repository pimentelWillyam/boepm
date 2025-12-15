/* eslint-disable camelcase */
// { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'

import { createDrawerNavigator } from '@react-navigation/drawer'

import Icon from 'react-native-vector-icons/Feather'

import TranscricaoRegistro from '../../TranscricaoRegistro'
import { EnvolvidosRoute } from '../../Envolvidos'
import { ObjetosRoute } from '../../Objetos'
import DadosComplementares from '../../DadosComplementares'
import Responsaveis from '../../Responsaveis'
import useStore from '../../../store/bo'
import useStoreGlobal from '../../../store/global'

const DrawerBO = createDrawerNavigator()
const BO: React.FC = () => {
  const { bo } = useStoreGlobal()
  const { bos } = useStore()

  return (
    <View style={styles.drawerContent}>
      <DrawerBO.Navigator
        initialRouteName="TranscricaoRegistro"
        backBehavior="order"
        screenOptions={{
          drawerActiveTintColor: '#666',
          drawerActiveBackgroundColor: '#f2f2f2',
          drawerInactiveTintColor: 'grey',
        }}
      >
        <DrawerBO.Screen
          name="Transcrição do Registro"
          component={TranscricaoRegistro}
          options={{
            drawerIcon: () => (
              <Icon
                name="map-pin"
                color="#999"
                size={24}
                style={{
                  marginRight: -25,
                  marginLeft: -5,
                }}
              />
            ),
          }}
        />
        {bo === 0 && (
          <DrawerBO.Screen
            name="Envolvidos"
            component={EnvolvidosRoute}
            options={{
              drawerIcon: () => (
                <Icon
                  name="users"
                  color="#999"
                  size={24}
                  style={{
                    marginRight: -25,
                    marginLeft: -5,
                  }}
                />
              ),
            }}
          />
        )}
        {bo === 0 && (
          <DrawerBO.Screen
            name="Objetos"
            component={ObjetosRoute}
            options={{
              drawerIcon: () => (
                <Icon
                  name="inbox"
                  color="#999"
                  size={24}
                  style={{
                    marginRight: -25,
                    marginLeft: -5,
                  }}
                />
              ),
            }}
          />
        )}
        {bo === 0 && (
          <DrawerBO.Screen
            name="Dados Complementares"
            component={DadosComplementares}
            options={{
              drawerLabel: 'Dados Complementares',
              headerStyle: { padding: 0 },
              drawerIcon: () => (
                <Icon
                  name="file-text"
                  // color="#999"
                  color={bos[bo].DADOS_COMPLEMENTARES ? '#60A917' : '#f00'}
                  size={24}
                  style={{
                    marginRight: -25,
                    marginLeft: -5,
                  }}
                />
              ),
            }}
          />
        )}
        {/* <DrawerBO.Screen
          name="Documentos Complementares"
          component={Documentos}
          options={{
            drawerIcon: () => (
              <Image
                source={ImgPasta02}
                style={{
                  width: 26,
                  height: 26,
                  marginRight: -25,
                  marginLeft: -5,
                }}
              />
            ),
          }}
        /> */}
        {bo === 0 && (
          <DrawerBO.Screen
            name="Responsáveis"
            component={Responsaveis}
            options={{
              drawerLabel: 'Responsáveis',
              drawerIcon: () => (
                <Icon
                  name="user-plus"
                  // color="#999"
                  color={
                    bos[bo].RESPONSAVEIS &&
                    bos[bo].RESPONSAVEIS.find(
                      (u) => u.CD_TIPO_ENVOLVIMENTO === 1,
                    )
                      ? '#60A917'
                      : '#f00'
                  }
                  size={24}
                  style={{
                    marginRight: -25,
                    marginLeft: -2,
                  }}
                />
              ),
            }}
          />
        )}
      </DrawerBO.Navigator>
    </View>
  )
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    width: '100%',
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
})

export default BO
