/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'

import { Alert, Keyboard, Text, ActivityIndicator, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import { useForm } from 'react-hook-form'
import axios, { CancelTokenSource } from 'axios'
import ImgEnv from '../../assets/images/responsaveis.png'

import Input from '../../components/Input'
import ItemCard from '../../components/CardResponsaveis'
import Select from '../../components/Select'
import { HeaderHome } from '../../components/Header'
import BoxInput from '../../components/BoxInput'
import { IResponsavel } from '../../interfaces/responsavel'

import {
  Container,
  ImgResposavel,
  ImgView,
  Titulo,
  SubTitulo,
  ButtonResposavel,
  ButtonResposavelText,
  IconAdd,
  ButtomContainer,
  ButtomVoltar,
  ButtomSeguir,
  ButtomVoltarText,
  ButtomSeguirText,
  ContainerButton,
  Lista,
  ContainerForm,
  ContainerBoxInput,
  ButtonSairBox,
  ButtonSetValue,
} from './styles'
import api from '../../services/api'
import Loading from '../../components/Loading'
import useStore from '../../store/bo'
import useStoreGlobal from '../../store/global'

export interface IUsuario {
  ID_USUARIO: string
  NOME_COMPLETO: string
  MATRICULA: string
  ID_CARGO: number
  CARGO: string
  ID_ORGANIZACAO?: number
  ORGANIZACAO_DISPOSICAO?: string
  CD_TIPO_ENVOLVIMENTO: number
  SEXO: string
  RG: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Responsaveis = (props: any) => {
  const navigation = useNavigation()
  const { editar, bos } = useStore()
  const { bo, setBO } = useStoreGlobal()
  const { control: formResponsavel, handleSubmit, errors } = useForm()
  const {
    control: controlCpf,
    handleSubmit: handleSubmitCpf,
    errors: errorsCpf,
  } = useForm()
  const [semPatrulheiro, setSemPatrulheiro] = useState(false)
  const [showBoxLoading, setShowBoxLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showBoxInput, setShowBoxInput] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [axiosSource, setAxiosSource] = useState<CancelTokenSource>(
    axios.CancelToken.source(),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleFinalizar() {
    setBO(null)
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
        },
      ],
    })
  }

  useEffect(() => {
    if (bo === 0) {
      const patr = bos[0].RESPONSAVEIS.find((r) => r.CD_TIPO_ENVOLVIMENTO === 1)
      if (!patr) {
        setSemPatrulheiro(true)
      } else setSemPatrulheiro(false)
      setLoaded(true)
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      },
    )
    return () => {
      axiosSource.cancel('Cancelando requisições pendentes...')
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [axiosSource, bo, bos])

  async function addResponsavel(data: IResponsavel) {
    if (bo === 0) {
      Keyboard.dismiss()
      const resp = [...bos[0].RESPONSAVEIS]
      if (resp.find((r: IResponsavel) => r.MATRICULA === data.MATRICULA)) {
        Alert.alert('Informação', 'Responsável já adicionado')
      } else {
        try {
          setShowBoxLoading(true)
          const response = await api.get<IResponsavel>(
            `/bo/buscarAgente/${data.MATRICULA}`,
            // {
            //   cancelToken: axiosSource.token,
            // },
          )
          setShowBoxLoading(false)
          if (response.status === 200) {
            const respNovo = {
              ...response.data,
              CD_TIPO_ENVOLVIMENTO: Number(
                formResponsavel.getValues('CD_TIPO_ENVOLVIMENTO') || '1',
              ),
            }
            // Pega todos os status do BO
            const todosOsStatus = [...bos[0].BO_STATUS]
            const status = todosOsStatus[todosOsStatus.length - 1]

            if (status.ID_STATUS === 0 && bos[0].DADOS_COMPLEMENTARES !== '') {
              todosOsStatus.push({
                ID_STATUS: 1,
                DH_STATUS: moment().format('DD/MM/YYYY HH:mm'),
              })
            }
            editar({
              ...bos[0],
              RESPONSAVEIS: [...resp, respNovo],
              BO_STATUS: todosOsStatus,
            })
            formResponsavel.setValue('MATRICULA', '')
          } else {
            setShowBoxInput(true)
            return
          }
        } catch (error) {
          setShowBoxLoading(false)
          Alert.alert(
            'Desculpe',
            `No momento não está sendo possivel buscar os dados do PM. Verifique a sua VPN!`,
          )
        }
      }
    }
  }

  async function deleteResponsavel(id: string) {
    Alert.alert(
      'Excluir Responsável',
      'Tem certeza que deseja excluir este Responsável?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            if (bo === 0) {
              if (
                bos[0].RESPONSAVEIS.find(
                  (item) =>
                    item.ID_USUARIO === id && item.CD_TIPO_ENVOLVIMENTO === 0,
                )
              )
                Alert.alert(
                  'Ação não permitida!',
                  'Você não pode excluir o condutor da Ocorrência',
                )
              const boSemOResponsavelExcluido = bos[0].RESPONSAVEIS.filter(
                (item) => item.ID_USUARIO !== id,
              )
              const patr = boSemOResponsavelExcluido.find(
                (r) => r.CD_TIPO_ENVOLVIMENTO === 1,
              )
              const todosOsStatus = bos[0].BO_STATUS
              const status = todosOsStatus[todosOsStatus.length - 1]
              if (!patr) {
                setSemPatrulheiro(true)
                if (status.ID_STATUS === 1) {
                  todosOsStatus.pop()
                }
              }
              editar({
                ...bos[0],
                RESPONSAVEIS: boSemOResponsavelExcluido,
                BO_STATUS: todosOsStatus,
              })
            } else {
              Alert.alert(
                'Atenção',
                'Você não pode deletar responsável de BO Nulo',
              )
            }
          },
        },
      ],
    )
  }

  const buscacpf = useCallback(
    async (data: { CPF: string }) => {
      const cpf: string = data.CPF.replace(/\D/gim, '')
      if (bo === 0) {
        setShowBoxLoading(true)
        const resp = [...bos[bo].RESPONSAVEIS]

        try {
          const response = await api.get<IResponsavel>(
            `/buscarAgentePorCpf/${cpf}`,
            // {
            //   cancelToken: axiosSource.token,
            // },
          )
          setShowBoxLoading(false)
          setShowBoxInput(false)
          if (response.status === 201) {
            // if (!response.data.EMAIL) {
            //   Alert.alert(
            //     'Atenção',
            //     'Este PM não pode ser adicionado pois ainda não foi difinido seu email institucional!',
            //   )
            //   return
            // }
            // 89950992400
            // 07394119424
            const respNovo = {
              ...response.data,
              CD_TIPO_ENVOLVIMENTO: Number(
                formResponsavel.getValues('CD_TIPO_ENVOLVIMENTO') || '1',
              ),
            }
            // Pega todos os status do BO
            const todosOsStatus = [...bos[bo].BO_STATUS]
            const status = todosOsStatus[todosOsStatus.length - 1]

            if (status.ID_STATUS === 0 && bos[bo].DADOS_COMPLEMENTARES !== '') {
              todosOsStatus.push({
                ID_STATUS: 1,
                DH_STATUS: moment().format('DD/MM/YYYY HH:mm'),
              })
            }
            editar({
              ...bos[bo],
              RESPONSAVEIS: [...resp, respNovo],
              BO_STATUS: todosOsStatus,
            })
            formResponsavel.setValue('MATRICULA', '')
          }
          if (response.status === 404) {
            Alert.alert(
              'Não encontrado',
              `Não foi encontrado nenhum usuário com este CPF! Verifique se o CPF está correto...`,
            )
          }
          if (response.status === 504) {
            Alert.alert(
              'Desculpe!',
              `O Servidor demorou muito pra responder. Verifique a sua VPN e tente novamente!`,
            )
          }
        } catch (error) {
          setShowBoxLoading(false)
          setShowBoxInput(false)
          Alert.alert(
            'Atenção',
            `Não foi possivel buscar o PM. Verifique a sua conexão e sua VPN!`,
          )
        }
      }
    },
    [bo, bos, editar, formResponsavel],
  )

  return (
    <>
      <HeaderHome
        drawerHome={() => {
          props.navigation.openDrawer()
        }}
      />

      <Container
        style={{
          marginTop: isKeyboardVisible ? -100 : 0,
        }}
      >
        <ImgView>
          <ImgResposavel source={ImgEnv} />
        </ImgView>

        <Titulo>Cadastro de Responsáveis</Titulo>
        <SubTitulo>Cadastro os Responsáveis por esta Ocorrência</SubTitulo>
        {semPatrulheiro && (
          <Text style={{ color: '#f00', fontSize: 12 }}>
            Adicione ao menos 01 (Um) Patrulheiro
          </Text>
        )}

        <ContainerForm>
          <Select
            name="CD_TIPO_ENVOLVIMENTO"
            label="Tipo de Envolvimento"
            prompt="Escolha a opção"
            control={formResponsavel}
            error={errors.CD_TIPO_ENVOLVIMENTO}
            rules={{ required: true }}
            defaultValue="1"
          >
            <Picker.Item key="1" label="Patrulheiro" value="1" />
            <Picker.Item key="2" label="Apoio" value="2" />
          </Select>
          <ContainerButton>
            <Input
              name="MATRICULA"
              style={{ fontWeight: 'bold', fontSize: 16, width: 150 }}
              label="Matricula"
              control={formResponsavel}
              maxLength={7}
              keyboardType="numeric"
              placeholder="ex: 1137886"
              error={errors.MATRICULA}
              rules={{ required: true }}
              mtype="only-numbers"
            />

            <ButtonResposavel onPress={handleSubmit(addResponsavel)}>
              <ButtonResposavelText>Adicionar</ButtonResposavelText>
              <IconAdd name="plus-circle" />
            </ButtonResposavel>
          </ContainerButton>
        </ContainerForm>

        {loaded ? (
          <Lista
            data={bo === 0 ? bos[bo].RESPONSAVEIS : []}
            keyExtractor={(item) => String(item.ID_USUARIO)}
            renderItem={({ item }) => {
              return (
                <ItemCard
                  data={item}
                  key={item.ID_USUARIO}
                  handleRight={() => {
                    deleteResponsavel(item.ID_USUARIO)
                  }}
                />
              )
            }}
          />
        ) : (
          <ActivityIndicator size="large" color="#aaa" />
        )}
      </Container>

      <ButtomContainer>
        <ButtomVoltar onPress={() => props.navigation.goBack()}>
          <ButtomVoltarText>Voltar</ButtomVoltarText>
        </ButtomVoltar>

        <ButtomSeguir onPress={() => handleFinalizar()}>
          <ButtomSeguirText>Pronto</ButtomSeguirText>
        </ButtomSeguir>
      </ButtomContainer>
      <Modal
        transparent
        visible={showBoxLoading}
        statusBarTranslucent
        hardwareAccelerated
      >
        <Loading animating text="Aguarde..." />
      </Modal>
      <Modal
        transparent
        visible={showBoxInput}
        statusBarTranslucent
        hardwareAccelerated
      >
        <BoxInput
          control={controlCpf}
          error={errorsCpf.CPF}
          name="CPF"
          maxLength={14}
          label="CPF do PM que deseja adicionar"
          mtype="cpf"
        >
          <ContainerBoxInput>
            <ButtonSairBox onPress={() => setShowBoxInput(false)}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 15,
                }}
              >
                Voltar
              </Text>
            </ButtonSairBox>
            <ButtonSetValue onPress={handleSubmitCpf(buscacpf)}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 15,
                }}
              >
                Buscar
              </Text>
            </ButtonSetValue>
          </ContainerBoxInput>
        </BoxInput>
      </Modal>
    </>
  )
}

export default Responsaveis
