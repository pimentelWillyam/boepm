import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Home from '../pages/Home'
import BO from '../pages/Drawer/BO'
import CadastroEfetivo from '../pages/CadastroEfetivo'
import Visualizar from '../pages/Visualizar'
import Documentos from '../pages/Documentos'
import AuthContext from '../contexts/auth'

const AppStack = createStackNavigator()

const AppRoutes: React.FC = () => {
  const { temResponsaveis } = useContext(AuthContext)
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      {!temResponsaveis && (
        <AppStack.Screen name="CadastroEfetivo" component={CadastroEfetivo} />
      )}
      <AppStack.Screen name="Home" component={Home} />
      <AppStack.Screen name="Visualizar" component={Visualizar} />
      <AppStack.Screen name="Documentos" component={Documentos} />
      <AppStack.Screen name="BO" component={BO} />
    </AppStack.Navigator>
  )
}

export default AppRoutes
