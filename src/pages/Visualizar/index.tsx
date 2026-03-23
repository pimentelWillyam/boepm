/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-one-expression-per-line */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import OneSignal from 'react-native-onesignal'
import { Modalize } from 'react-native-modalize'
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios'
import Icon from 'react-native-vector-icons/Feather'
import SignatureView, { SignatureViewRef } from 'react-native-signature-canvas'
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions'
// import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import {
  ActivityIndicator,
  View,
  Alert,
  Image,
  Modal,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Button,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useForm } from 'react-hook-form'

import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import logo from '../../assets/logos/logosds.png'
import Select from '../../components/Select'
import Loading from '../../components/Loading'
import BoxInput from '../../components/BoxInput'
import desfechoLocal from '../../utils/data/desfechoLocal.json'
import BO, { IBOStatus, IEnvolvido, IObjeto } from '../../interfaces/bo'
import api from '../../services/api'
import Config from '../../config'

import {
  Container,
  BtnFinalizar,
  BtnEscolherDesfecho,
  BtnText,
  Certidao,
  Header,
  LogoSDS,
  H1,
  TitleText,
  Negrito,
  Section,
  SectionTitle,
  SectionContent,
  SectionItem,
  SectionCount,
  ItemUsoForca,
  Hash,
  ModalHeader,
  ModalHeaderText,
  ModalItem,
  ModalItemText,
  HashError,
  DesfechoContent,
  ButtonChangeOcorrencia,
  ContainerButtonChangeOcorrencia,
  ButtonVoltarChangeOcorrencia,
  RascunhoText,
} from './styles'
import AuthContext from '../../contexts/auth'
import useStore from '../../store/bo'
import useStoreUsuario from '../../store/usuario'
import useStoreGlobal from '../../store/global'

axios.defaults.validateStatus = () => true

interface DesfechoObj {
  descDesfecho: {
    ID_TIPO_DESFECHO: string
    NM_TIPO_DESFECHO: string
  }
  tipoEncaminhamento: number
}

