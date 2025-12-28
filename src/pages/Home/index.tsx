/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  View,
  Modal,
  Linking,
} from 'react-native'


// import { NetworkInfo } from 'react-native-network-info'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import { useForm } from 'react-hook-form'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Feather'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import OneSignal from 'react-native-onesignal'
import { Modalize } from 'react-native-modalize'
import Share from 'react-native-share'

// import logosds from '../../assets/logos/2047.png'
import jwt_decode from 'jwt-decode'
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'

import logosds from '../../assets/logos/logosds.png'
import emptyImg from '../../assets/images/empty.png'

import AuthContext from '../../contexts/auth'
import CardBO from '../../components/CardBO'
import BoxInput from '../../components/BoxInput'
import Loading from '../../components/Loading'

import BO, { IBOStatus, IEnvolvido, IObjeto } from '../../interfaces/bo'
import api from '../../services/api'

import {
  HeaderContent,
  Container,
  Logo,
  Titulo,
  Nome,
  Orgao,
  Cargo,
  Unidade,
  BtnCriarBO,
  ButtonSair,
  Desfecho,
  Local,
  Qtd,
  TextDesfecho,
  DP,
  Lista,
  ButtonSetValue,
  ContainerBoxInput,
  ButtonSairBox,
  ModalHeader,
  ModalItem,
  ModalItemText,
  ModalHeaderText,
  ModalItemContainer,
  ButtonStats,
  ButtonStatsText,
  TextGTI,
  DuvidasButton,
} from './styles'
import Config from '../../config'
import storage from '../../utils/storage'
import useStore from '../../store/bo'
import useStoreUsuario from '../../store/usuario'
import useStoreGlobal from '../../store/global'

axios.defaults.validateStatus = () => true

interface IBOVisualizacao {
  HASH: string
  CRC: string
  BO_JSON: BO
}

interface IBODP {
  DEVICE_ID_ONE_SIGNAL: string
  APP_ID_ONE_SIGNAL: string
  BO: BO
}

interface IStats {
  TOTAL: number
  LOCAL: number
  DELEGACIA: number
  TCO_LOCAL: number
}

