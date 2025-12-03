import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Login from '../pages/Login'

const AuthStack = createStackNavigator()

const AuthRoutes = (): JSX.Element => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' },
    }}
  >
    <AuthStack.Screen name="Login" component={Login} />
  </AuthStack.Navigator>
)

export default AuthRoutes
