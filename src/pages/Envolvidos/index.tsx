/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable camelcase */
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Alert, Text } from 'react-native'

import AdicionarEnvolvido from './AdicionarEnvolvido'

import { HeaderHome } from '../../components/Header'
import CardEnvolvido from '../../components/CardEnvolvido'
import ImgEnv from '../../assets/images/envolvidos.png'

import {
  Container,
  ImgEnvolvido,
  ImgView,
  Titulo,
  SubTitulo,
  ButtonEnv,
  ButtonText,
  IconAdd,
  ButtomContainer,
  Negrito,
  ButtonVoltar,
  ButtonSeguir,
  BtnText,
  Lista,
} from './styles'
import { IEnvolvido } from '../../interfaces/bo'
import ModusOperandi from './ModusOperandi'
import DadosProfissionais from './DadosProfissionais'
import Endereco from './Endereco'
import Caracteristicas from './Caracteristicas'
import useStore from '../../store/bo'
import useStoreGlobal from '../../store/global'

const EnvolvidosStack = createStackNavigator()

function Envolvidos(props: any) {
  const navigation = useNavigation()
  const { bo } = useStoreGlobal()
  const { editar, bos } = useStore()

  const deleteEnvolvido = async (envolvido: IEnvolvido) => {
    Alert.alert(
      'Excluir Envolvido?',
      'Essa ação não pode ser desfeita. Tem certeza?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            if (bo === 0) {
              editar({
                ...bos[bo],
                ENVOLVIDOS: bos[bo].ENVOLVIDOS.filter(
                  (e) => e.ID_ENVOLVIDO !== envolvido.ID_ENVOLVIDO,
                ),
                OBJETOS: [
                  ...bos[bo].OBJETOS.map((o) => {
                    if (o.ID_ENVOLVIDO === envolvido.ID_ENVOLVIDO) {
                      return {
                        ...o,
                        ID_ENVOLVIDO: '',
                        NOME_ENVOLVIDO: '',
                      }
                    }
                    return o
                  }),
                ],
              })
            }
          },
        },
      ],
    )
  }

  const editarEnvolvido = async (envolvido: IEnvolvido) => {
    navigation.navigate('AdicionarEnvolvido', {
      envolvido,
      action: 'editar',
    })
  }

  const adicionarEnvolvido = () => {
    navigation.navigate('AdicionarEnvolvido', {
      envolvido: {},
      action: 'adicionar',
    })
  }

  return (
    <>
      <HeaderHome
        drawerHome={() => {
          props.navigation.openDrawer()
        }}
      />
      <Container>
        <ImgView>
          <ImgEnvolvido source={ImgEnv} />
        </ImgView>
        <Titulo>ENVOLVIDOS</Titulo>
        <SubTitulo>
          Adicione aqui os Envolvidos nesta
          <Negrito> Ocorrência.</Negrito>
        </SubTitulo>

        <ButtonEnv onPress={() => adicionarEnvolvido()}>
          <ButtonText>Adicionar Envolvido</ButtonText>
          <IconAdd name="plus-circle" />
        </ButtonEnv>
        <Lista
          data={bo === 0 ? bos[0].ENVOLVIDOS : []}
          ListEmptyComponent={() => <Text>Nenhum Envolvido adicionado!</Text>}
          keyExtractor={(env) => String(env.ID_ENVOLVIDO)}
          renderItem={({ item: envolvido }) => {
            return (
              <CardEnvolvido
                data={envolvido}
                key={envolvido.ID_ENVOLVIDO}
                handleRight={() => {
                  deleteEnvolvido(envolvido)
                }}
                handleEditar={() => {
                  editarEnvolvido(envolvido)
                }}
              />
            )
          }}
        />
      </Container>
      <ButtomContainer>
        <ButtonVoltar onPress={() => navigation.goBack()}>
          <BtnText>Voltar</BtnText>
        </ButtonVoltar>
        <ButtonSeguir onPress={() => navigation.navigate('Objetos')}>
          <BtnText>Prosseguir</BtnText>
        </ButtonSeguir>
      </ButtomContainer>
    </>
  )
}

const EnvolvidosRoute = (): JSX.Element => (
  <EnvolvidosStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#F2F2F2' },
    }}
  >
    <EnvolvidosStack.Screen name="Envolvidos" component={Envolvidos} />
    <EnvolvidosStack.Screen
      name="AdicionarEnvolvido"
      component={AdicionarEnvolvido}
    />
    <EnvolvidosStack.Screen name="ModusOperandi" component={ModusOperandi} />
    <EnvolvidosStack.Screen
      name="DadosProfissionais"
      component={DadosProfissionais}
    />
    <EnvolvidosStack.Screen name="Endereco" component={Endereco} />
    <EnvolvidosStack.Screen
      name="Caracteristicas"
      component={Caracteristicas}
    />
  </EnvolvidosStack.Navigator>
)

export { EnvolvidosRoute }
