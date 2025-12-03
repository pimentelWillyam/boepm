import React from 'react'

import { ScrollView } from 'react-native'
import { Container, Titulo } from './styles'

const Documentos = (props: any) => {
  return (
    <>
      <ScrollView>
        <Container>
          <Titulo>DOCUMENTOS COMPLEMENTARES</Titulo>
        </Container>
      </ScrollView>
    </>
  )
}

export default Documentos
