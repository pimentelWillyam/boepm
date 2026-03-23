/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
import 'react-native-gesture-handler'
import React, { useEffect } from 'react'

import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import OneSignal from 'react-native-onesignal'
import ImageEditor from '@react-native-community/image-editor'

import { withStallion } from 'react-native-stallion'
import Routes from './routes'
import Config from './config'

import { AuthProvider } from './contexts/auth'

function App() {
  useEffect(() => {
    OneSignal.setAppId(Config.urlEnvironments[Config.ENVIRONMENT].oneSignalKey)
    ImageEditor.toString()
    OneSignal.setNotificationOpenedHandler(_notification => {})
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      const notif = notifReceivedEvent.getNotification()
      notifReceivedEvent.complete(notif)
    })
  }, [])
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#d5d5d5" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  )
}

export default withStallion(App)

// import React from 'react'
// import {View, Text} from 'react-native';

// export default function App() {
//   return (
//     <View>
//       <Text>A Fabrica vai voltar!</Text>
//     </View>
//   );
// }
