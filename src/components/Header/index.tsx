/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { useNavigation } from '@react-navigation/native'

import { Home, ButtonJus, ButtonHome, IconHome } from './styles'

export function HeaderHome(props: any) {
  const navigation = useNavigation()
  function navigationToHome() {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
        },
      ],
    })
  }
  return (
    <Home>
      <ButtonJus onPress={props.drawerHome}>
        <IconHome name="align-justify" />
      </ButtonJus>

      <ButtonHome onPress={() => navigationToHome()}>
        <IconHome name="home" />
      </ButtonHome>
    </Home>
  )
}