const Home: React.FC = () => {
  const shareRef = useRef<Modalize>(null)
  const { control, handleSubmit, errors } = useForm()
  const {
    adicionar,
    inicial,
    complementar,
    editar,
    excluir,
    editarComplementado,
    bos,
  } = useStore()
  const { logout } = useContext(AuthContext)
  const { usuario } = useStoreUsuario()
  const { username } = useStoreGlobal()
  const { setBO, page, setPage } = useStoreGlobal()

  const [loadingInfinity, setLoadingInfinity] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingUploading, setLoadingUploading] = useState(false)
  const [showBoxLoading, setShowBoxLoading] = useState(false)
  const [textLoading, setTextLoading] = useState('Aguarde...')
  const [mike, setMike] = useState('')
  const [showBoxInput, setShowBoxInput] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<IStats>({
    LOCAL: 0,
    TOTAL: 0,
    DELEGACIA: 0,
    TCO_LOCAL: 0,
  })
  const [id_bo, setId_bo] = useState('')
  const [idBoCompartilhar, setIdBoCompartilhar] = useState('')
  const [imagemExiste, setImagemExiste] = useState(false)
  const [axiosSource, setAxiosSource] = useState<CancelTokenSource>(
    axios.CancelToken.source(),
  )
  const navigation = useNavigation()

  useEffect(() => {
    const verificarSessao = async () => {
      const token = await AsyncStorage.getItem('@BOEPM:token')

      if (token) {
        const decoded = jwt_decode(token) as { exp: number }
        const agora = Math.round(Date.now() / 1000)
        if (agora > decoded.exp) {
          Alert.alert(
            'Desculpe...',
            'Sua sessão expirou. Efetue login novamente para continuar utilizando o app!',
          )
          logout()
        }
      }
    }
    verificarSessao()
    if (usuario) {
      setStats(usuario.STATS as IStats)
    }
    return () => {
      axiosSource.cancel('Cancelando requisições pendentes...')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, usuario])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    const bosNaoConcluidos = bos.filter(
      (item) => !item.BO_STATUS[item.BO_STATUS.length - 1].CRC && !item.ERRO,
    )
    // console.log(JSON.stringify(bosNaoConcluidos))
    // return
    try {
      const res = await api.get<BO[]>('/bo/dadosGerais', {
        cancelToken: axiosSource.token,
      })

      if (res.status === 200) {
        inicial([
          ...bosNaoConcluidos,
          ...res.data.filter((b) => {
            return bosNaoConcluidos.filter((o) => o.ID_BO !== b.ID_BO)
          }),
        ])
        setPage(0)
        setRefreshing(false)
      }
    } catch (err) {
      setRefreshing(false)
    }
  }, [axiosSource.token, bos, inicial, setPage])

  // const onRefresh = async () => {

  // }

  async function handleNovoBO() {
    let jaExiste = false
    bos.forEach((bo) => {
      const bo_status = bo.BO_STATUS
      const status = bo_status[bo_status.length - 1]
      if (status.ID_STATUS === 0 || status.ID_STATUS === 1) jaExiste = true
    })
    if (jaExiste) {
      Alert.alert('Ação não permitida', 'Você ainda tem um BO em andamento.')
    } else {
      setBO(null)
      navigation.navigate('BO')
    }
  }

  async function editarBO(bo: BO) {
    if (bo.COMPLEMENTADO) {
      Alert.alert(
        'Atenção',
        'Este BO já foi Complementado. Não há mais necessidade de visualizá-lo! \n\nObs: No seu próximo login ele já não estará mais visível na sua lista!',
      )
      return
    }
    const bo_status = [...bo.BO_STATUS]
    const status = bo_status[bo_status.length - 1]
    // Se Status do BO > 1 (Concluido) então, a função é VISUALIZAR
    if (status.ID_STATUS > 1) {
      // está online
      if (bo.BO_STATUS.length !== 1) {
        navigation.navigate('Visualizar', {
          bo: bos.findIndex((b) => b.ID_BO === bo.ID_BO),
        })
      } else {
        // Está offline e deve buscar o BO completo na Base
        const boOnline = await buscaBOOnline(bo.ID_BO)
        if (boOnline) {
          boOnline.BO_STATUS.pop()
          editar({
            ...boOnline,
            BO_STATUS: [
              ...boOnline.BO_STATUS,
              {
                ID_STATUS: 2,
                DH_STATUS: bo.BO_STATUS[0].DH_STATUS,
                HASH: bo.BO_STATUS[0].HASH,
                CRC: bo.BO_STATUS[0].CRC,
              },
            ],
          })

          navigation.navigate('Visualizar', {
            bo: bos.findIndex((b) => b.ID_BO === bo.ID_BO),
          })
        } else {
          Alert.alert(
            'Atenção!',
            'Não foi possivel buscar os dados do seu BO. Tente novamente em instantes!.',
            [
              {
                text: 'OK',
              },
            ],
          )
        }
      }
    } else {
      // Caso contrário, a função é EDITAR
      setBO(0)
      navigation.navigate('BO')
    }
  }

  const buscaBOOnline = useCallback(
    async (idBo: string): Promise<BO | undefined> => {
      setTextLoading('Aguarde...')
      try {
        setShowBoxLoading(true)
        const res = await api.get<IBOVisualizacao>(`/visualizar/${idBo}`)
        setShowBoxLoading(false)
        if (res.status === 200) return res.data.BO_JSON

        if (res.status === 401) {
          Alert.alert(
            'Desculpe',
            'Sua sessão expirou, efetue login novamente no app.',
            [
              {
                text: 'OK',
                onPress: () => {
                  logout()
                  return undefined
                },
              },
            ],
          )
        }

        // eslint-disable-next-line no-empty
      } catch (error) {
        setShowBoxLoading(false)
        return undefined
      }
      return undefined
    },
    [logout],
  )

  const criarBOComplementar = useCallback(
    async (bo: BO) => {
      const index = bos.findIndex((item) => item.ID_BO === bo.ID_BO)

      // Verifica se existe BO e se o BO é o ultimo elaborado
      if (index === 0) {
        const ultimoStatus = bo.BO_STATUS[bo.BO_STATUS.length - 1]
        const agora = moment()
        const horaBO = moment(ultimoStatus.DH_STATUS, 'DD/MM/YYYY HH:mm')
        const duration = moment.duration(agora.diff(horaBO))

        if (duration.asHours() <= 5) {
          if (bo.CD_TIPO_ENVOLVIMENTO === 0) {
            if (bo.ID_TIPO_DESFECHO === '36') {
              // ################ Verifica se BO já foi concluido na DP
              setShowBoxLoading(true)

              const source = axios.CancelToken.source()
              // const timeout = setTimeout(() => {
              //   source.cancel()
              // }, 10000)

              try {
                const response = await api.get(
                  `/checkOcorrencia/${bo.CD_OCORRENCIA}`,
                  { cancelToken: source.token },
                )
                setShowBoxLoading(false)
                if (response.status === 200) {
                  if (response.data.USUARIO) {
                    if (response.data.USUARIO.ID_STATUS === 4) {
                      Alert.alert(
                        'Atenção!',
                        'Este BO não pode ser complementado por que já foi Concluido na DP!',
                      )
                      return
                    }
                  }
                }
              } catch (error) {
                Alert.alert('Ateção', 'Verifique a sua VPN e tente novamente!')
                setShowBoxLoading(false)
              }
              // ################ Fim: Verifica se BO já foi concluido na DP
            }

            Alert.alert(
              'Complementar BO',
              `Tem certeza que deseja Complementar este BO?${
                bo.ID_TIPO_DESFECHO === '36'
                  ? '\n\nLembre-se: Assim que Encaminhar o BO, entregue o novo código integrador na Delegacia!'
                  : ''
              }`,
              [
                {
                  text: 'NÃO',
                },
                {
                  text: 'SIM',
                  onPress: async () => {
                    // Verifica se o BO está Off ou Online
                    if (bo.BO_STATUS[0].ID_STATUS > 1) {
                      // Não está Offline - Deve-se Buscar no server
                      const boOnline = await buscaBOOnline(bo.ID_BO)
                      if (boOnline) {
                        complementar({
                          ...boOnline,
                          ID_BO_COMPLEMENTAR: bo.ID_BO,
                        })
                      }
                    } else {
                      complementar({
                        ...bo,
                        ID_BO_COMPLEMENTAR: bo.ID_BO,
                      })
                    }
                  },
                },
              ],
            )
          } else {
            Alert.alert(
              'Complementar Ocorrência',
              'Só o Condutor pode Complementar uma Ocorrência!',
            )
          }
        } else {
          Alert.alert(
            'Complementar Ocorrência',
            'Infelizmente esta Ocorrência não pode ser complementada.\n\nO Prazo máximo é de 5 horas após a finalização / encaminhamento do BO!',
          )
        }
      } else {
        Alert.alert(
          'Complementar Ocorrência',
          'Infelizmente esta Ocorrência não pode ser complementada.\n\nVocê só pode complementar o seu ultimo BO!',
        )
      }
    },
    [bos, buscaBOOnline, complementar],
  )

  const changeNumeroOcorrencia = useCallback(
    (data: { CD_OCORRENCIA: string }) => {
      const boTemp1 = bos.find((item) => item.ID_BO === id_bo) as BO
      editar({
        ...boTemp1,
        CD_OCORRENCIA: data.CD_OCORRENCIA,
      })
      setShowBoxInput(false)
    },
    [bos, editar, id_bo],
  )

  function fotoSetNull(o: IObjeto): IObjeto {
    return {
      ...o,
      FOTO: null,
    }
  }

  const resetRoute = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
        },
      ],
    })
  }, [navigation])

  const uploadBO = useCallback(
    async (boUpload: BO) => {
      setId_bo(boUpload.ID_BO)
      setShowBoxLoading(true)

      try {
        const existeOcorrencia = await api.get(
          `/checkOcorrencia/${boUpload.CD_OCORRENCIA}`,
        )
        if (existeOcorrencia.status === 200) {
          if (existeOcorrencia.data.ID_BO === boUpload.ID_BO) {
            try {
              const res = await api.get<BO[]>(`/bo/dadosGerais`)
              setShowBoxLoading(false)
              if (res.status === 200) {
                const boOnline = res.data.find(
                  (bo) => bo.ID_BO === boUpload.ID_BO,
                )
                if (boOnline) {
                  excluir(boUpload)
                  adicionar(boOnline)
                }
              }
              return
            } catch (error) {
              Alert.alert(
                'Atenção',
                'Não foi possivel efetuar esta operação. Verifique a sua VPN!',
              )
              return
            }
          }

          if (existeOcorrencia.data.status && !boUpload.ID_BO_COMPLEMENTAR) {
            Alert.alert(
              'Ocorrência já existe',
              `O Número de Ocorrência que você inseriu já está cadastrado no Sistema. \n
Contacte o CIODS/COPOM para gerar novo Mike!\n
Dados de quem cadastrou ? \n
Matricula: ${existeOcorrencia.data.USUARIO.MATRICULA}
Graduação: ${existeOcorrencia.data.USUARIO.SIGLA_CARGO}
Nome: ${existeOcorrencia.data.USUARIO.NOME}
OME: ${existeOcorrencia.data.USUARIO.CD_OPERACIONAL}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setShowBoxLoading(false)
                    setShowBoxInput(true)
                  },
                },
              ],
            )
          } else {
            setTextLoading('Salvando o seu BO...')
            let novoBOUpload: BO = { ...boUpload }
            try {
              // Hack: Para evitar "Contate o suporte" por falta do ID_TIPO_DESFECHO
              if (
                boUpload.BO_STATUS[boUpload.BO_STATUS.length - 1].ID_STATUS ===
                3
              ) {
                novoBOUpload = {
                  ...boUpload,
                  ID_TIPO_DESFECHO: '36',
                  NM_TIPO_DESFECHO: 'ENCAMINHADO PARA DP.',
                }
              } else {
                novoBOUpload = {
                  ...boUpload,
                  ID_TIPO_DESFECHO: '15',
                  NM_TIPO_DESFECHO: 'RESOLVIDO NO LOCAL.',
                }
              }
              // Salva o BO Online
              const res = await api.post('/boOffline', novoBOUpload)
              if (res.status === 201) {
                let cd_ocorrencia_boe = null
                // Se tiver de encaminhar para DP
                if (novoBOUpload.ID_TIPO_DESFECHO === '36') {
                  setTextLoading('Tentando Encaminhar para DP...')
                  const deviceState = await OneSignal.getDeviceState()
                  const OneSignalUserId = deviceState.userId
                  const OneSignalAppId =
                    Config.urlEnvironments[Config.ENVIRONMENT].oneSignalKey

                  const BODP: IBODP = {
                    DEVICE_ID_ONE_SIGNAL: OneSignalUserId,
                    APP_ID_ONE_SIGNAL: OneSignalAppId,
                    BO: {
                      ...novoBOUpload,
                      OBJETOS: novoBOUpload.OBJETOS.map(
                        (o: IObjeto): IObjeto => {
                          const {
                            CEL_IMEI1,
                            CEL_IMEI2,
                            CEL_IMEI3,
                            CEL_IMEI4,
                            CEL_IMEI_JUSTIFICATIVA,
                            ...obj
                          } = o
                          return { ...obj, FOTO: null }
                        },
                      ),
                      ENVOLVIDOS: novoBOUpload.ENVOLVIDOS.map(
                        (e: IEnvolvido): IEnvolvido => {
                          return {
                            ...e,
                            ASSINATURA: null,
                          }
                        },
                      ),
                    },
                  }

                  let response: AxiosResponse

                  // Tenta Persistir a ocorrencia no Infopol
                  try {
                    response = await axios.post(
                      `${
                        Config.urlEnvironments[Config.ENVIRONMENT].urlInfopol
                      }/ocorrencia`,
                      {
                        ...BODP,
                        BO: { ...BODP.BO, CRC: res.data.CRC },
                      },
                    )
                    if (response.status === 201) {
                      setTextLoading('Atualizando Status...')
                      cd_ocorrencia_boe =
                        response.data.CD_NUMERO_BOE_COMPLEMENTAR

                      try {
                        const responseUpdate = await api.put(
                          `/bo/updateStatus/${cd_ocorrencia_boe}`,
                          {},
                          {
                            headers: {
                              id_bo: novoBOUpload.ID_BO,
                            },
                          },
                        )

                        if (responseUpdate.status !== 200) {
                          cd_ocorrencia_boe = null
                        }
                        // Pega o ultimo status
                        const ultimoStatus =
                          novoBOUpload.BO_STATUS[
                            novoBOUpload.BO_STATUS.length - 1
                          ]

                        if (novoBOUpload.ID_BO_COMPLEMENTAR) {
                          editarComplementado({
                            ...novoBOUpload,
                            BO_STATUS: [
                              ...novoBOUpload.BO_STATUS.filter(
                                (st) => st.ID_STATUS < 2,
                              ),
                              {
                                ...ultimoStatus,
                                HASH: res.data.HASH,
                                CRC: res.data.CRC,
                                BO_DP: cd_ocorrencia_boe,
                              },
                            ],
                          })
                        } else {
                          editar({
                            ...novoBOUpload,
                            BO_STATUS: [
                              ...novoBOUpload.BO_STATUS.filter(
                                (st) => st.ID_STATUS < 2,
                              ),
                              {
                                ...ultimoStatus,
                                HASH: res.data.HASH,
                                CRC: res.data.CRC,
                                BO_DP: cd_ocorrencia_boe,
                              },
                            ],
                          })
                        }
                        resetRoute()
                      } catch (error) {
                        setShowBoxLoading(false)
                        Alert.alert(
                          'Atenção',
                          'Não foi possivel atualizar o status do boepm. Verifique a sua VPN!',
                        )
                        cd_ocorrencia_boe = null
                      }
                      setShowBoxLoading(false)
                    }
                  } catch (error) {
                    Alert.alert(
                      'Erro',
                      `Não foi possivel encaminhar para a DP. Verifique a sua VPN e tente novamente. ${error}`,
                    )
                    setShowBoxLoading(false)
                  }
                }

                const status: IBOStatus[] = [...novoBOUpload.BO_STATUS]
                // Pega o ultimo status
                const ultimoStatus: IBOStatus = {
                  ...status[status.length - 1],
                  HASH: res.data.HASH,
                  CRC: res.data.CRC,
                  BO_DP: cd_ocorrencia_boe,
                }

                const novoStatus = [
                  ...status.filter((item) => item.ID_STATUS < 2),
                  ultimoStatus,
                ]

                if (novoBOUpload.ID_BO_COMPLEMENTAR) {
                  editarComplementado({
                    ...novoBOUpload,
                    BO_STATUS: novoStatus,
                  })
                } else {
                  editar({
                    ...novoBOUpload,
                    BO_STATUS: novoStatus,
                  })
                }
                setShowBoxLoading(false)
                resetRoute()
              } else {
                setShowBoxLoading(false)

                // eslint-disable-next-line no-lonely-if
                if (res.status === 401) {
                  Alert.alert(
                    'Desculpe',
                    'A Sua Sessão expirou. Efetue login novamente para continuar utilizando o app!',
                  )
                  return
                }
                // 403: Trata ocorrencia e informa que ocorrencia já existe
                if (res.status === 403) {
                  if (res.data.status) {
                    Alert.alert(
                      'Ocorrência já existe!',
                      `O Número de Ocorrência que você inseriu já está cadastrado no sistema. \n
Contacte o CIODS/COPOM para gerar novo Mike!\n
Dados de quem cadastrou ? \n
Matricula: ${res.data.USUARIO.MATRICULA}
Graduação: ${res.data.USUARIO.SIGLA_CARGO}
Nome: ${res.data.USUARIO.NOME}
OME: ${res.data.USUARIO.CD_OPERACIONAL}
                              `,
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            setShowBoxLoading(false)
                            setShowBoxInput(true)
                          },
                        },
                      ],
                    )
                    return
                  }
                  // 403: O Bo já foi concluido na DP
                  if (res.data.USUARIO) {
                    if (res.data.USUARIO.ID_STATUS === 4) {
                      // Exclui o BO da lista
                      Alert.alert('Atenção!', res.data)
                      return
                    }
                  }

                  Alert.alert('Atenção!', res.data)
                  return
                }

                if (res.status === 504 || res.status === 503) {
                  console.log(JSON.stringify(novoBOUpload))
                  Alert.alert(
                    'Desculpe',
                    'No Momento seu BO não pode ser salvo no sistema, Verifique a sua VPN e tente novamente em instantes!',
                  )
                  return
                }

                Alert.alert(
                  'ERRO INESPERADO!',
                  `Ocorreu um erro inesperado no sistema. Este BO será submetido à Revisão! erro ${res.status}`,
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        Alert.alert(
                          'ATENÇÃO',
                          `Tire print ou foto desta mensagem e informe no grupo de suporte\n\nstatus: ${res.status}\nMensagem: ${res.data}`,
                        )
                        try {
                          const token = await AsyncStorage.getItem(
                            '@BOEPM:refreshToken',
                          )
                          const resError = await api.post(
                            `/postError/${novoBOUpload.CD_OCORRENCIA}`,
                            { BO_JSON: novoBOUpload, TOKEN_USER: token },
                          )

                          if (resError.status === 200) {
                            Alert.alert(
                              'Sucesso',
                              'Seu BO foi enviado para revisão. Informe imediatamente à equipe de Suporte!',
                            )
                            editar({
                              ...novoBOUpload,
                              ERRO: true,
                            })
                          } else {
                            Alert.alert(
                              'Erro',
                              'Infelizmente houve um erro ao encaminhar seu BO para a Equipe de Suporte. Contate à GTI!',
                            )
                          }
                        } catch (error) {
                          Alert.alert(
                            'Erro',
                            'Infelizmente não foi possivel enviar Seu BO para revisão. Informe imediatamente à equipe de Suporte. Contate à GTI!',
                          )
                        }
                      },
                    },
                  ],
                )
              }
            } catch (error) {
              setShowBoxLoading(false)
              if (Config.ENVIRONMENT === Config.HML) {
                Alert.alert(
                  'Rede Indisponível',
                  `Ainda não foi possivel salvar o seu BO. Encontre um local com Internet disponível e tente novamente. ${error}`,
                )
              } else {
                Alert.alert(
                  'Rede Indisponível',
                  'Ainda não foi possivel salvar o seu BO. Verifique a sua VPN e tente novamente!',
                )
              }
            }
          }
        } else {
          setShowBoxLoading(false)
          Alert.alert('Desculpe', `${existeOcorrencia.data}`)
        }
      } catch (error) {
        console.log('aqui')
        setShowBoxLoading(false)
        Alert.alert(
          'Desculpe',
          `No Momento não foi possivel salvar o seu BO. Verifique a sua VPN. \n\n Erro: ${error}`,
        )
      }
    },
    [adicionar, editar, editarComplementado, excluir, resetRoute],
  )

  async function encaminharDP(boEncaminhar: BO) {
    setShowBoxLoading(true)
    let response: AxiosResponse
    const deviceState = await OneSignal.getDeviceState()
    const OneSignalUserId = deviceState.userId
    const OneSignalAppId =
      Config.urlEnvironments[Config.ENVIRONMENT].oneSignalKey
    const BODP: IBODP = {
      DEVICE_ID_ONE_SIGNAL: OneSignalUserId,
      APP_ID_ONE_SIGNAL: OneSignalAppId,
      BO: boEncaminhar.OBJETOS
        ? {
            ...boEncaminhar,
            OBJETOS: boEncaminhar.OBJETOS.map((o: IObjeto): IObjeto => {
              const {
                CEL_IMEI1,
                CEL_IMEI2,
                CEL_IMEI3,
                CEL_IMEI4,
                CEL_IMEI_JUSTIFICATIVA,
                ...obj
              } = o
              return { ...obj, FOTO: null }
            }),
            ENVOLVIDOS: boEncaminhar.ENVOLVIDOS.map(
              (e: IEnvolvido): IEnvolvido => {
                return {
                  ...e,
                  ASSINATURA: null,
                }
              },
            ),
          }
        : { ...boEncaminhar },
    }

    let cd_ocorrencia_boe = null
    const primeiroStatus = boEncaminhar.BO_STATUS[0]
    if (primeiroStatus.ID_STATUS > 1) {
      // O BO Não está completo, deve-se buscar na base.
      try {
        setTextLoading('Baixando o BO...')
        const res = await api.get<IBOVisualizacao>(
          `/visualizar/${boEncaminhar.ID_BO}`,
          {
            cancelToken: axiosSource.token,
          },
        )
        if (res.status === 200) {
          BODP.BO = {
            ...res.data.BO_JSON,
            OBJETOS: res.data.BO_JSON.OBJETOS.map((o: IObjeto): IObjeto => {
              const {
                CEL_IMEI1,
                CEL_IMEI2,
                CEL_IMEI3,
                CEL_IMEI4,
                CEL_IMEI_JUSTIFICATIVA,
                ...obj
              } = o
              return { ...obj, FOTO: null }
            }),
            ENVOLVIDOS: res.data.BO_JSON.ENVOLVIDOS.map(
              (e: IEnvolvido): IEnvolvido => {
                return {
                  ...e,
                  ASSINATURA: null,
                }
              },
            ),
          }
          setTextLoading(`Encaminhando BO..`)
          const source = axios.CancelToken.source()
          // const timeout = setTimeout(() => {
          //   source.cancel()
          // }, 10000)
          try {
            response = await axios.post(
              `${
                Config.urlEnvironments[Config.ENVIRONMENT].urlInfopol
              }/ocorrencia`,
              {
                ...BODP,
                BO: {
                  ...BODP.BO,
                  CRC: boEncaminhar.BO_STATUS.slice(-1)[0].CRC,
                },
              },
              { cancelToken: source.token },
            )
            // clearTimeout(timeout)
            // if (response.status === 200) {
            if (response.status === 201) {
              // console.log('ok')
              cd_ocorrencia_boe = response.data.CD_NUMERO_BOE_COMPLEMENTAR
              setTextLoading('Atualizando Status...')
              try {
                const responseUpdate = await api.put(
                  `/bo/updateStatus/${cd_ocorrencia_boe}`,
                  {},
                  {
                    headers: {
                      id_bo: boEncaminhar.ID_BO,
                    },
                  },
                )
                if (responseUpdate.status === 200) {
                  const status = boEncaminhar.BO_STATUS as IBOStatus[]
                  // Pega o ultimo status
                  const ultimoStatus = status[status.length - 1]
                  ultimoStatus.BO_DP = cd_ocorrencia_boe
                  // deleta o ultimo status
                  status.pop()
                  // adiciona o novo status com hash e crc
                  status.push(ultimoStatus)
                  editar({
                    ...res.data.BO_JSON,
                    BO_STATUS: status,
                  })
                  resetRoute()
                } else {
                  console.log(
                    'Erro ao update status: != 200: ',
                    responseUpdate.data,
                  )
                  cd_ocorrencia_boe = null
                  Alert.alert(
                    'Atenção',
                    'No momento, seu BO não pode ser encaminhado a DP, tente novamente em instantes',
                  )
                }
              } catch (error) {
                setShowBoxLoading(false)
                Alert.alert(
                  'Atenção',
                  'Ero ao atualizar o status do BOEPM. Verifique a sua VPN!',
                )
                cd_ocorrencia_boe = null
              }
              setShowBoxLoading(false)
            }
          } catch (error) {
            // clearTimeout(timeout)
            Alert.alert('Erro', `Verifique a sua internet e sua VPN! ${error}`)
          }

          setShowBoxLoading(false)
        } else {
          Alert.alert(
            'Atenção',
            'No momento, seu BO não pode ser encaminhado a DP, tente novamente em instantes',
          )
        }
      } catch (error) {
        Alert.alert(
          'Erro',
          `Não foi possivel fazer encaminhamento do seu BO. Verifique a sua VPN! ${error}`,
        )
        setShowBoxLoading(false)
      }
    } else {
      const source = axios.CancelToken.source()
      // const timeout = setTimeout(() => {
      //   source.cancel()
      // }, 10000)

      try {
        setTextLoading(`Encaminhando BO..`)
        response = await axios.post(
          `${Config.urlEnvironments[Config.ENVIRONMENT].urlInfopol}/ocorrencia`,
          {
            ...BODP,
            BO: { ...BODP.BO, CRC: boEncaminhar.BO_STATUS.slice(-1)[0].CRC },
          },
          { cancelToken: source.token },
        )
        // clearTimeout(timeout)
        if (response.status === 201) {
          cd_ocorrencia_boe = response.data.CD_NUMERO_BOE_COMPLEMENTAR
          try {
            setTextLoading('Atualizando Status...')
            const responseUpdate = await api.put(
              `/bo/updateStatus/${cd_ocorrencia_boe}`,
              {},
              {
                headers: {
                  id_bo: boEncaminhar.ID_BO,
                },
              },
            )
            if (responseUpdate.status === 200) {
              const status = boEncaminhar.BO_STATUS as IBOStatus[]
              // Pega o ultimo status
              const ultimoStatus = status[status.length - 1]
              ultimoStatus.BO_DP = cd_ocorrencia_boe
              // deleta o ultimo status
              status.pop()
              // adiciona o novo status com hash e crc
              status.push(ultimoStatus)
              editar({
                ...boEncaminhar,
                BO_STATUS: status,
              })
              resetRoute()
            } else {
              console.log(
                'Erro ao update status: != 200: ',
                responseUpdate.data,
              )
              cd_ocorrencia_boe = null
            }
            setShowBoxLoading(false)
          } catch (error) {
            setShowBoxLoading(false)
            Alert.alert(
              'Erro',
              'Houve um erro ao atualizar o status do BOEPM. Verifique a sua VPN!',
            )
            cd_ocorrencia_boe = null
          }
          setShowBoxLoading(false)
        }
      } catch (error) {
        Alert.alert('Erro', `Verifique a sua Internet e sua VPN! ${error}`)
        // console.log(`${error}`)
        // setShowBoxLoading(false)
      }

      setShowBoxLoading(false)
    }
    setShowBoxLoading(false)
  }

  async function deletar(bo: BO) {
    Alert.alert(
      'Excluir BO?',
      'Essa ação não pode ser desfeita. Tem certeza?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            excluir(bo)
          },
        },
      ],
    )
  }

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sair do Sistema?',
      'Ao sair do app, se outro usuário fizer login, você perde seus BOs não finalizados!',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            logout()
          },
        },
      ],
    )
  }, [logout])

  function empty() {
    return (
      // <Text>Você ainda não preencheu nenhum BO. :(</Text>
      <View
        style={{
          flex: 1,
          width: responsiveWidth(90),
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          padding: 20,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      >
        <Image
          source={emptyImg}
          style={{
            width: 100,
            height: 100,
          }}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 5,
          }}
        >
          Oops. Você não possui BOs.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
            marginTop: 5,
          }}
        >
          Você pode criar um novo BO no botão verde abaixo.
        </Text>
      </View>
    )
  }

  const renderFooter = () => {
    if (!loadingInfinity) return null
    return <ActivityIndicator size="large" color="#555" />
  }
  const loadBOsPage = useCallback(async () => {
    // const p = page + 1
    // setLoadingInfinity(true)
    // try {
    //   const response = await api.get<BO[]>(`/bo/dadosGerais/${p}`)
    //   if (response.status === 200) {
    //     setPage(p)
    //     // Evitar que carreggue novamente alguns BOs já existentes, pois aparecerá um erro na Flatlist
    //     const bosCarregados: BO[] = []
    //     response.data.forEach((item) => {
    //       const existe = bos.find((b) => b.ID_BO === item.ID_BO)
    //       if (!existe) bosCarregados.push(item)
    //     })
    //     inicial([...bos, ...bosCarregados])
    //   }
    // } catch (error) {
    //   Alert.alert(
    //     'Atenção',
    //     `Não foi possivel carregar a lista de BOs. Verifique a sua Internet e sua VPN!${error}`,
    //   )
    // }
    // setLoadingInfinity(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bos, inicial])

  function handleCompartilhar(id: string) {
    setIdBoCompartilhar(id)
    shareRef.current?.open()
  }

  function somenteIniciais(nome: string): string {
    // var str = 'Teste SA String Normal';
    if (!nome) return ''
    const splits = nome.split(' ')
    const nova = splits.map((item) => {
      // if (item.length > 2)
      return item.charAt(0).toUpperCase()
      // if (item === 'Sa' || item === 'sa' || item === 'SA' || item === 'Sá' || item === 'SÁ')
      //   return item.charAt(0).toUpperCase();
    })
    return nova.join('.')
  }

  async function shareWithWhatsapp() {
    shareRef.current?.close()
    let boToShare: BO = bos.find(
      (item) => item.ID_BO === idBoCompartilhar,
    ) as BO

    let responsaveis = ''
    let envolvidos = ''
    let objetos = ''
    const assunto = ''
    let mensagem = ''
    let crc = ''
    if (boToShare) {
      const bo_status = boToShare.BO_STATUS
      const status = bo_status[0]
      if (status.ID_STATUS > 1) {
        try {
          const res = await api.get(`/visualizar/${idBoCompartilhar}`, {
            cancelToken: axiosSource.token,
          })
          if (res.status === 200) {
            boToShare = res.data.BO_JSON
            crc = res.data.CRC
          } else {
            Alert.alert(
              'Desculpe',
              'No Momento não foi possivel compartilhar o seu BO',
            )
          }
        } catch (error) {
          Alert.alert('Erro', 'Verifique a sua internet e sua VPN!')
        }
      }

      boToShare.RESPONSAVEIS.forEach((resp) => {
        responsaveis += `\n\t${resp?.NOME_COMPLETO} - ${resp?.CARGO} ${
          resp?.CD_TIPO_ENVOLVIMENTO === 0 ? '_(Condutor)_' : ''
        }`
      })
      boToShare.ENVOLVIDOS.forEach((env) => {
        envolvidos += `\n\tNome: ${somenteIniciais(env.NOME_RAZAO_SOCIAL)} (${
          env.NM_TIPO_ENVOLVIMENTO_PESSOA
        })`
      })
      boToShare.OBJETOS.forEach((obj) => {
        switch (obj.ID_TIPO_OBJETO) {
          case '3': // Veiculo
            objetos += `\n->${'  '}${obj.NM_TIPO_OBJETO} `
            objetos += `\n\t${obj.NM_MARCA} ${obj.NM_MODELO}, de cor ${obj.NM_COR_OBJETO}`
            objetos += `\n\tPlaca: ${
              obj.ID_VEICULO ? obj.ID_VEICULO.CD_PLACA : ''
            }`
            objetos += `\n\tEm posse de *${
              somenteIniciais(obj.NOME_ENVOLVIDO) || 'DESCONHECIDO'
            }*\n`
            break
          case '4': // Celular
            objetos += `\n->${'  '}${obj.NM_TIPO_OBJETO} `
            objetos += `\n\t${obj.NM_MARCA} ${obj.NM_MODELO || ''}, de cor ${
              obj.NM_COR_OBJETO
            }`
            objetos += `\n\tImei1: ${
              obj.ID_CELULAR
                ? obj.ID_CELULAR.CEL_IMEI1 || 'Não informado'
                : 'Não informado'
            }`
            objetos += `\n\tImei2: ${
              obj.ID_CELULAR
                ? obj.ID_CELULAR.CEL_IMEI2 || 'Não informado'
                : 'Não possui'
            }`
            objetos += `\n\tEm posse de *${
              somenteIniciais(obj.NOME_ENVOLVIDO) || 'DESCONHECIDO'
            }*\n`
            break
          case '5': // Arma de Fogo
            objetos += `\n->${'  '}${obj.NM_TIPO_OBJETO} `
            objetos += `\n\t${obj.NM_MARCA} ${obj.NM_MODELO}, de cor ${
              obj.NM_COR_OBJETO || 'Não informada'
            }`
            objetos += `\n\tCalibre: ${
              obj.ID_OBJ_ARMA ? obj.ID_OBJ_ARMA.VL_CALIBRE : 'Não informado'
            }`
            objetos += `\n\tEm posse de *${
              somenteIniciais(obj.NOME_ENVOLVIDO) || 'DESCONHECIDO'
            }*\n`
            break
          case '6': // Entorpecentes
            objetos += `\n->${'  '}${obj.NM_TIPO_OBJETO}`
            objetos += `\n\tTipo: ${
              obj.NM_CATEGORIA || 'Não Informado'
            }, de cor ${obj.NM_COR_OBJETO || 'Não informada'}`
            objetos += `\n\tUnidade: ${
              obj.NM_UNIDADE_MEDIDA || 'Não informada'
            }`
            objetos += `\n\tQuantidade: ${obj.QTD_OBJETO || 'Não informada'}`
            objetos += `\n\tEm posse de *${
              somenteIniciais(obj.NOME_ENVOLVIDO) || 'DESCONHECIDO'
            }*\n`
            break
          case '8': // Arma branca
            objetos += `\n->${obj.NM_TIPO_OBJETO} `
            objetos += `\n\tCategoria: ${
              obj.NM_CATEGORIA || 'Categoria não informada'
            }`
            objetos += `\n\tEm posse de *${
              somenteIniciais(obj.NOME_ENVOLVIDO) || 'DESCONHECIDO'
            }*\n`
            break
          default:
            // Qualquer outro objeto
            objetos += `\n->${'  '}${obj.NM_TIPO_OBJETO}`
            objetos += `\n\tCategoria: ${obj.NM_CATEGORIA || 'Não Informada'}`
            objetos += `\n\tMarca: ${obj.NM_MARCA || 'Marca Não informada'} ${
              obj.NM_MODELO || ''
            }, de cor ${obj.NM_COR_OBJETO || 'Não informada'}`
            objetos += `\n\tQuantidade: ${obj.QTD_OBJETO || 'Não informada'}`
            objetos += `\n\tValor: ${obj.VL_VALOR || 'Não informado'}`
            objetos += `\n\tEm posse de *${
              somenteIniciais(obj.NOME_ENVOLVIDO) || 'DESCONHECIDO'
            }*\n`
        }
      })
      // assunto = `(Resenha) SDS - PMPE - ${boToShare.NM_UNID_OPERACIONAL}`
      mensagem = `
      *SDS - PMPE - ${boToShare.NM_UNID_OPERACIONAL}*
      Mike: *M-${boToShare.CD_OCORRENCIA}/${boToShare.DH_FATO.substring(6, 10)}*
      Verificador: *${
        boToShare.BO_STATUS[boToShare.BO_STATUS.length - 1]?.CRC ||
        crc ||
        'S/ Verificador'
      }*
      Descrição da Natureza: *${boToShare.NATUREZAS[0].NATUREZA} / ${
        boToShare.CRIME_CONSUMADO === '0' ? 'TENTADO' : 'CONSUMADO'
      }*
      Horario do fato: *${boToShare.DH_FATO}*
      Endereço: *${
        boToShare.ENDERECO.LOGRADOURO || 'Logradouro Desconhecido'
      }, ${boToShare.ENDERECO.BAIRRO || 'Bairro não especificado'}, ${
        boToShare.ENDERECO.MUNICIPIO || 'Municipio não especificado'
      }*
      *Prefixo VT:* ${boToShare.DS_VIATURA}
      *Desfecho:* ${boToShare.NM_TIPO_DESFECHO || ''}
      ${boToShare.DADOS_COMPLEMENTARES || 'Não Informado'}
      **Efetivo empenhado**
      ${responsaveis}
      **Envolvidos**
      ${envolvidos || 'Sem envolvidos na ocorrência'}
      **Objetos apreendidos**
      ${objetos || 'Sem objetos na ocorrência'}
      *PMPE. NOSSA PRESENÇA, SUA SEGURANÇA*`

      // ############################################################################
      const shareOptions = {
        title: 'Compartilhar via',
        message: mensagem,
        social: Share.Social.WHATSAPP,
      }
      Share.shareSingle(shareOptions)
        .then((res) => {})
        .catch((err) => {})
    } else {
      Alert.alert(
        'Desculpe',
        'No Momento não foi possivel compartilhar o seu BO',
      )
    }
  }

  const contateOSuporte = async (boTemp: BO) => {
    Alert.alert(
      'Atenção',
      'Você tem certeza que quer enviar este BO para Revisão? se sim, Informe Imediatamente a Equipe Tecnica para análise!',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM, PODE ENVIAR',
          onPress: async () => {
            setTextLoading('Aguarde...')
            setShowBoxLoading(true)
            try {
              const token = await AsyncStorage.getItem('@BOEPM:refreshToken')
              const resError = await api.post(
                `/postError/${boTemp.CD_OCORRENCIA}`,
                {
                  BO_JSON: { ...boTemp },
                  TOKEN_USER: token,
                },
              )

              if (resError.status === 200) {
                Alert.alert(
                  'Sucesso',
                  'Seu BO foi enviado para revisão. Informe imediatamente à equipe de Suporte!',
                )
                editar({
                  ...boTemp,
                  ERRO: true,
                })
                setShowBoxLoading(false)
              } else {
                Alert.alert(
                  'Erro',
                  'Infelizmente houve um erro ao encaminhar seu BO para a Equipe de Suporte. Contate à GTI!',
                )
              }
            } catch (error) {
              setShowBoxLoading(false)
              Alert.alert('Erro', 'Verifique a sua Internet e sua VPN!')
            }
          },
        },
      ],
    )
  }

  const renderItem = ({ item }) => (
    <CardBO
      handleEditar={() => editarBO(item)}
      data={item}
      key={item.ID_BO}
      handleRight={() => {
        deletar(item)
      }}
      handleFinalizar={() =>
        navigation.navigate('Visualizar', {
          bo: bos.findIndex((b) => b.ID_BO === item.ID_BO),
        })}
      handleBOComplementar={() => criarBOComplementar(item)}
      // handleBOComplementar={() => console.log('complementar')}
      uploadBO={() => uploadBO(item)}
      encaminharDP={() => encaminharDP(item)}
      selectedIdBo={item.ID_BO}
      loading={loadingUploading}
      handleCompartilhar={() => handleCompartilhar(item.ID_BO)}
      contateOSuporte={() => contateOSuporte(item)}
    />
  )

  const statsBOs = async () => {
    // const token = await AsyncStorage.getItem('@BOEPM:refreshToken')
    // console.log(token)
    setLoadingStats(true)
    try {
      const res = await axios.get(
        'http://api-boepm-bids.apps.ocp-server.ati.pe.gov.br/stats',
      )
      setLoadingStats(false)
      if (res.status === 200) {
        Alert.alert(
          'Estatísticas Produção',
          `
          Concluídos Infopol: ${res.data.ConcluidosDp}\n
          Concluídos Local: ${res.data.bosTotal - res.data.encaminhadoDp}\n
          Encaminhados DP: ${res.data.encaminhadoDp - res.data.ConcluidosDp}\n
          Total: ${res.data.bosTotal}\n
          `,
        )
      } else {
        Alert.alert(
          'Atenção',
          'Não foi possivel buscar as estatisticas do BOEPM!',
        )
      }
    } catch (error) {
      setLoadingStats(false)
      Alert.alert(
        'Atenção',
        'Verifique a sua Internet e VPN e tente novamente!',
      )
    }
  }

  const hadleDuvidas = () => {
    Alert.alert(
      'Atenção',
      'Você será redirecionado para o Grupo de Suporte para tirar suas dúvidas.',
      [
        {
          text: 'AGORA NÃO',
        },
        {
          text: 'IR',
          onPress: () => {
            const linkWhatsAppGroupSupport =
              'https://chat.whatsapp.com/DgnbeK6AXav0AJoTk9YZ8s'

            Linking.openURL(linkWhatsAppGroupSupport)
          },
        },
      ],
    )
  }

  const showVersion = () => {
    Alert.alert('Sobre o BOEPM', `Versão: ${Config.APP_VERSION}\n\n`)
  }

  return (
    <>
      <BtnCriarBO onPress={() => handleNovoBO()}>
        <Icon
          name="plus"
          size={32}
          color="#fff"
          // style={{ backgroundColor: '#bbb', borderRadius: 24, padding: 8 }}
          style={{ backgroundColor: '#2fc117', borderRadius: 24, padding: 8 }}
        />
      </BtnCriarBO>
      <Container>
        <Lista
          data={bos}
          ListHeaderComponent={() => {
            return (
              <HeaderContent>
                <DuvidasButton onPress={() => hadleDuvidas()}>
                  <Icon name="alert-triangle" size={18} color="#f00" />
                  <TextGTI>Dúvidas</TextGTI>
                </DuvidasButton>
                <ButtonSair onPress={() => handleLogout()}>
                  <Icon name="log-out" color="#666" size={22} />
                </ButtonSair>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => showVersion()}
                >
                  <Image
                    style={{
                      resizeMode: 'cover',
                      width: responsiveWidth(36),
                      height: responsiveHeight(20),
                      borderWidth: 1,
                    }}
                    source={logosds}
                  />
                </TouchableOpacity>

                <Titulo>
                  <Nome>{usuario?.NOME_COMPLETO}</Nome>
                  <Unidade>
                    <Cargo>
                      {usuario?.CARGO}
, Mat.
{usuario?.MATRICULA}
                    </Cargo>
                    {(usuario?.MATRICULA === '1137204' ||
                      usuario?.MATRICULA === '1066285') &&
                      (loadingStats ? (
                        <ActivityIndicator size="small" color="#aaa" />
                      ) : (
                        <ButtonStats onPress={() => statsBOs()}>
                          <Icon name="file-text" size={20} color="#aaa" />
                        </ButtonStats>
                      ))}
                  </Unidade>

                  <Orgao>
                    {usuario?.ORGANIZACAO_DISPOSICAO === 'OE'
                      ? 'Órgão Externo'
                      : usuario?.ORGANIZACAO_DISPOSICAO}
                  </Orgao>
                </Titulo>
                <Desfecho>
                  <Local>
                    <Qtd>{stats.LOCAL || '0'}</Qtd>
                    <TextDesfecho>Resolvido no Local</TextDesfecho>
                  </Local>
                  <DP>
                    <Qtd>{stats.DELEGACIA || '0'}</Qtd>
                    <TextDesfecho>Delegacia</TextDesfecho>
                  </DP>
                </Desfecho>
              </HeaderContent>
            )
          }}
          initialNumToRender={1}
          ListEmptyComponent={empty}
          keyExtractor={(bo) => bo.ID_BO}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={renderItem}
          onEndReached={loadBOsPage}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
        />
      </Container>
      <Modal
        transparent
        visible={showBoxInput}
        statusBarTranslucent
        hardwareAccelerated
      >
        <BoxInput
          control={control}
          error={errors.CD_OCORRENCIA}
          isPassword={false}
          name="CD_OCORRENCIA"
          label="Digite novamente o MIKE"
          mtype="only-numbers"
          maxLength={17}
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
                Sair
              </Text>
            </ButtonSairBox>
            <ButtonSetValue onPress={handleSubmit(changeNumeroOcorrencia)}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 15,
                }}
              >
                OK
              </Text>
            </ButtonSetValue>
          </ContainerBoxInput>
        </BoxInput>
      </Modal>
      <Modal
        transparent
        visible={showBoxLoading}
        statusBarTranslucent
        hardwareAccelerated
      >
        <Loading animating text={textLoading} />
      </Modal>

      <Modalize
        ref={shareRef}
        snapPoint={95}
        modalHeight={95}
        HeaderComponent={() => (
          <ModalHeader>
            <ModalHeaderText>Compartilhar BO</ModalHeaderText>
          </ModalHeader>
        )}
      >
        <View>
          <ModalItem onPress={() => shareWithWhatsapp()}>
            <ModalItemContainer>
              <IconFA5
                name="whatsapp"
                size={30}
                color="#25D366"
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <ModalItemText>Whatsapp</ModalItemText>
            </ModalItemContainer>
          </ModalItem>
        </View>
      </Modalize>
    </>
  )
}

export default Home