export default function Visualizar(): JSX.Element {
  const sign = useRef<SignatureViewRef>(null)
  const route = useRoute()
  const { editar, editarComplementado, bos } = useStore()
  const { usuario } = useStoreUsuario()
  const modalizeRef = useRef<Modalize>(null)
  const modalizeDesfechoRef = useRef<Modalize>(null)
  // const modalizeAssinar = useRef<Modalize>(null)
  const { control, handleSubmit, errors } = useForm()
  const {
    control: controlSenha,
    handleSubmit: handleSubmitSenha,
    errors: errorsSenha,
  } = useForm()
  const navigation = useNavigation()
  const { setStats, logout } = useContext(AuthContext)
  const [idStatus, setIdStatus] = useState(0)
  const [bo, _] = useState<number>(route.params ? route.params.bo : 0)
  const [hash, setHash] = useState<string | null>(null)
  const [crc, setCrc] = useState<string | null>(null)
  const [showLoading, setShowLoading] = useState(false)
  const [textLoading, setTextLoading] = useState('Aguarde...')
  const [showBoxInput, setShowBoxInput] = useState(false)
  const [showSenhaInput, setShowSenhaInput] = useState(false)
  const [senha, setSenha] = useState<string>('')
  const [mike, setMike] = useState<string>('')
  const [showAssinatura, setShowAssinatura] = useState(false)
  const [envolvido, setEnvolvido] = useState<IEnvolvido | null>(null)
  const [desfechoEscolhido, setDesfechoEscolhido] =
    useState<DesfechoObj | null>(null)
  const [axiosSource, setAxiosSource] = useState<CancelTokenSource>(
    axios.CancelToken.source(),
  )

  const { username } = useStoreGlobal()

  const {
    control: formAssinar,
    handleSubmit: assinarSubmit,
    errors: errorsAssinar,
  } = useForm<BO>()

  let contObj = 1
  let contImgObj = 1
  let contEnv = 1
  interface tipoDesf {
    LOCAL: number
    DP: number
  }
  const TIPO_DESFECHO: tipoDesf = {
    LOCAL: 2,
    DP: 3,
  }

  useEffect(() => {
    // if (bo) {
    const status: IBOStatus[] = bos[bo].BO_STATUS
    const ultimoStatus = status[status.length - 1]
    const primeiroStatus = status[0]
    setIdStatus(ultimoStatus.ID_STATUS)
    if (primeiroStatus.ID_STATUS === 0) {
      setCrc(ultimoStatus.CRC as string)
      setHash(ultimoStatus.HASH as string)
    }
    // }
    return () => {
      axiosSource.cancel('Cancelando requisições pendentes...')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function openModal() {
    modalizeRef.current?.open()
  }

  interface IBODP {
    DEVICE_ID_ONE_SIGNAL: string
    APP_ID_ONE_SIGNAL: string
    BO: BO
  }

  const goHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
        },
      ],
    })
  }, [navigation])

  interface TipoDesfecho {
    ID_TIPO_DESFECHO: string
    NM_TIPO_DESFECHO: string
  }

  async function finalizar(d: DesfechoObj) {
    if (!bos[bo].DADOS_COMPLEMENTARES) {
      Alert.alert(
        'Atenção',
        'Digite os dados complementares novamente, de preferência, não utilize recursos de colar textos de fora do app!',
      )
      return
    }
    // data: TipoDesfecho, tipo_encaminhamento: number
    const data = d.descDesfecho
    const tipo_encaminhamento = d.tipoEncaminhamento
    setShowLoading(true)
    // CD_OCORRENCIA não exite ainda na BASE
    const status = bos[bo].BO_STATUS as IBOStatus[]
    const ultimoStatus = status[status.length - 1]
    if (ultimoStatus.ID_STATUS === 1) {
      // Está no Estado de Pronto, então pode prosseguir

      let BODP: IBODP = {} as IBODP
      // O Desfecho escolhido é CONCLUIDO NO LOCAL
      if (tipo_encaminhamento === TIPO_DESFECHO.LOCAL) {
        if (usuario) {
          const stats = {
            ...usuario.STATS,
            LOCAL: usuario.STATS ? usuario.STATS.LOCAL + 1 : 0,
          }
          if (!bos[bo].ID_BO_COMPLEMENTAR)
            setStats({ ...usuario, STATS: stats })
        }
      } else {
        // O Desfecho escolhido é ENCAMINHADO PARA DP
        if (usuario) {
          const stats = {
            ...usuario.STATS,
            DELEGACIA: usuario.STATS ? usuario.STATS.DELEGACIA + 1 : 0,
          }
          if (!bos[bo].ID_BO_COMPLEMENTAR)
            setStats({ ...usuario, STATS: stats })
        }
        const deviceState = await OneSignal.getDeviceState()
        const OneSignalUserId = deviceState.userId
        const OneSignalAppId =
          Config.urlEnvironments[Config.ENVIRONMENT].oneSignalKey

        BODP = {
          DEVICE_ID_ONE_SIGNAL: OneSignalUserId,
          APP_ID_ONE_SIGNAL: OneSignalAppId,
          BO: {
            ...bos[bo],
            OBJETOS: bos[bo].OBJETOS.map((o: IObjeto): IObjeto => {
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
            ENVOLVIDOS: bos[bo].ENVOLVIDOS.map((e: IEnvolvido): IEnvolvido => {
              return {
                ...e,
                ASSINATURA: null,
              }
            }),
          },
        }
      }
      status.push({
        ID_STATUS: tipo_encaminhamento,
        DH_STATUS: moment().format('DD/MM/YYYY HH:mm'),
      })
      setTextLoading('Concluindo Offline...')
      const newBo: BO = {
        ...bos[bo],
        BO_STATUS: status,
        ID_TIPO_DESFECHO: data.ID_TIPO_DESFECHO,
        NM_TIPO_DESFECHO: data.NM_TIPO_DESFECHO,
        OBJETOS: bos[bo].OBJETOS.map(o => {
          if (o.FOTO) {
            if (!o.FOTO.FOTO)
              return {
                ...o,
                FOTO: null,
              }
          }
          return o
        }),
      }

      if (bos[bo].ID_BO_COMPLEMENTAR) {
        editarComplementado(newBo)
      } else editar(newBo)

      try {
        setTextLoading('Salvando o BO Online...')
        const res = await api.post('/boOffline', newBo)
        if (res.status === 201) {
          let response: AxiosResponse | any
          let cd_ocorrencia_boe = null
          if (tipo_encaminhamento === TIPO_DESFECHO.DP) {
            setTextLoading(`Encaminhando BO...`)
            const source = axios.CancelToken.source()
            // const timeout = setTimeout(() => {
            //   source.cancel()
            // }, 10000)
            try {
              if (Config.ENVIRONMENT === Config.STAGE) {
                response = {
                  data: {
                    ID_OCORRENCIA: 10309921,
                    CD_NUMERO_BOE_COMPLEMENTAR: '23M1999000001',
                    ID_BOEPM: '04585114-7eb1-47bc-adb2-c1a471fe6428',
                    ID_AGENTE_CONDUTOR: '8835a35d-931c-4d87-8e1d-603193e17223',
                    DEVICE_ID_ONE_SIGNAL: 'bla bla bla',
                    APP_ID_ONE_SIGNAL: 'blu blu blu',
                    NUM_CIODS: '13467396',
                  },
                  status: 201,
                }
              } else {
                response = await axios.post(
                  `${
                    Config.urlEnvironments[Config.ENVIRONMENT].urlInfopol
                  }/ocorrencia`,
                  {
                    ...BODP,
                    BO: { ...BODP.BO, CRC: res.data.CRC },
                  },
                  // { cancelToken: source.token },
                )
              }

              // clearTimeout(timeout)
              if (response.status === 201) {
                cd_ocorrencia_boe = response.data.CD_NUMERO_BOE_COMPLEMENTAR
                try {
                  setTextLoading('Sincronizando dados...')
                  const responseUpdate = await api.put(
                    `/bo/updateStatus/${cd_ocorrencia_boe}`,
                    {},
                    {
                      headers: {
                        id_bo: bos[bo].ID_BO,
                      },
                    },
                  )
                  if (responseUpdate.status !== 200) {
                    cd_ocorrencia_boe = null
                  }
                } catch (error) {
                  cd_ocorrencia_boe = null
                }
                setShowLoading(false)
              }
            } catch (error) {}

            setShowLoading(false)
          }
          // Pega o ultimo Horario de finalização do BO
          const ultimoStatusRegistrado = status[status.length - 1]
          status.pop()
          status.push({
            ID_STATUS: tipo_encaminhamento,
            DH_STATUS: ultimoStatusRegistrado.DH_STATUS,
            HASH: res.data.HASH,
            CRC: res.data.CRC,
            BO_DP: cd_ocorrencia_boe,
          })

          if (bos[bo].ID_BO_COMPLEMENTAR) {
            editarComplementado(newBo)
          } else editar(newBo)

          if (tipo_encaminhamento === TIPO_DESFECHO.DP) {
            if (!cd_ocorrencia_boe) {
              Alert.alert(
                'Ops..',
                `Seu BO já foi salvo, porém ainda não foi encaminhado para DP. Tente novamente, acionando o DP "Vermelho"!`,
              )
            } else {
              Alert.alert(
                'BO enviado com sucesso!',
                `Apresente o código integrador "${cd_ocorrencia_boe}" na Delegacia para importação dos dados.`,
              )
            }
          }
          if (tipo_encaminhamento === TIPO_DESFECHO.LOCAL) {
            Alert.alert('Sucesso', 'BO concluído com sucesso.')
          }
          goHome()
        } else {
          // 403: Trata ocorrencia e informa que ocorrencia já existe
          setShowLoading(false)
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
                      // setShowBoxInput(true)
                    },
                  },
                ],
              )
              goHome()
              return
            }
            // 403: O Bo já foi concluido na DP
            if (res.data.USUARIO) {
              if (res.data.USUARIO.ID_STATUS === 4) {
                // Exclui o BO da lista
                Alert.alert('Atenção!', res.data)
                setShowLoading(false)
                goHome()
                return
              }
            }

            Alert.alert('Atenção!', res.data)
          }

          goHome()
          // eslint-disable-next-line no-unused-expressions
          Config.ENVIRONMENT === Config.HML
            ? Alert.alert(
                'OK',
                `Seu BO foi salvo localmente, porém ainda não está online. Tente salvar novamente clicando na núvem vermelha! ${
                  res.status
                }, ${JSON.stringify(res.data)}`,
              )
            : Alert.alert(
                'OK',
                `Seu BO foi salvo localmente, porém ainda não está online. Tente salvar novamente clicando na núvem vermelha!`,
              )
        }
      } catch (error) {
        goHome()
        if (Config.ENVIRONMENT === Config.HML) {
          Alert.alert(
            'Rede Indisponivel',
            `Seu BO foi salvo localmente, porém ainda não está online. ${error}`,
          )
        } else {
          Alert.alert(
            'Rede Indisponivel',
            'Seu BO foi salvo localmente, porém ainda não está online. Verifique sua VPN!',
          )
        }
      }
    } else {
      Alert.alert('Atenção', 'Este BO não está pronto para ser concluido')
    }
  }

  const changeNumeroOcorrencia = useCallback(
    (data: { CD_OCORRENCIA: string }) => {
      editar({
        ...bos[bo],
        CD_OCORRENCIA: mike,
      })
      setShowBoxInput(false)
    },
    [bo, bos, editar, mike],
  )

  function concluirLocal() {
    modalizeRef.current?.close()
    modalizeDesfechoRef.current?.open()
  }

  async function assinarBO(data: { SENHA: string }) {
    const userNameStorage = await AsyncStorage.getItem('@username')

    if (userNameStorage) {
      const usuarioSemBase = userNameStorage.split('@')

      setTextLoading('Validando senha...')
      setShowLoading(true)

      try {
        const res = await api.post('/validate-login', {
          login: usuarioSemBase[0],
          senha,
        })
        setShowLoading(false)
        if (res.status === 200) {
          if (desfechoEscolhido) await finalizar(desfechoEscolhido)
          else {
            Alert.alert('Atenção', 'Você não escolheu o desfecho!')
            setSenha('')
          }
          return
        }
        if (res.status === 401) {
          setSenha('')
          Alert.alert(
            `Não Autorizado`,
            `${res.data}\n\nUsuário: ${username}\nSenha: ${senha}\n\nConfira se seus dados estão corretos.\nNão mostre essa tela a ninguém!`,
          )
          return
        }
        Alert.alert(
          'Atenção',
          `${res.status} - Verifique a sua internet e sua VPN!`,
        )
      } catch (error) {
        // clearTimeout(timeout)
        setShowLoading(false)
        setShowSenhaInput(false)
        Alert.alert('Atenção', 'Verifique sua internet e sua VPN!')
      }
    }
  }

  async function escolheDesfecho(data: any) {
    const desf = desfechoLocal.find(
      item => item.DES_ID === data.ID_TIPO_DESFECHO,
    )
    if (desf) {
      modalizeDesfechoRef.current?.close()
      setDesfechoEscolhido({
        descDesfecho: {
          ID_TIPO_DESFECHO: data.ID_TIPO_DESFECHO,
          NM_TIPO_DESFECHO: desf.DES_DESCRICAO,
        },
        tipoEncaminhamento: TIPO_DESFECHO.LOCAL,
      })
      setShowSenhaInput(true)
    } else {
      Alert.alert(
        'Atenção',
        'Esse Tipo de Desfecho não está listado nas opções do sistema',
      )
    }
  }

  function encaminharDP() {
    modalizeRef.current?.close()
    // if (bo) {
    if (bos[bo].ENVOLVIDOS.length === 0 && bos[bo].OBJETOS.length === 0) {
      Alert.alert(
        'Não Permitida',
        'Esta Ocorrência não pode ser encaminhada pra DP, pois deve conter ao menos 1 (um) envolvido ou 1 (um) objeto.',
      )
    } else {
      let msg = ''
      if (false) {
        msg =
          'Este APP só é válido para TREINAMENTOS. Seu BO é inválido e não será encaminhado para DP'
      } else {
        msg =
          'O BO é um documento oficial, o elabore com o máximo de ATENÇÃO possível, pois após a "CONCLUSÃO NA DP" você não poderá editá-lo!'
      }
      Alert.alert('ATENÇÃO!', msg, [
        {
          text: 'VOLTAR',
        },
        {
          text: 'ENCAMINHAR',
          onPress: async () => {
            setDesfechoEscolhido({
              descDesfecho: {
                ID_TIPO_DESFECHO: '36',
                NM_TIPO_DESFECHO: 'ENCAMINHADO PARA DP',
              },
              tipoEncaminhamento: TIPO_DESFECHO.DP,
            })
            setShowSenhaInput(true)
          },
        },
      ])
    }
    // }
  }

  const style = `.m-signature-pad--footer
  .save {
      display: none;
  }
  .clear {
      display: none;
  }
  body,html {
    width: 400px;
    height: 180px;
  }`

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 250,
      padding: 10,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    },
  })

  const handleClear = () => {
    sign.current?.clearSignature()
    setShowAssinatura(false)
    setShowAssinatura(true)
  }
  const handleConfirm = () => {
    sign.current?.readSignature()
  }

  const editarAssinatura = (e: IEnvolvido) => {
    Alert.alert(
      'Atenção',
      `Tem certeza que deseja editar a assinatura de '${e.NOME_RAZAO_SOCIAL}' ?`,
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: () => {
            setEnvolvido(e)
            setShowAssinatura(true)
          },
        },
      ],
    )
  }

  const assinaturaTela = (e: IEnvolvido) => {
    setEnvolvido(e)
    setShowAssinatura(true)
  }

  const excluirAssinatura = (e: IEnvolvido) => {
    Alert.alert(
      'Atenção',
      `Tem certeza que deseja excluir a assinatura de '${e.NOME_RAZAO_SOCIAL}'?`,
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: () => {
            // if (bo) {
            const envs: IEnvolvido[] = bos[bo].ENVOLVIDOS as IEnvolvido[]

            const newEnv: IEnvolvido = { ...e, ASSINATURA: null }
            const index = envs.findIndex(
              (item: IEnvolvido) => item.ID_ENVOLVIDO === e.ID_ENVOLVIDO,
            )
            envs.splice(index, 1, newEnv)

            editar({
              ...bos[bo],
              ENVOLVIDOS: envs,
            })
          },
        },
      ],
    )
  }

  const handleOK = (signature: string) => {
    const envs: IEnvolvido[] = bos[bo].ENVOLVIDOS as IEnvolvido[]

    if (envolvido) {
      const newEnv: IEnvolvido = { ...envolvido, ASSINATURA: signature }
      const index = envs.findIndex(
        (item: IEnvolvido) => item.ID_ENVOLVIDO === envolvido.ID_ENVOLVIDO,
      )
      envs.splice(index, 1, newEnv)
      editar({
        ...bos[bo],
        ENVOLVIDOS: envs,
      })
    } else {
      Alert.alert(
        'Erro',
        'Essa assinatura não está atrelada a nenhum Envolvido!',
      )
    }
    // }

    setShowAssinatura(false)
  }

  const handleEmpty = () => {
    Alert.alert('Opa')
    setShowAssinatura(false)
  }

  const handleData = data => {}
  return (
    <>
      {showAssinatura && (
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000ff',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 1000,
          }}
        >
          <View
            style={{
              width: 400,
              height: 270,
              position: 'absolute',
              zIndex: 1001,
              transform: [{ rotate: '90deg' }],
              top: (responsiveScreenHeight(100) - 400) / 2 + 50,
              left: (responsiveScreenWidth(100) - 250) / 2 - 80,
            }}
          >
            <SignatureView
              ref={sign}
              autoClear
              bgSrc=""
              onClear={() => handleClear()}
              onEmpty={handleEmpty}
              onGetData={handleData}
              webStyle={style}
              onOK={s => handleOK(s)}
              descriptionText={`Assinatura de ${envolvido?.NOME_RAZAO_SOCIAL}`}
            />
            <View style={styles.row}>
              <Button title="Limpar" onPress={() => handleClear()} />
              <Button title="Fechar" onPress={() => setShowAssinatura(false)} />
              <Button title="Confirmar" onPress={() => handleConfirm()} />
            </View>
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <Container>
          {!bos[bo] ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <Certidao>
              {(!bos[bo].RESPONSAVEIS.find(
                resp => resp.CD_TIPO_ENVOLVIMENTO === 1,
              ) ||
                !bos[bo].DADOS_COMPLEMENTARES) && (
                <RascunhoText>Rascunho</RascunhoText>
              )}
              <Header>
                <LogoSDS source={logo} />
                <H1>GOVERNO DO ESTADO DE PERNAMBUCO</H1>
                <H1>SECRETARIA DE DEFESA SOCIAL</H1>
                <H1 style={{ marginBottom: 5 }}>
                  POLÍCIA MILITAR DE PERNAMBUCO
                </H1>
                <TitleText style={{ textAlign: 'center' }}>
                  <Negrito>{bos[bo].NM_UNID_OPERACIONAL}</Negrito>
                </TitleText>
                <TitleText style={{ textAlign: 'center' }}>
                  BOLETIM DE OCORRÊNCIA Nº:
                  <Negrito>
                    {' M-'}
                    {bos[bo].CD_OCORRENCIA}
                  </Negrito>
                </TitleText>
                <TitleText>
                  DESFECHO:
                  <Negrito>
                    {' '}
                    {bos[bo].NM_TIPO_DESFECHO || 'EM ANDAMENTO'}
                  </Negrito>
                </TitleText>
                {/* <TitleText style={{ marginTop: 10 }}>
              Ocorrência registrada por este efetivo policial no dia
              <Negrito>06/04/2021 às 08:40</Negrito>
            </TitleText> */}
              </Header>
              <Section>
                <SectionTitle>Transcrição do fato</SectionTitle>
                <SectionContent>
                  <SectionItem>
                    Prefixo da Viatura: <Negrito>{bos[bo].DS_VIATURA}</Negrito>
                  </SectionItem>
                  <SectionItem>
                    Naturezas:{' '}
                    <Negrito>
                      {bos[bo].NATUREZAS.map(item => `${item.NATUREZA}/`)}
                    </Negrito>
                  </SectionItem>
                  <SectionItem>
                    Data do Fato: <Negrito>{bos[bo].DH_FATO}</Negrito>
                  </SectionItem>
                  <SectionItem>
                    Endereço do Fato:{' '}
                    <Negrito>
                      {bos[bo].ENDERECO.LOGRADOURO ||
                        'LOGRADOURO NÃO INFORMADO'}
                      ;{' '}
                      {bos[bo].ENDERECO.COMPLEMENTO ||
                        'COMPLEMENTO NÃO INFORMADO'}
                      ;{bos[bo].ENDERECO.NUMERO || 'NÚMERO NÃO INFORMADO'};
                      {bos[bo].ENDERECO.CEP || 'CEP NÃO INFORMADO'};{' '}
                      {bos[bo].ENDERECO.BAIRRO || 'BAIRRO NÃO INFORMADO'};
                      {bos[bo].ENDERECO.MUNICIPIO || 'MUNICÍPIO NÃO INFORMADO'};
                      {bos[bo].ENDERECO.NM_UF ? bos[bo].ENDERECO.NM_UF : 'PE'};
                      BRASIL
                    </Negrito>
                  </SectionItem>
                  <SectionItem>
                    Local Principal:{' '}
                    <Negrito>{bos[bo].NM_LOCAL_OCORRENCIA}</Negrito>
                  </SectionItem>
                  <SectionItem>
                    Ponto de Referência:{' '}
                    <Negrito>
                      {bos[bo].ENDERECO.PONTO_REFERENCIA || 'NÃO INFORMADO'}
                    </Negrito>
                  </SectionItem>
                  <SectionItem style={{ marginTop: 10 }}>
                    Envolvidos:
                  </SectionItem>

                  {bos[bo].ENVOLVIDOS.length === 0 ? (
                    <Negrito>ESTA OCORRÊNCIA NÃO POSSUI ENVOLVIDOS</Negrito>
                  ) : (
                    bos[bo].ENVOLVIDOS.map(env => (
                      <Negrito key={env.ID_ENVOLVIDO}>
                        {`${env.NOME_RAZAO_SOCIAL} (${env.NM_TIPO_ENVOLVIMENTO_PESSOA})`}
                      </Negrito>
                    ))
                  )}

                  <SectionItem style={{ marginTop: 10 }}>
                    Objeto(s) envolvido(s) na Ocorrência:
                  </SectionItem>
                  {bos[bo].OBJETOS.length === 0 ? (
                    <Negrito>ESTA OCORRÊNCIA NÃO POSSUI OBJETOS</Negrito>
                  ) : (
                    bos[bo].OBJETOS.map(obj => (
                      <SectionItem key={obj.ID_OBJETO}>
                        <Negrito key={obj.ID_OBJETO}>
                          {obj.NM_TIPO_OBJETO}
                        </Negrito>
                        ({obj.NM_TIPO_ENV_OBJETO}), em posse do(a) Sr(a):{' '}
                        <Negrito>
                          {obj.NOME_ENVOLVIDO || 'DESCONHECIDO'}
                        </Negrito>
                      </SectionItem>
                    ))
                  )}
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>Envolvidos</SectionTitle>
                {bos[bo].ENVOLVIDOS.length === 0 ? (
                  <Negrito style={{ padding: 5 }}>
                    NÃO FORAM ADICIONADOS ENVOLVIDOS NESTA OCORRÊNCIA
                  </Negrito>
                ) : (
                  bos[bo].ENVOLVIDOS.map(env => (
                    <SectionContent key={env.ID_ENVOLVIDO}>
                      <SectionCount
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: '#ccc',
                          marginBottom: 5,
                        }}
                      >
                        {`ENVOLVIDO N° ${contEnv++}`}
                      </SectionCount>
                      <SectionItem>
                        Tipo Pessoa:{' '}
                        <Negrito>
                          {env.TIPO_PESSOA === 'F' ? 'FISICA' : 'JURIDICA'}
                        </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Pessoa: <Negrito>{env.NOME_RAZAO_SOCIAL}</Negrito>
                      </SectionItem>
                      <SectionItem>
                        Tipo de Envolvimento:{' '}
                        <Negrito>{env.NM_TIPO_ENVOLVIMENTO_PESSOA}</Negrito>
                      </SectionItem>
                      <SectionItem>
                        Contato:{' '}
                        <Negrito>{env.TELEFONE || 'NÃO INFORMADO'}</Negrito>
                      </SectionItem>
                      {env.DOCUMENTOS.length === 0 ? (
                        <SectionItem>
                          DOCUMENTOS:{' '}
                          <Negrito> NÃO FOI INFORMADO NENHUM DOCUMENTO</Negrito>
                        </SectionItem>
                      ) : (
                        env.DOCUMENTOS.map(doc => (
                          <SectionItem key={doc.NUMERO}>
                            {doc.NM_TIPO_DOCUMENTO}: {doc.NUMERO}
                            <Negrito>
                              {env.TIPO_PESSOA === 'F'
                                ? `/${doc.ORGAO_DOCUMENTO}`
                                : ''}
                            </Negrito>
                          </SectionItem>
                        ))
                      )}
                      {env.TIPO_PESSOA === 'F' && (
                        <>
                          <SectionItem>
                            Sexo: <Negrito>{env.DS_SEXO}</Negrito>
                          </SectionItem>
                          <SectionItem>
                            Orientação Afetivo-Sexual:{' '}
                            <Negrito> {env.DS_ORIENT_SEXUAL}</Negrito>
                          </SectionItem>
                          <SectionItem>
                            Identidade de Gênero:{' '}
                            <Negrito> {env.DS_GENERO}</Negrito>
                          </SectionItem>
                        </>
                      )}
                      {env.TIPO_PESSOA === 'F' && (
                        <>
                          <SectionItem>
                            Mãe:{' '}
                            <Negrito>
                              {' '}
                              {env.NOME_MAE || 'NÃO INFORMADO'}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Pai:{' '}
                            <Negrito>
                              {' '}
                              {env.NOME_PAI || 'NÃO INFORMADO'}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Data de Nascimento:{' '}
                            <Negrito>
                              {env.DATA_NASCIMENTO || 'NÃO INFORMADO'}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Naturalidade:{' '}
                            <Negrito>
                              {' '}
                              {env.NATURALIDADE || 'NÃO INFORMADO'}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Estado Civil:{' '}
                            <Negrito>
                              {' '}
                              {env.NM_ESTADO_CIVIL || 'NAO INFORMADO'}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Escolaridade:{' '}
                            <Negrito> {env.NM_ESCOLARIDADE}</Negrito>
                          </SectionItem>
                        </>
                      )}
                      <SectionItem>
                        {env.TIPO_PESSOA === 'F'
                          ? 'Profissão:'
                          : 'Ramo de Atuação:'}
                        <Negrito>
                          {' '}
                          {env.DADOS_PROFISSIONAIS?.NM_PROFISSAO ||
                            'NÃO INFORMADO'}
                        </Negrito>
                      </SectionItem>
                      {env.TIPO_PESSOA === 'F' && (
                        <SectionItem>
                          Turista: <Negrito> {env.TURISTA}</Negrito>
                        </SectionItem>
                      )}
                      <SectionItem style={{ marginTop: 10 }}>
                        Características físicas:
                      </SectionItem>
                      {!env.CARACTERISTICAS ? (
                        <Negrito>NÃO INFORMADAS</Negrito>
                      ) : (
                        <>
                          <SectionItem>
                            Bigode:{' '}
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.BIGODE === '0'
                                  ? 'NÃO'
                                  : 'SIM'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Cor do Cabelo:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_COR_CABELO ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Tipo do Cabelo:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_TIPO_CABELO ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Pelagem Facial:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_TIPO_PELAGEM_FACIAL ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Cor da Pele:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_COR_PELE ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Cor dos Olhos:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_COR_OLHOS ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Aparência/Porte:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_TIPO_APARENCIA ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Tatuagem:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.TATUAGEM || 'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Cicatriz:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.TIPO_CICATRIZ ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Dentes:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.TIPO_DENTES ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Defeito Físico:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_TIPO_DEFEITO_FISICO ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Pessoa com Deficiência:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_TIPO_DEFICIENCIA ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Marca Física:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.NM_TIPO_MARCA_FISICA ||
                                'NÃO INFORMADO ou NÃO POSSUI'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Peso Aparente:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.PESO || 'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Altura Aparente:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.ALTURA_APARENTE ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                          <SectionItem>
                            Idade Aparente:
                            <Negrito>
                              {` ${
                                env.CARACTERISTICAS?.IDADE_APARENTE ||
                                'NÃO INFORMADO'
                              }`}
                            </Negrito>
                          </SectionItem>
                        </>
                      )}

                      <SectionItem style={{ marginTop: 10 }}>
                        Endereço:{' '}
                        {env.ENDERECO_RESIDENCIAL === null ? (
                          <Negrito>NÃO INFORMADO</Negrito>
                        ) : (
                          <Negrito>
                            {' '}
                            {env.ENDERECO_RESIDENCIAL.LOGRADOURO ||
                              'LOGRAOURO NÃO INFORMADO'}
                            ,
                            {env.ENDERECO_RESIDENCIAL.NUMERO ||
                              'NÚMERO NÃO INFORMADO'}
                            ;
                            {env.ENDERECO_RESIDENCIAL.CEP ||
                              'CEP NÃO INFORMADO'}
                            ;
                            {env.ENDERECO_RESIDENCIAL.BAIRRO ||
                              'BAIRRO NÃO INFORMADO'}
                            ;
                            {env.ENDERECO_RESIDENCIAL.MUNICIPIO ||
                              'MUNICIPIO NÃO INFORMADO'}
                            ;
                            {env.ENDERECO_RESIDENCIAL.NM_UF ||
                              'UF NÃO INFORMADA'}
                            ; BRASIL
                          </Negrito>
                        )}
                      </SectionItem>
                      <SectionItem style={{ marginTop: 10 }}>
                        Dados Profissionais: {'\n'}
                        {env.DADOS_PROFISSIONAIS === null ? (
                          <Negrito>NÃO INFORMADO</Negrito>
                        ) : (
                          <>
                            <SectionItem>
                              Profissão:
                              <Negrito>
                                {` ${
                                  env.DADOS_PROFISSIONAIS.NM_PROFISSAO ||
                                  'NÃO INFORMADO'
                                }`}
                              </Negrito>
                            </SectionItem>
                            <SectionItem>
                              {'\n'}Nome da Empresa:
                              <Negrito>
                                {` ${
                                  env.DADOS_PROFISSIONAIS.NOME_EMPRESA ||
                                  'NÃO INFORMADO'
                                }`}
                              </Negrito>
                            </SectionItem>
                            <SectionItem>
                              {'\n'}Contato da Empresa:
                              <Negrito>
                                {` ${
                                  env.DADOS_PROFISSIONAIS.FONE_COMERCIAL ||
                                  'NÃO INFORMADO'
                                }`}
                              </Negrito>
                            </SectionItem>
                            <SectionItem>
                              {'\n'}Endereço Profissional:
                              {env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL ===
                              null ? (
                                <Negrito> NÃO INFORMADO</Negrito>
                              ) : (
                                <Negrito>
                                  {' '}
                                  {env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL
                                    .LOGRADOURO || 'LOGRAOURO NÃO INFORMADO'}
                                  ,
                                  {env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL
                                    .NUMERO || 'NÚMERO NÃO INFORMADO'}
                                  ;
                                  {env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL
                                    .CEP || 'CEP NÃO INFORMADO'}
                                  ;
                                  {env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL
                                    .BAIRRO || 'BAIRRO NÃO INFORMADO'}
                                  ;
                                  {env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL
                                    .MUNICIPIO || 'MUNICIPIO NÃO INFORMADO'}
                                  ;
                                  {env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL
                                    .NM_UF || 'UF NÃO INFORMADA'}
                                  ; BRASIL
                                </Negrito>
                              )}
                            </SectionItem>
                          </>
                        )}
                      </SectionItem>
                      <SectionItem style={{ marginTop: 10 }}>
                        Modus Operandi: {'\n'}
                        {env.MODUS_OPERANDI === null ? (
                          <Negrito>NÃO INFORMADO</Negrito>
                        ) : (
                          <>
                            Forma de Aproximação:
                            <Negrito>
                              {` ${env.MODUS_OPERANDI.NM_FORMA_APROXIMACAO}`}
                            </Negrito>
                            {'\n'}
                            Forma de Ação da Abordagem:
                            <Negrito>
                              {` ${env.MODUS_OPERANDI.NM_FORMA_ACAO_ABORDAGEM}`}
                            </Negrito>
                            {'\n'}
                            Local de Entrada:
                            <Negrito>
                              {` ${env.MODUS_OPERANDI.NM_LOCAL_ENTRADA}`}
                            </Negrito>
                            {'\n'}
                            Forma de Entrada:
                            <Negrito>
                              {` ${env.MODUS_OPERANDI.NM_FORMA_ENTRADA}`}
                            </Negrito>
                            {'\n'}
                            Forma de Evasão:
                            <Negrito>
                              {` ${env.MODUS_OPERANDI.NM_FORMA_DE_EVASAO}`}
                            </Negrito>
                            {'\n'}
                            Alterações no Local:
                            <Negrito>
                              {` ${env.MODUS_OPERANDI.NM_ALTERACOES_NO_LOCAL}`}
                            </Negrito>
                            {'\n'}
                            Crimes Sexuais:
                            <Negrito>
                              {` ${env.MODUS_OPERANDI.NM_CRIMES_SEXUAIS}`}
                            </Negrito>
                            {'\n'}
                            Estelionato:
                            <Negrito>{` ${env.MODUS_OPERANDI.NM_ESTELIONATO}`}</Negrito>
                          </>
                        )}
                      </SectionItem>
                      {env.USO_FORCA.length !== 0 && (
                        <SectionItem>
                          {'\n'}Usos da força necessários na abordagem deste
                          Envolvido: {'\n'}
                          {env.USO_FORCA.map(forca => {
                            return (
                              <View key={forca.ID_TIPO_USO_FORCA}>
                                <Icon name="check" size={15} color="#777" />
                                <Negrito>
                                  {forca.NM_TIPO_USO_FORCA}{' '}
                                  {forca.ID_TIPO_USO_FORCA === '3' &&
                                    ' (Utilizadas Conforme Súmula Vinculante Nº 11 do STF).'}
                                  {'\n'}
                                </Negrito>
                              </View>
                            )
                          })}
                        </SectionItem>
                      )}
                      {env.ASSINATURA && (
                        <>
                          <Image
                            source={{ uri: env.ASSINATURA }}
                            style={{
                              width: '100%',
                              height: 90,
                              resizeMode: 'contain',
                            }}
                          />

                          <SectionItem>
                            Assinatura de {env.NOME_RAZAO_SOCIAL}
                          </SectionItem>
                        </>
                      )}
                      {env.ASSINATURA &&
                        bos[bo].BO_STATUS[bos[bo].BO_STATUS.length - 1]
                          .ID_STATUS < 2 && (
                          <>
                            <Button
                              title="Editar Assinatura"
                              color="#888"
                              onPress={() => {
                                editarAssinatura(env)
                              }}
                            />
                            <Button
                              title="Excluir Assinatura"
                              color="#f00"
                              onPress={() => {
                                excluirAssinatura(env)
                              }}
                            />
                          </>
                        )}
                      {!env.ASSINATURA &&
                        (env.ID_TIPO_ENV_PESSOA === '1' ||
                          env.ID_TIPO_ENV_PESSOA === '3' ||
                          env.ID_TIPO_ENV_PESSOA === '4' ||
                          env.ID_TIPO_ENV_PESSOA === '8' ||
                          (env.ID_TIPO_ENV_PESSOA === '6' &&
                            bos[bo].NATUREZAS.find(
                              n =>
                                n.ID_NATUREZA === '280' ||
                                n.ID_NATUREZA === '331' ||
                                n.ID_NATUREZA === '330' ||
                                n.ID_NATUREZA === '446',
                            ))) &&
                        bos[bo].BO_STATUS[bos[bo].BO_STATUS.length - 1]
                          .ID_STATUS < 2 && (
                          <Button
                            title={`Assinatura de ${
                              env.NOME_RAZAO_SOCIAL.split(' ')[0]
                            }`}
                            onPress={() => {
                              assinaturaTela(env)
                            }}
                          />
                        )}
                    </SectionContent>
                  ))
                )}
              </Section>

              <Section>
                <SectionTitle>Objetos</SectionTitle>
                {bos[bo].OBJETOS.length === 0 ? (
                  <Negrito style={{ padding: 5 }}>
                    NÃO FORAM ADICIONADOS OBJETOS NESTA OCORRÊNCIA
                  </Negrito>
                ) : (
                  bos[bo].OBJETOS.map(obj => (
                    <SectionContent key={obj.ID_OBJETO}>
                      <SectionCount
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: '#ccc',
                          marginBottom: 5,
                        }}
                      >
                        {`OBJETO Nº ${contObj++}`}
                      </SectionCount>
                      <SectionItem>
                        Tipo do Objeto:
                        <Negrito> {obj.NM_TIPO_OBJETO} </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Categoria do Objeto:
                        <Negrito> {obj.NM_CATEGORIA} </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Em posse de:
                        <Negrito>
                          {` ${obj.NOME_ENVOLVIDO || 'DESCONHECIDO'}`}
                        </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Marca:
                        <Negrito> {obj.NM_MARCA || 'NÃO INFORMADA'} </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Modelo:
                        <Negrito> {obj.NM_MODELO || 'NÃO INFORMADO'} </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Cor:
                        <Negrito>
                          {` ${obj.NM_COR_OBJETO || 'NÃO INFORMADA'}`}
                        </Negrito>
                      </SectionItem>
                      {obj.ID_OBJ_ARMA && (
                        <SectionItem style={{ marginTop: 10 }}>
                          Caracteristicas Adicionais: {'\n'}
                          Identificação:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.CD_IDENT_ARMA || 'NÃO INFORMADA'
                            } \n`}
                          </Negrito>
                          Dimensão:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.NM_DIMENSAO_ARMA ||
                              'NÃO INFORMADA'
                            } \n`}
                          </Negrito>
                          Acabamento:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.NM_ACABAMENTO_ARMA ||
                              'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Sistema:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.NM_SISTEMA_ARMA || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Coronha:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.NM_CORONHA_ARMA || 'NÃO INFORMADA'
                            }\n`}
                          </Negrito>
                          Calibre:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.VL_CALIBRE || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Quantidade de Canos:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.VL_QTD_CANOS || 'NÃO INFORMADA'
                            }\n`}
                          </Negrito>
                          Quantidade de Munições:
                          <Negrito>
                            {` ${
                              obj.ID_OBJ_ARMA.QTD_MUNICAO || 'NÃO INFORMADA'
                            }`}
                          </Negrito>
                        </SectionItem>
                      )}
                      {obj.ID_VEICULO && (
                        <SectionItem>
                          Caracteristicas Adicionais: {'\n'}
                          Placa:
                          <Negrito>
                            {` ${obj.ID_VEICULO.CD_PLACA || 'NÃO INFORMADA'}\n`}
                          </Negrito>
                          Chassi:
                          <Negrito>
                            {` ${
                              obj.ID_VEICULO.CD_CHASSI || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Renavam:
                          <Negrito>
                            {` ${
                              obj.ID_VEICULO.CD_RENAVAM || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Ano Fabricação:
                          <Negrito>
                            {` ${
                              obj.ID_VEICULO.CD_ANO_FABRICACAO ||
                              'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Ano Modelo:
                          <Negrito>
                            {` ${
                              obj.ID_VEICULO.CD_ANO_MODELO || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Combustivel:
                          <Negrito>
                            {` ${
                              obj.ID_VEICULO.NM_TIPO_COMBUSTIVEL ||
                              'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                        </SectionItem>
                      )}
                      {obj.ID_CELULAR && (
                        <SectionItem>
                          Caracteristicas Adicionais: {'\n'}
                          Imei 1:
                          <Negrito>
                            {` ${
                              obj.ID_CELULAR.CEL_IMEI1 || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Imei 2:
                          <Negrito>
                            {` ${
                              obj.ID_CELULAR.CEL_IMEI2 || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Imei 3:
                          <Negrito>
                            {` ${
                              obj.ID_CELULAR.CEL_IMEI3 || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Imei 4:
                          <Negrito>
                            {` ${
                              obj.ID_CELULAR.CEL_IMEI4 || 'NÃO INFORMADO'
                            }\n`}
                          </Negrito>
                          Justificativa (IMEI):
                          <Negrito>
                            {` ${
                              obj.ID_CELULAR.CEL_IMEI_JUSTIFICATIVA ||
                              'NÃO INFORMADA'
                            }\n`}
                          </Negrito>
                        </SectionItem>
                      )}
                      <SectionItem>
                        Número de Série:
                        <Negrito> {obj.NUM_SERIE || 'NÃO INFORMADO'} </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Objeto Apreendido:
                        <Negrito>
                          {obj.APREENDIDO === '1' ? 'SIM' : 'NÃO'}
                        </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Valor:
                        <Negrito> {obj.VL_VALOR || 'NÃO INFORMADO'} </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Unidade de Medida:
                        <Negrito>
                          {' '}
                          {obj.NM_UNIDADE_MEDIDA || 'NÃO INFORMADA'}{' '}
                        </Negrito>
                      </SectionItem>
                      <SectionItem>
                        Quantidade:
                        <Negrito> {obj.QTD_OBJETO || 'NÃO INFORMADA'} </Negrito>
                      </SectionItem>
                    </SectionContent>
                  ))
                )}
              </Section>
              <Section>
                <SectionTitle>Dados Complementares</SectionTitle>
                <SectionContent>
                  {bos[bo].DADOS_COMPLEMENTARES ? (
                    <Negrito>{bos[bo].DADOS_COMPLEMENTARES}</Negrito>
                  ) : (
                    <Negrito style={{ color: '#f00' }}>
                      {' '}
                      DADOS COMPLEMENTARES AINDA NÃO FORAM INFORMADOS
                    </Negrito>
                  )}
                </SectionContent>
              </Section>
              <Section>
                <SectionTitle>Responsáveis</SectionTitle>
                {bos[bo].RESPONSAVEIS.map(resp => {
                  return (
                    <SectionContent key={resp.ID_USUARIO}>
                      <SectionCount>
                        {resp.CD_TIPO_ENVOLVIMENTO === 0
                          ? '* Condutor'
                          : resp.CD_TIPO_ENVOLVIMENTO === 1
                          ? '* Patrulheiro'
                          : '* Apoio'}
                      </SectionCount>
                      <SectionItem>
                        Matricula: <Negrito>{resp.MATRICULA}</Negrito>
                      </SectionItem>
                      <SectionItem>
                        RG: <Negrito>{resp.RG}</Negrito>
                      </SectionItem>
                      <SectionItem>
                        Nome: <Negrito>{resp.NOME_COMPLETO}</Negrito>
                      </SectionItem>
                      <SectionItem>
                        Posto/Graduação: <Negrito>{resp.CARGO}</Negrito>
                      </SectionItem>
                      <SectionItem>
                        Unidade Operacional:{' '}
                        <Negrito>
                          {resp.ORGANIZACAO_DISPOSICAO === 'OE'
                            ? 'ÓRGÃO EXTERNO'
                            : resp.ORGANIZACAO_DISPOSICAO}
                        </Negrito>
                      </SectionItem>
                    </SectionContent>
                  )
                })}
                {!bos[bo].RESPONSAVEIS.find(
                  resp => resp.CD_TIPO_ENVOLVIMENTO === 1,
                ) && (
                  <Negrito style={{ paddingLeft: 5, color: '#f00' }}>
                    Falta adicionar ao menos um patrulheiro
                  </Negrito>
                )}
              </Section>
              {idStatus > 1 && (
                <Section>
                  <SectionTitle>Validação</SectionTitle>
                  <SectionContent>
                    <SectionItem>
                      Documento criado eletrônicamente por{' '}
                      <Negrito>{bos[bo].RESPONSAVEIS[0].NOME_COMPLETO}</Negrito>
                      , em {bos[bo].DH_REGISTRO}h.
                    </SectionItem>
                    {hash ? (
                      <>
                        <Hash>{hash}</Hash>
                        <SectionItem>
                          Verificador: <Negrito>{crc}</Negrito>
                        </SectionItem>
                      </>
                    ) : (
                      <HashError>
                        SEU BO AINDA ESTÁ OFFLINE!. Verifique sua VPN, Volte na
                        tela inicial e clique na nuvem vermelha!
                      </HashError>
                    )}
                  </SectionContent>
                </Section>
              )}
              <Section>
                <SectionTitle>Imagens Complementares</SectionTitle>
                <SectionContent>
                  {bos[bo].OBJETOS.every(item => item.FOTO === null) ? (
                    <SectionItem>
                      <Negrito>NÃO FORAM ADIONADAS FOTOS NESTE BO</Negrito>
                    </SectionItem>
                  ) : (
                    bos[bo].OBJETOS.map(
                      obj =>
                        obj.FOTO && (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            key={obj.FOTO.ID}
                          >
                            <Image
                              source={{
                                uri: `data:image/jpeg;base64,${obj.FOTO.FOTO}`,
                              }}
                              style={{
                                width: 280,
                                height: 180,
                                resizeMode: 'cover',
                              }}
                            />
                            <SectionItem>
                              {`Nº ${contImgObj++} - ${
                                obj.NM_TIPO_OBJETO
                              }, EM POSSE DE ${
                                obj.NOME_ENVOLVIDO || ': NÃO INFORMADO'
                              }`}
                            </SectionItem>
                          </View>
                        ),
                    )
                  )}
                </SectionContent>
              </Section>
            </Certidao>
          )}
          {idStatus === 1 && !showLoading && !showBoxInput && (
            <BtnFinalizar onPress={() => openModal()}>
              <BtnText>Finalizar</BtnText>
            </BtnFinalizar>
          )}
        </Container>
        <Modalize
          ref={modalizeRef}
          snapPoint={135}
          modalHeight={135}
          HeaderComponent={() => (
            <ModalHeader>
              <ModalHeaderText>Escolha uma Opção</ModalHeaderText>
            </ModalHeader>
          )}
        >
          <View>
            <ModalItem onPress={() => concluirLocal()}>
              <Icon name="arrow-down" size={20} color="#777" />
              <ModalItemText>Concluir no Local</ModalItemText>
            </ModalItem>
            <ModalItem onPress={() => encaminharDP()}>
              <Icon name="external-link" size={20} color="#777" />
              <ModalItemText>Encaminhar para DP</ModalItemText>
            </ModalItem>
          </View>
        </Modalize>
        <Modal
          transparent
          visible={showLoading}
          statusBarTranslucent
          hardwareAccelerated
        >
          <Loading animating text={textLoading} />
        </Modal>

        <Modalize ref={modalizeDesfechoRef} snapPoint={135} modalHeight={135}>
          <DesfechoContent>
            <Select
              name="ID_TIPO_DESFECHO"
              label="Escolha o Desfecho"
              prompt="Escolha o Desfecho"
              control={control}
              error={errors.ID_TIPO_DESFECHO}
              rules={{ required: true }}
              defaultValue="10"
            >
              {desfechoLocal.map(desfeco => {
                return (
                  <Picker.Item
                    key={desfeco.DES_ID}
                    label={desfeco.DES_DESCRICAO}
                    value={desfeco.DES_ID}
                  />
                )
              })}
            </Select>
            <BtnEscolherDesfecho onPress={handleSubmit(escolheDesfecho)}>
              <BtnText>Concluir Ocorrência</BtnText>
            </BtnEscolherDesfecho>
          </DesfechoContent>
        </Modalize>
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
            label="Digite o Mike correto"
            onChangeText={text => setMike(text)}
            value={mike}
          >
            <ContainerButtonChangeOcorrencia>
              <ButtonVoltarChangeOcorrencia
                onPress={() => setShowBoxInput(false)}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto-Bold',
                    fontSize: 15,
                  }}
                >
                  Voltar
                </Text>
              </ButtonVoltarChangeOcorrencia>
              <ButtonChangeOcorrencia
                onPress={() =>
                  mike && changeNumeroOcorrencia({ CD_OCORRENCIA: mike })
                }
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto-Bold',
                    fontSize: 15,
                  }}
                >
                  Ok
                </Text>
              </ButtonChangeOcorrencia>
            </ContainerButtonChangeOcorrencia>
          </BoxInput>
        </Modal>
        {/** MODAL PARA PEDIR SENHA DO USUARIO */}
        <Modal
          transparent
          visible={showSenhaInput}
          statusBarTranslucent
          hardwareAccelerated
        >
          <BoxInput
            control={controlSenha}
            error={errorsSenha.SENHA}
            maxLength={20}
            isPassword
            name="SENHA"
            label="Digite novamente a sua senha de login"
            onChangeText={text => setSenha(text)}
            value={senha}
          >
            <ContainerButtonChangeOcorrencia>
              <ButtonVoltarChangeOcorrencia
                onPress={() => {
                  setSenha('')
                  setShowSenhaInput(false)
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto-Bold',
                    fontSize: 15,
                  }}
                >
                  Voltar
                </Text>
              </ButtonVoltarChangeOcorrencia>
              <ButtonChangeOcorrencia
                onPress={() => senha && assinarBO({ SENHA: senha })}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto-Bold',
                    fontSize: 15,
                  }}
                >
                  Ok
                </Text>
              </ButtonChangeOcorrencia>
            </ContainerButtonChangeOcorrencia>
          </BoxInput>
        </Modal>
      </KeyboardAvoidingView>
    </>
  )
}
