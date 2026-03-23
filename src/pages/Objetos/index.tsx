/* eslint-disable camelcase */
import React, { useState, useContext, useCallback, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { launchCamera } from 'react-native-image-picker'
import { Modalize } from 'react-native-modalize'
import Icon from 'react-native-vector-icons/Feather'

import { Alert, Text, View } from 'react-native'
import uuid from 'react-native-uuid'

import requestPermission from '../../utils/request-permission'
import AdicionarObjeto from './AdicionarObjeto'

import { HeaderHome } from '../../components/Header'
import CardObjeto from '../../components/CardObjeto'
import ImagemTopo from '../../assets/images/objetos_envolvidos.png'

import { IObjeto, IFoto } from '../../interfaces/bo'

import {
  Container,
  Titulo,
  ImgTopo,
  ImgTopoView,
  SubTitulo,
  ButtonObjeto,
  ButtonObjetoText,
  IconAdd,
  ComboButton,
  ButtonOne,
  ButtonTwo,
  Lista,
  ModalHeader,
  ModalItem,
  ModalItemText,
  ModalHeaderText,
} from './styles'
import useStore from '../../store/bo'
import useStoreGlobal from '../../store/global'

const ObjetosStack = createStackNavigator()

const Objetos = (props: any) => {
  const optionsFotoRef = useRef<Modalize>(null)
  const envolvidosRef = useRef<Modalize>(null)
  const navigation = useNavigation()
  const { bo } = useStoreGlobal()
  const { editar: editarBO, bos } = useStore()

  const [idFoto, setIdFoto] = useState('')
  const [idObjeto, setIdObjeto] = useState('')

  const deleteObjeto = (objeto: IObjeto) => {
    Alert.alert(
      'Excluir Objeto?',
      'Essa ação não pode ser desfeita. Tem certeza?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            if (bo === 0) {
              editarBO({
                ...bos[bo],
                OBJETOS: bos[bo].OBJETOS.filter(
                  o => o.ID_OBJETO !== objeto.ID_OBJETO,
                ),
              })
            }
          },
        },
      ],
    )
  }

  const modalEnvolvido = (idObj: string) => {
    setIdObjeto(idObj)
    if (bo === 0) {
      if (bos[bo].ENVOLVIDOS.length === 0)
        Alert.alert(
          'Informação',
          'Você ainda não possui Envolvidos cadastrados',
        )
      else envolvidosRef.current?.open()
    }
  }

  const changeEnvolvido = async (id: string, nome: string) => {
    if (bo === 0) {
      const objMudarEnvolvido = bos[bo].OBJETOS.find(
        item => item.ID_OBJETO === idObjeto,
      )

      if (objMudarEnvolvido) {
        objMudarEnvolvido.NOME_ENVOLVIDO = nome as string
        objMudarEnvolvido.ID_ENVOLVIDO = id as string

        const objs = [...bos[bo].OBJETOS]
        const index = objs.findIndex(item => item.ID_OBJETO === idObjeto)
        objs.splice(index, 1, objMudarEnvolvido)

        editarBO({
          ...bos[bo],
          OBJETOS: objs,
        })

        envolvidosRef.current?.close()
      }
    } else {
      Alert.alert('Informação', 'Não se pode Mudar Usuario de BO Nulo ')
    }
  }

  const editarObjeto = (objeto: IObjeto) => {
    navigation.navigate('AdicionarObjeto', { objeto })
  }

  const adicionarObjeto = () => {
    navigation.navigate('AdicionarObjeto')
  }

  const removerFoto = useCallback(
    async (id: string) => {
      if (bo === 0) {
        const obj = bos[bo].OBJETOS.find(o => o.ID_OBJETO === id)
        if (obj) {
          obj.FOTO = null
          editarBO({
            ...bos[bo],
            OBJETOS: [obj, ...bos[bo].OBJETOS.filter(o => o.ID_OBJETO !== id)],
          })
        }
      } else {
        Alert.alert('Informação', 'Não se pode alterar foto de BO Nulo')
      }
      optionsFotoRef.current?.close()
    },
    [bo, bos, editarBO],
  )

  const getFoto = useCallback(
    async (id: string, editar?: boolean) => {
      if (await requestPermission('CAMERA')) {
        if (bo === 0) {
          const objs = bos[bo].OBJETOS
          const obj = objs.find(item => item.ID_OBJETO === id) as IObjeto
          if (obj.FOTO && !editar) {
            optionsFotoRef.current?.open()
            setIdFoto(id)
          } else
            try {
              launchCamera(
                {
                  mediaType: 'photo',
                  quality: 1,
                  cameraType: 'back',
                  saveToPhotos: false,
                  maxWidth: obj.ID_TIPO_OBJETO === '7' ? 1020 : 510,
                  maxHeight: obj.ID_TIPO_OBJETO === '7' ? 1350 : 675,
                  includeBase64: true,
                },
                async response => {
                  optionsFotoRef.current?.close()
                  if (!response.didCancel) {
                    let id_tipo_foto = '4'
                    switch (obj.ID_TIPO_OBJETO) {
                      case '5':
                        id_tipo_foto = '3'
                        break
                      case '6':
                        id_tipo_foto = '1'
                        break
                      case '7':
                        id_tipo_foto = '2'
                        break
                      default:
                        id_tipo_foto = '4'
                        break
                    }

                    const foto: IFoto = {
                      ID: uuid.v4().toString(),
                      ID_BO: bo ? bos[bo].ID_BO : '',
                      ID_TIPO_FOTO: id_tipo_foto,
                      ID_OBJETO: obj.ID_OBJETO,
                      DESCRICAO: 'Foto',
                      FOTO: response.base64 as string,
                    }

                    if (!editar) obj.FOTO = foto
                    else if (obj.FOTO) obj.FOTO.FOTO = response.base64 as string

                    const objIndex = objs.findIndex(
                      item => item.ID_OBJETO === id,
                    )
                    objs.splice(objIndex, 1, obj)

                    editarBO({
                      ...bos[bo],
                      OBJETOS: objs,
                    })
                  }
                },
              )
            } catch (error) {
              Alert.alert('erro', error)
            }
        }
      }
    },
    [bo, bos, editarBO],
  )

  return (
    <>
      <HeaderHome
        drawerHome={() => {
          props.navigation.openDrawer()
        }}
      />
      <Container>
        <ImgTopoView>
          <ImgTopo source={ImagemTopo} />
        </ImgTopoView>

        <Titulo>OBJETOS</Titulo>

        <SubTitulo>
          Enumere todos os objetos envolvidos nesta Ocorrência
        </SubTitulo>

        <ButtonObjeto onPress={() => adicionarObjeto()}>
          <ButtonObjetoText>ADICIONAR OBJETO</ButtonObjetoText>

          <IconAdd name="plus-circle" />
        </ButtonObjeto>

        <Lista
          data={bo === 0 ? bos[bo].OBJETOS : []}
          ListEmptyComponent={() => <Text>Nenhum Objeto adicionado!</Text>}
          keyExtractor={obj => String(obj.ID_OBJETO)}
          renderItem={({ item }) => {
            return (
              <CardObjeto
                data={item}
                key={item.ID_OBJETO}
                handleRight={() => {
                  deleteObjeto(item)
                }}
                handleLeft={() => modalEnvolvido(item.ID_OBJETO)}
                handleEditar={() => editarObjeto(item)}
                getFoto={() => getFoto(item.ID_OBJETO)}
              />
            )
          }}
        />
      </Container>
      <ComboButton>
        <ButtonOne onPress={() => props.navigation.goBack()}>Voltar</ButtonOne>
        <ButtonTwo
          onPress={() => props.navigation.navigate('Dados Complementares')}
        >
          Prosseguir
        </ButtonTwo>
      </ComboButton>
      <Modalize
        ref={optionsFotoRef}
        snapPoint={135}
        modalHeight={135}
        HeaderComponent={() => (
          <ModalHeader>
            <ModalHeaderText>Escolha uma Opção</ModalHeaderText>
          </ModalHeader>
        )}
      >
        <View>
          <ModalItem onPress={() => getFoto(idFoto, true)}>
            <Icon name="edit-2" size={20} color="#aaa" />
            <ModalItemText>Editar Foto</ModalItemText>
          </ModalItem>
          <ModalItem onPress={() => removerFoto(idFoto)}>
            <Icon name="trash" size={20} color="#f00" />
            <ModalItemText style={{ color: '#f00' }}>
              Remover Foto
            </ModalItemText>
          </ModalItem>
        </View>
      </Modalize>
      <Modalize
        ref={envolvidosRef}
        snapPoint={90 + (bos[bo as number].ENVOLVIDOS.length || 1) * 45}
        modalHeight={90 + (bos[bo as number].ENVOLVIDOS.length || 1) * 45}
        HeaderComponent={() => (
          <ModalHeader>
            <ModalHeaderText>Escolha uma Opção</ModalHeaderText>
          </ModalHeader>
        )}
      >
        <View>
          <ModalItem onPress={() => changeEnvolvido('', '')}>
            <Icon
              name="user-x"
              size={20}
              color="#aaa"
              style={{ marginLeft: 2 }}
            />
            <ModalItemText>DESCONHECIDO</ModalItemText>
          </ModalItem>
          {bo === 0 &&
            bos[bo].ENVOLVIDOS.map(envolvido => (
              <ModalItem
                onPress={() =>
                  changeEnvolvido(
                    envolvido.ID_ENVOLVIDO,
                    envolvido.NOME_RAZAO_SOCIAL,
                    // eslint-disable-next-line prettier/prettier
                  )}
                key={envolvido.ID_ENVOLVIDO}
              >
                <Icon name="user" size={20} color="#aaa" />
                <ModalItemText>
                  {`(${envolvido.NOME_RAZAO_SOCIAL} `}
                  {`${envolvido.NM_TIPO_ENVOLVIMENTO_PESSOA}) `}
                </ModalItemText>
              </ModalItem>
            ))}
        </View>
      </Modalize>
    </>
  )
}

export default Objetos

const ObjetosRoute = () => (
  <ObjetosStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#F2F2F2' },
    }}
  >
    <ObjetosStack.Screen name="Objetos" component={Objetos} />
    <ObjetosStack.Screen name="AdicionarObjeto" component={AdicionarObjeto} />
  </ObjetosStack.Navigator>
)

export { ObjetosRoute }
