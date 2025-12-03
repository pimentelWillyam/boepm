/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import moment from 'moment'
import { ScrollView } from 'react-native-gesture-handler'
import { useForm } from 'react-hook-form'
import axios, { CancelTokenSource } from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from 'react-native-geolocation-service'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native'
import uuid from 'react-native-uuid'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import {
  IModusOperandi,
  IEnvolvido,
  IDocumento,
  ICaracteristicas,
  IEndereco,
  IDadosProfissionais,
  IUsoForca,
} from '../../../interfaces/bo'

import Input from '../../../components/Input'
import Select from '../../../components/Select'

import ufJson from '../../../utils/data/uf.json'
import tipoEnvolvimentoPessoaJson from '../../../utils/data/tipoEnvolvimentoPessoa.json'
import tipoUsoForcaJson from '../../../utils/data/tipoUsoForca.json'
import sexoJson from '../../../utils/data/sexualidade.json'
import estadoCivilJson from '../../../utils/data/estadoCivil.json'
import escolaridadeJson from '../../../utils/data/escolaridade.json'

import {
  Container,
  Content,
  Titulo,
  SubTitulo,
  ButtomContainer,
  ButtonSeguir,
  ButtonVoltar,
  BtnText,
  ButtonExtraOptions,
  ButtonTextExtraOptions,
  ContainerExtraOptions,
  ContainerButtonExtraOptions,
} from './styles'
import api from '../../../services/api'
import Config from '../../../config'
import useStore from '../../../store/bo'
import useStoreGlobal from '../../../store/global'

axios.defaults.validateStatus = () => true

interface ITipoEnvolvimentoPessoa {
  ID_TIPO_ENVOLVIMENTO_PESSOA: string
  NM_TIPO_ENVOLVIMENTO_PESSOA: string
}

interface ISexo {
  ID: string
  SEXO_DESCRICAO: string
  CD_SEXO: string
}

interface IIdentidadeGenero {
  IDENT_GEN_ID: string
  IDENT_GEN_DESCRICAO: string
  CD_SEXO: string
}

interface IOrientSexual {
  ORIENT_SEXUAL_ID: string
  ORIENT_SEXUAL_DESCRICAO: string
  CD_SEXO: string
}

const AdicionarEnvolvido: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { editar, bos } = useStore()
  const { data: envGlobal, setData } = useStoreGlobal()
  const [envolvido, setEnvolvido] = useState<IEnvolvido | null>(
    route.params ? route.params.envolvido : null,
  )
  const {
    control: formEnvolvido,
    handleSubmit,
    errors,
    reset,
  } = useForm<IEnvolvido>({
    defaultValues: route.params ? route.params.envolvido : {},
  })
  // state picker
  const [envolvimento, setEnvolvimento] = useState<ITipoEnvolvimentoPessoa[]>(
    [],
  )
  const [sexo, setSexo] = useState<ISexo[]>([])
  const [orientSexual, setOrientSexual] = useState<IOrientSexual[]>([])
  const [identGenero, setIdentGenero] = useState<IIdentidadeGenero[]>([])
  const [tipoEnvolvimento, setTipoEnvolvimento] = useState('1')
  const [tipoPessoa, setTipoPessoa] = useState('F')
  const [modus, setModus] = useState<IModusOperandi | null>(null)
  const [caracteristicas, setCaracteristicas] =
    useState<ICaracteristicas | null>(null)
  const [enderecoResidencial, setEnderecoResidencial] =
    useState<IEndereco | null>(null)
  const [dadosProfissionais, setDadosProfissionais] =
    useState<IDadosProfissionais | null>(null)
  const [id] = useState(uuid.v4().toString())
  const [sexoSelecionado, setSexoSelecionado] = useState('0')
  const [identGeneroSelecionado, setIdentGeneroSelecionado] = useState('0')
  // const [orientSexualSelecionada, setOrientSexualSelecionada] = useState('0')
  const [temData, setTemData] = useState(false)
  const [usoForcaEscolhidos, setUsoForcaEscolhidos] = useState<IUsoForca[]>([])
  const [loadingBuscaRG, setLoadingBuscaRG] = useState(false)
  const [latitude, setLat] = useState('0')
  const [longitude, setLon] = useState('0')
  const [axiosSource, setAxiosSource] = useState<CancelTokenSource>(
    axios.CancelToken.source(),
  )

  useEffect(() => {
    setSexo(sexoJson.sexo)
    setEnvolvimento(tipoEnvolvimentoPessoaJson)
    setOrientSexual(sexoJson.orientSexual)
    setIdentGenero(sexoJson.identGenero)
    setIdentGeneroSelecionado('1')
    setSexoSelecionado('1')
    const unsubscribe = navigation.addListener('focus', () => {

      if (envolvido) {
        if (Object.keys(envolvido).length !== 0) {
          if (envolvido.MODUS_OPERANDI) setModus(envolvido.MODUS_OPERANDI)
          if (envGlobal.MODUS_OPERANDI) setModus(envGlobal.MODUS_OPERANDI)
          if (envolvido.CARACTERISTICAS)
            setCaracteristicas(envolvido.CARACTERISTICAS)
          if (envGlobal.CARACTERISTICAS)
            setCaracteristicas(envGlobal.CARACTERISTICAS)

          if (envolvido.ENDERECO_RESIDENCIAL)
            setEnderecoResidencial(envolvido.ENDERECO_RESIDENCIAL)
          if (envGlobal.ENDERECO) setEnderecoResidencial(envGlobal.ENDERECO)
          if (envolvido.DADOS_PROFISSIONAIS)
            setDadosProfissionais(envolvido.DADOS_PROFISSIONAIS)
          if (envGlobal.DADOS_PROFISSIONAIS)
            setDadosProfissionais(envGlobal.DADOS_PROFISSIONAIS)
          setUsoForcaEscolhidos(envolvido.USO_FORCA || [])
          if (envolvido.DATA_NASCIMENTO !== '') {
            setTemData(true)
          }
          if (envolvido.TIPO_PESSOA) {
            setTipoPessoa(envolvido.TIPO_PESSOA)
          }
          setTipoEnvolvimento(envolvido.ID_TIPO_ENV_PESSOA || '1')
          setEnvolvido({
            ...envolvido,
            CARACTERISTICAS: caracteristicas,
            MODUS_OPERANDI: modus,
            ENDERECO_RESIDENCIAL: enderecoResidencial,
            DADOS_PROFISSIONAIS: dadosProfissionais,
          })
        } else {
          if (envGlobal.MODUS_OPERANDI) setModus(envGlobal.MODUS_OPERANDI)
          if (envGlobal.CARACTERISTICAS)
            setCaracteristicas(envGlobal.CARACTERISTICAS)
          if (envGlobal.ENDERECO) setEnderecoResidencial(envGlobal.ENDERECO)
          if (envGlobal.DADOS_PROFISSIONAIS)
            setDadosProfissionais(envGlobal.DADOS_PROFISSIONAIS)
        }

        setData({
          MODUS_OPERANDI: null,
          CARACTERISTICAS: null,
          ENDERECO: null,
          DADOS_PROFISSIONAIS: null,
        })
      }
    })

    async function getPos() {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )

      if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
        Geolocation.getCurrentPosition(
          async (position) => {
            setLat(String(position.coords.latitude))
            setLon(String(position.coords.longitude))
          },
          (error) => {
            if (Config.ENVIRONMENT === Config.HML) {
              Alert.alert('Erro', JSON.stringify(error))
            }
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
        )
      }
    }
    getPos()

    return () => {
      unsubscribe()
      axiosSource.cancel('Cancelando requisições pendentes...')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    caracteristicas,
    dadosProfissionais,
    enderecoResidencial,
    envGlobal,
    envGlobal.MODUS_OPERANDI,
    envolvido,
    modus,
    navigation,
    setData,
  ])

  function addModusOperandi() {
    setData({ MODUS_OPERANDI: null })
    navigation.navigate('ModusOperandi')
  }

  function addCaracteristicas() {
    setData({ CARACTERISTICAS: null })
    navigation.navigate('Caracteristicas')
  }

  function addEndereco() {
    setData({ ENDERECO: null })
    navigation.navigate('Endereco')
  }

  function addDadosProfissionais() {
    setData({ DADOS_PROFISSIONAIS: null })
    navigation.navigate('DadosProfissionais')
  }

  function editarModusoperandi() {
    setData({ MODUS_OPERANDI: modus })
    navigation.navigate('ModusOperandi')
  }

  function editarCaracteristicas() {
    setData({ CARACTERISTICAS: caracteristicas })
    navigation.navigate('Caracteristicas')
  }

  function editarEndereco() {
    // console.log('end: ', enderecoResidencial)
    setData({ ENDERECO: enderecoResidencial })
    navigation.navigate('Endereco', { editar: true })
  }

  function editarDadosProfissionais() {
    setData({ DADOS_PROFISSIONAIS: dadosProfissionais })
    navigation.navigate('DadosProfissionais')
  }

  async function excluirModusoperandi() {
    Alert.alert(
      'Excluir Modus Operandi?',
      'Essa ação não pode ser desfeita. Tem certeza?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            setModus(null)

            setData({ MODUS_OPERANDI: null })
            if (envolvido) setEnvolvido({ ...envolvido, MODUS_OPERANDI: null })
          },
        },
      ],
    )
  }

  async function excluirCaracteristicas() {
    Alert.alert(
      'Excluir Caracteristicas?',
      'Essa ação não pode ser desfeita. Tem certeza?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            setCaracteristicas(null)
            setData({ CARACTERISTICAS: null })
            if (envolvido) setEnvolvido({ ...envolvido, CARACTERISTICAS: null })
          },
        },
      ],
    )
  }
  async function excluirEndereco() {
    Alert.alert(
      'Excluir Endereço?',
      'Essa ação não pode ser desfeita. Tem certeza?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            setEnderecoResidencial(null)
            setData({ ENDERECO: null })
            if (envolvido)
              setEnvolvido({ ...envolvido, ENDERECO_RESIDENCIAL: null })
          },
        },
      ],
    )
  }
  async function excluirDadosProfissionais() {
    Alert.alert(
      'Excluir Dados Profissionais?',
      'Essa ação não pode ser desfeita. Tem certeza?',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: async () => {
            setDadosProfissionais(null)
            setData({ DADOS_PROFISSIONAIS: null })
            if (envolvido)
              setEnvolvido({ ...envolvido, DADOS_PROFISSIONAIS: null })
          },
        },
      ],
    )
  }

  function snapshotEnvolvido(data: IEnvolvido): IEnvolvido {
    // ################# AJUSTES NOS DADOS DO ENVOLVIDO ##################
    const newData: IEnvolvido = { ...data }
    newData.TIPO_PESSOA = tipoPessoa
    newData.MODUS_OPERANDI = modus
    newData.CARACTERISTICAS = caracteristicas
    newData.ENDERECO_RESIDENCIAL = enderecoResidencial
    newData.DADOS_PROFISSIONAIS = dadosProfissionais
    newData.ID_GENERO = identGeneroSelecionado
    newData.ID_SEXO = sexoSelecionado
    newData.ID_TIPO_ENV_PESSOA = tipoEnvolvimento
    newData.EMAIL = data.EMAIL.toLowerCase()

    newData.USO_FORCA = []
    usoForcaEscolhidos.forEach((item) => {
      newData.USO_FORCA.push({
        ID_TIPO_USO_FORCA: item.ID_TIPO_USO_FORCA as string,
        NM_TIPO_USO_FORCA: item.NM_TIPO_USO_FORCA as string,
      })
    })
    if (route.params.action !== 'editar') newData.ID_ENVOLVIDO = id
    else {
      // teste
      newData.ID_ENVOLVIDO = envolvido
        ? envolvido.ID_ENVOLVIDO
        : 'ERRO_AO_GERAR_ID'
    }
    const documentos: IDocumento[] = []
    if (newData.RG) {
      documentos.push({
        ID_TIPO_DOCUMENTO: 3,
        NM_TIPO_DOCUMENTO: 'RG',
        ORGAO_DOCUMENTO: `${newData.ORGAO_EXP || 'NI'}/${newData.RG_UF}`,
        NUMERO: newData.RG,
      })
      if (newData.ORGAO_EXP === '') newData.ORGAO_EXP = 'NI'
    }
    if (newData.CPF && tipoPessoa === 'F') {
      documentos.push({
        ID_TIPO_DOCUMENTO: 4,
        NM_TIPO_DOCUMENTO: 'CPF',
        ORGAO_DOCUMENTO: 'RF',
        NUMERO: newData.CPF.replace(/([^0-9])/g, ''),
      })
    }
    if (newData.CNH) {
      documentos.push({
        ID_TIPO_DOCUMENTO: 5,
        NM_TIPO_DOCUMENTO: 'CNH',
        ORGAO_DOCUMENTO: 'DETRAN',
        NUMERO: newData.CNH,
      })
    }
    if (tipoPessoa === 'J') {
      documentos.push({
        ID_TIPO_DOCUMENTO: 6,
        NM_TIPO_DOCUMENTO: 'CNPJ',
        ORGAO_DOCUMENTO: 'RF',
        NUMERO: newData.CPF ? newData.CPF.replace(/([^0-9])/g, '') : '',
      })
    }
    newData.DOCUMENTOS = documentos

    const tipoenv = tipoEnvolvimentoPessoaJson.find(
      (item) => item.ID_TIPO_ENVOLVIMENTO_PESSOA === tipoEnvolvimento,
    )
    newData.NM_TIPO_ENVOLVIMENTO_PESSOA =
      tipoenv?.NM_TIPO_ENVOLVIMENTO_PESSOA as string
    const estadoCivil = estadoCivilJson.find(
      (item) => item.ID_ESTADO_CIVIL === data.ID_ESTADO_CIVIL,
    )
    newData.NM_ESTADO_CIVIL = estadoCivil?.NM_ESTADO_CIVIL as string
    const ds_sexo = sexoJson.sexo.find((item) => item.ID === sexoSelecionado)
    newData.DS_SEXO = ds_sexo?.SEXO_DESCRICAO
    const id_genero = sexoJson.identGenero.find(
      (item) => item.IDENT_GEN_ID === identGeneroSelecionado,
    )
    newData.DS_GENERO = id_genero?.IDENT_GEN_DESCRICAO
    const id_orSex = sexoJson.orientSexual.find(
      (item) =>
        item.ORIENT_SEXUAL_ID === formEnvolvido.getValues('ID_ORIENT_SEXUAL'),
    )
    newData.DS_ORIENT_SEXUAL = id_orSex?.ORIENT_SEXUAL_DESCRICAO
    // ***** TRATAMENTO DAS CARACTERISTICAS DO ENVOLVIDO *******
    const escola = escolaridadeJson.find(
      (item) =>
        item.ID_ESCOLARIDADE === formEnvolvido.getValues('ID_ESCOLARIDADE'),
    )
    newData.NM_ESCOLARIDADE = escola?.NM_ESCOLARIDADE
    delete newData.ID_TIPO_USO_FORCA1

    return newData
  }

  async function handleAddEnvolvido(data: IEnvolvido) {

    // console.log(tipoEnvolvimento)
    data.ID_TIPO_ENV_PESSOA = tipoEnvolvimento

    // return;

    if (data.DATA_NASCIMENTO) {
      const dataValida = moment(
        data.DATA_NASCIMENTO,
        'DD/MM/YYYY',
        true,
      ).isValid()
      if (!dataValida) {
        Alert.alert('Atenção', 'Preencha a data de nascimento corretamente!')
        return
      }
    }

    if (!caracteristicas) {
      Alert.alert('Atenção', 'Você deve escolher a cor da pele!')
      addCaracteristicas()
      return
    }

    if (caracteristicas.ID_COR_PELE === '0') {
      Alert.alert('Atenção', 'Você deve escolher a cor da pele.')
      editarCaracteristicas()
      return
    }

    const result =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        formEnvolvido.getValues('EMAIL').trim(),
      )

    if (result || !formEnvolvido.getValues('EMAIL')) {
      const newData = snapshotEnvolvido(data)
      const envs: IEnvolvido[] = bos[0].ENVOLVIDOS as IEnvolvido[]

      if (newData.ID_SEXO === '0') {
        newData.ID_SEXO = '1'
      }

      if (newData.ID_GENERO === '0'){
        newData.ID_GENERO = '1'
      }

      if (route.params.action === 'editar') {
        // Se tiver mudado o tipo de envolvimento da Pessoa, então deve-se excluir a assinatura.
        // console.log('tipo env pessoa:', newData.ID_TIPO_ENV_PESSOA)
        if (
          newData.ID_TIPO_ENV_PESSOA !== '1' &&
          newData.ID_TIPO_ENV_PESSOA !== '3' &&
          newData.ID_TIPO_ENV_PESSOA !== '4' &&
          newData.ID_TIPO_ENV_PESSOA !== '8'
        ) {
          newData.ASSINATURA = null
        }

        // Editar Envolvido
        if (envolvido) {
          const index = envs.findIndex(
            (item: IEnvolvido) => item.ID_ENVOLVIDO === envolvido.ID_ENVOLVIDO,
          )
          envs.splice(index, 1, newData)
        } else {
          Alert.alert('Atenção', 'Envolvido está Nulo')
        }
      }

      // Adicionar Envolvido Novo
      else envs.push({ ...newData, ASSINATURA: null })
      // Atualiza BO com a nova lista de Envolvidos
      editar({
        ...bos[0],
        ENVOLVIDOS: envs,
      })
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Envolvidos',
          },
        ],
      })
    } else Alert.alert('Atenção', 'O Email do Envolvido digitado é inválido!')
  }

  const addTipoUsoForca = () => {
    const idUsoForca: string = formEnvolvido.getValues()
      .ID_TIPO_USO_FORCA1 as string
    if (idUsoForca !== '0') {
      const usoForca = tipoUsoForcaJson.find(
        (item) => item.ID_TIPO_USO_FORCA === idUsoForca,
      ) as IUsoForca

      const usoForcaEscolhida = usoForcaEscolhidos.find(
        (item) => item.ID_TIPO_USO_FORCA === idUsoForca,
      )

      const novoUsoForcas = [
        ...usoForcaEscolhidos,
        {
          ID_TIPO_USO_FORCA: usoForca.ID_TIPO_USO_FORCA,
          NM_TIPO_USO_FORCA: usoForca.NM_TIPO_USO_FORCA,
        },
      ]

      if (!usoForcaEscolhida) {
        setUsoForcaEscolhidos(novoUsoForcas)
        if (envolvido) {
          setEnvolvido({
            ...envolvido,
            USO_FORCA: novoUsoForcas,
          })
        }
      }
    }
  }

  const deletarTipoUsoForca = (idOpt: string) => {
    const novoUsoForcaSemODeletado = usoForcaEscolhidos.filter(
      (item) => item.ID_TIPO_USO_FORCA !== idOpt,
    )
    setUsoForcaEscolhidos(novoUsoForcaSemODeletado)
    if (envolvido) {
      setEnvolvido({
        ...envolvido,
        USO_FORCA: novoUsoForcaSemODeletado,
      })
    }
  }

  interface AbisCidadaoCivil {
    NUMEROPESSOA: string
    NOME: string
    PAI: string
    MAE: string
    CPF?: string
    NASCIMENTOAPROXIMADO: string
    RGATRIBUIDO: string
  }

  const buscarPorRG = async () => {
    if (formEnvolvido.getValues('RG')) {
      if (route.params.action !== 'editar') {
        try {
          setLoadingBuscaRG(true)
          const res = await api.get<IEnvolvido>(
            `/buscarPorRg/${formEnvolvido.getValues('RG')}`,
          )

          if (res.status === 200) {
            setLoadingBuscaRG(false)
            Alert.alert(
              'Atenção',
              `Deseja carregar as informações do Envolvido "${res.data.NOME_RAZAO_SOCIAL}"?`,
              [
                {
                  text: 'NÃO',
                },
                {
                  text: 'SIM',
                  onPress: () => {
                    const novoEnvolvido: IEnvolvido = {
                      ...res.data,
                      ID_ENVOLVIDO: uuid.v4().toString(),
                      ID_TIPO_ENV_PESSOA: '1',
                      MODUS_OPERANDI: null,
                      USO_FORCA: [],
                      CARACTERISTICAS:
                        res.data.CARACTERISTICAS !== null
                          ? {
                              ...res.data.CARACTERISTICAS,
                              ID_ENV_CARACTERISTICA: uuid.v4().toString(),
                            }
                          : null,
                      ENDERECO_RESIDENCIAL: res.data.ENDERECO_RESIDENCIAL
                        ? {
                            ...res.data.ENDERECO_RESIDENCIAL,
                            ID_ENDERECO: uuid.v4().toString(),
                          }
                        : null,
                      DADOS_PROFISSIONAIS: res.data.DADOS_PROFISSIONAIS
                        ? {
                            ...res.data.DADOS_PROFISSIONAIS,
                            ID_DADOS_PROF: uuid.v4().toString(),
                          }
                        : null,
                    }
                    reset(novoEnvolvido)
                    setEnvolvido(novoEnvolvido)
                    setTipoEnvolvimento(novoEnvolvido.ID_TIPO_ENV_PESSOA)
                    setCaracteristicas(novoEnvolvido.CARACTERISTICAS)
                    setDadosProfissionais(novoEnvolvido.DADOS_PROFISSIONAIS)
                    setEnderecoResidencial(novoEnvolvido.ENDERECO_RESIDENCIAL)
                    setSexoSelecionado(novoEnvolvido.ID_SEXO)
                    setIdentGeneroSelecionado(novoEnvolvido.ID_GENERO)
                  },
                },
              ],
            )
          }
          if (res.status === 404) {
            const storageToken = await AsyncStorage.getItem('@BOEPM:token')
            const url = `${
              Config.urlEnvironments[Config.ENVIRONMENT].urlAbis
            }/${formEnvolvido.getValues('RG')}`

            try {
              const resultAbis = await axios.get<AbisCidadaoCivil[]>(url, {
                headers: {
                  Authorization: `Bearer ${storageToken}`,
                  lat: latitude,
                  lon: longitude,
                },
              })
              if (resultAbis.status === 200) {
                setLoadingBuscaRG(false)
                Alert.alert(
                  'Atenção',
                  `Deseja carregar as informações do Envolvido "${resultAbis.data[0].NOME}" ?`,
                  [
                    {
                      text: 'NÃO',
                    },
                    {
                      text: 'SIM',
                      onPress: () => {
                        const envAbis: IEnvolvido = {
                          NOME_RAZAO_SOCIAL: resultAbis.data[0].NOME,
                          NOME_MAE: resultAbis.data[0].MAE,
                          NOME_PAI: resultAbis.data[0].PAI,
                          CPF: resultAbis.data[0].CPF,
                          RG: resultAbis.data[0].RGATRIBUIDO,
                          RG_UF: 'PE',
                          ORGAO_EXP: 'SDS',
                          DATA_NASCIMENTO:
                            resultAbis.data[0].NASCIMENTOAPROXIMADO,
                        } as IEnvolvido
                        reset(envAbis)
                        setEnvolvido(envAbis)
                      },
                    },
                  ],
                )
              } else {
                Alert.alert(
                  'Desculpe!',
                  'Não foi possivel encontrar uma pessoa com o o RG Informado.',
                )
                setLoadingBuscaRG(false)
              }
            } catch (error) {
              setLoadingBuscaRG(false)
            }
          }
        } catch (error) {
          setLoadingBuscaRG(false)
        }
      }
    }
  }

  const setTipoEnvPrev = (value: string) => {
    setTipoEnvolvimento(value)
    if (envolvido) {
      setEnvolvido({ ...envolvido, ID_TIPO_ENV_PESSOA: value })
    }
  }

  const changeTipoPessoa = (data: string) => {
    setTipoPessoa(data)
    formEnvolvido.setValue('CPF', '')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Container>
          <Titulo>Adicionar Envolvido</Titulo>
          <SubTitulo>
            Tente fornecer o RG antes para buscar as informações do envolvido
            (se houver).
          </SubTitulo>
          <Content>
            <Select
              name="TIPO_PESSOA"
              label="Tipo Pessoa"
              prompt="Escolha a Opção"
              control={formEnvolvido}
              error={errors.TIPO_PESSOA}
              rules={{ required: true }}
              selectedValue={tipoPessoa}
              onValueChange={(v) => changeTipoPessoa(v)}
              defaultValue="F"
            >
              <Picker.Item key="F" label="FISICA" value="F" />
              <Picker.Item key="J" label="JURIDICA" value="J" />
            </Select>

            {tipoPessoa === 'F' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Input
                  name="RG"
                  label="RG"
                  control={formEnvolvido}
                  type="numeric"
                  maxLength={15}
                  placeholder="ex: 654987"
                  error={errors.RG}
                  rules={{ required: false }}
                  style={{
                    width: loadingBuscaRG
                      ? responsiveWidth(81)
                      : responsiveWidth(90),
                  }}
                  mtype="only-numbers"
                  onBlur={() => buscarPorRG()}
                />
                {loadingBuscaRG && (
                  <ActivityIndicator
                    size="large"
                    color="#ccc"
                    style={{ marginTop: 10 }}
                  />
                )}
              </View>
            )}
            {tipoPessoa === 'F' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: responsiveWidth(90),
                }}
              >
                <Input
                  name="ORGAO_EXP"
                  label="Órgão Expedidor"
                  control={formEnvolvido}
                  maxLength={10}
                  placeholder="ex: SDS"
                  error={errors.ORGAO_EXP}
                  rules={{ required: false }}
                  style={{ width: responsiveWidth(43) }}
                  mtype="custom"
                  options={{
                    mask: 'AAAAAAAAAA',
                  }}
                />

                <Select
                  name="RG_UF"
                  label="UF"
                  prompt="Escolha o Estado"
                  control={formEnvolvido}
                  error={errors.RG_UF}
                  rules={{ required: true }}
                  style={{ width: responsiveWidth(43) }}
                  defaultValue="PE"
                >
                  {ufJson.map((item) => {
                    return (
                      <Picker.Item
                        key={item.SIGLA_UF}
                        label={item.SIGLA_UF}
                        value={item.SIGLA_UF}
                      />
                    )
                  })}
                </Select>
              </View>
            )}
            <Input
              name="CPF"
              label={tipoPessoa === 'F' ? 'CPF' : 'CNPJ'}
              control={formEnvolvido}
              type="numeric"
              maxLength={tipoPessoa === 'F' ? 14 : 18}
              error={errors.CPF}
              rules={{ required: false }}
              mtype={tipoPessoa === 'F' ? 'cpf' : 'cnpj'}
            />
            <Select
              name="ID_TIPO_ENV_PESSOA"
              label="Tipo de Envolvimento"
              prompt="Tipo de Envolvimento"
              control={formEnvolvido}
              error={errors.ID_TIPO_ENV_PESSOA}
              rules={{ required: true }}
              selectedValue={tipoEnvolvimento}
              defaultValue="3"
              onValueChange={(itemValue: any) =>
                setTipoEnvPrev(itemValue.toString())}
            >
              {envolvimento.map((item) => {
                return (
                  <Picker.Item
                    key={item.ID_TIPO_ENVOLVIMENTO_PESSOA}
                    label={item.NM_TIPO_ENVOLVIMENTO_PESSOA}
                    value={item.ID_TIPO_ENVOLVIMENTO_PESSOA}
                  />
                )
              })}
            </Select>
            {(tipoEnvolvimento === '6' || tipoEnvolvimento === '7') && (
              <ContainerExtraOptions>
                <ButtonTextExtraOptions>Modus Operandi</ButtonTextExtraOptions>
                <ContainerButtonExtraOptions>
                  {!modus && (
                    <ButtonExtraOptions onPress={() => addModusOperandi()}>
                      <Icon name="plus-circle" size={25} color="#25b825" />
                    </ButtonExtraOptions>
                  )}
                  {modus && (
                    <ButtonExtraOptions
                      onPress={() => editarModusoperandi()}
                      style={{ marginRight: 10 }}
                    >
                      <Icon name="edit-2" size={20} color="#555" />
                    </ButtonExtraOptions>
                  )}
                  {modus && (
                    <ButtonExtraOptions onPress={() => excluirModusoperandi()}>
                      <Icon name="trash-2" size={20} color="#f00" />
                    </ButtonExtraOptions>
                  )}
                </ContainerButtonExtraOptions>
              </ContainerExtraOptions>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Select
                name="ID_TIPO_USO_FORCA1"
                label="Uso da Força"
                prompt="Escolha a Opção"
                control={formEnvolvido}
                error={errors.ID_TIPO_USO_FORCA1}
                rules={{ required: true }}
                defaultValue="0"
                style={{ width: responsiveWidth(80) }}
              >
                {tipoUsoForcaJson.map((item) => {
                  return (
                    <Picker.Item
                      key={item.ID_TIPO_USO_FORCA}
                      label={item.NM_TIPO_USO_FORCA}
                      value={item.ID_TIPO_USO_FORCA}
                    />
                  )
                })}
              </Select>
              <TouchableOpacity
                style={{ marginTop: 10, marginLeft: 10 }}
                onPress={() => addTipoUsoForca()}
              >
                <Icon name="plus-circle" size={30} color="#0f0" />
              </TouchableOpacity>
            </View>

            {usoForcaEscolhidos.map((usoF) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    padding: 6,
                    width: responsiveWidth(90),

                    borderRadius: 5,
                    marginBottom: 10,
                    backgroundColor: '#ddd',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  key={uuid.v4().toString()}
                >
                  <Text style={{ width: '80%' }}>{usoF.NM_TIPO_USO_FORCA}</Text>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      borderRadius: 5,
                    }}
                    onPress={() => deletarTipoUsoForca(usoF.ID_TIPO_USO_FORCA)}
                  >
                    <Text>
                      <Icon name="x-circle" size={20} color="#f00" />
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            })}

            <Input
              name="NOME_RAZAO_SOCIAL"
              label="Nome"
              control={formEnvolvido}
              maxLength={64}
              placeholder="ex: João da Silva"
              error={errors.NOME_RAZAO_SOCIAL}
              rules={{ required: true }}
            />
            <Input
              name="NOME_MAE"
              label="Nome da Mãe"
              control={formEnvolvido}
              maxLength={64}
              placeholder="ex: Maria José ou 'Não Informado'"
              error={errors.NOME_MAE}
              rules={{ required: true }}
            />
            <Input
              name="NOME_PAI"
              label="Nome do Pai"
              control={formEnvolvido}
              maxLength={64}
              placeholder="ex: João da Silva"
              error={errors.NOME_PAI}
              rules={{ required: false }}
            />
            <Input
              name="EMAIL"
              label="Email"
              control={formEnvolvido}
              maxLength={64}
              placeholder="ex: joao@gmail.com"
              error={errors.EMAIL}
              rules={{ required: false }}
            />
            <Input
              name="TELEFONE"
              label="Telefone"
              control={formEnvolvido}
              maxLength={15}
              keyboardType="phone-pad"
              placeholder="ex: (81) 94587-9874"
              error={errors.TELEFONE}
              rules={{ required: false }}
              mtype="cel-phone"
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) ',
              }}
            />

            <Input
              name="TELEFONE_RESIDENCIAL"
              label="Telefone Residencial"
              control={formEnvolvido}
              maxLength={15}
              keyboardType="numeric"
              placeholder="ex: (81) 94587-9874"
              error={errors.TELEFONE_RESIDENCIAL}
              rules={{ required: false }}
              mtype="cel-phone"
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) ',
              }}
            />
            <Select
              name="ID_SEXO"
              label="Sexo"
              prompt="Sexo"
              control={formEnvolvido}
              error={errors.ID_SEXO}
              rules={{ required: true }}
              selectedValue={sexoSelecionado}
              defaultValue="1"
              onValueChange={(itemValue: any) =>
                setSexoSelecionado(itemValue.toString())}
            >
              {sexo.map((item) => {
                return (
                  <Picker.Item
                    key={item.ID}
                    label={item.SEXO_DESCRICAO}
                    value={item.ID}
                  />
                )
              })}
            </Select>
            <Select
              name="ID_GENERO"
              label="Identidade de Gênero"
              prompt="Identidade de Gênero"
              control={formEnvolvido}
              error={errors.ID_GENERO}
              rules={{ required: true }}
              defaultValue="1"
              selectedValue={identGeneroSelecionado}
              onValueChange={(itemValue: any) =>
                setIdentGeneroSelecionado(itemValue.toString())}
            >
              {identGenero
                .filter(
                  (idt) =>
                    idt.CD_SEXO === '' ||
                    idt.CD_SEXO ===
                      sexoJson.sexo.find((sx) => sx.ID === sexoSelecionado)
                        ?.CD_SEXO,
                )
                .map((item) => {
                  return (
                    <Picker.Item
                      key={item.IDENT_GEN_ID}
                      label={item.IDENT_GEN_DESCRICAO}
                      value={item.IDENT_GEN_ID}
                    />
                  )
                })}
            </Select>
            <Select
              name="ID_ORIENT_SEXUAL"
              label="Orientação Sexual"
              prompt="Orientação Sexual"
              control={formEnvolvido}
              error={errors.ID_ORIENT_SEXUAL}
              rules={{ required: true }}
              defaultValue="1"
            >
              {orientSexual
                .filter(
                  (idt) =>
                    idt.CD_SEXO === '' ||
                    idt.CD_SEXO ===
                      sexoJson.sexo.find((sx) => sx.ID === sexoSelecionado)
                        ?.CD_SEXO,
                )
                .map((item) => {
                  return (
                    <Picker.Item
                      key={item.ORIENT_SEXUAL_ID}
                      label={item.ORIENT_SEXUAL_DESCRICAO}
                      value={item.ORIENT_SEXUAL_ID}
                    />
                  )
                })}
            </Select>

            <Input
              name="CNH"
              label="CNH"
              control={formEnvolvido}
              type="numeric"
              maxLength={11}
              placeholder="ex: 04965487787"
              error={errors.CNH}
              rules={{ required: false }}
              mtype="only-numbers"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: responsiveWidth(90),
              }}
            >
              <Input
                name="APELIDO"
                label="Apelido"
                control={formEnvolvido}
                maxLength={15}
                placeholder="ex: Xoquito"
                error={errors.APELIDO}
                rules={{ required: false }}
                style={{ width: responsiveWidth(48) }}
              />

              <Input
                name="DATA_NASCIMENTO"
                label="Data de Nascimento"
                control={formEnvolvido}
                maxLength={10}
                style={{ width: responsiveWidth(40) }}
                placeholder="ex: 15/08/1980"
                error={errors.DATA_NASCIMENTO}
                rules={{
                  required: false,
                }}
                // editable={false}
                keyboardType="numeric"
                mtype="custom"
                options={{
                  mask: '99/99/9999',
                }}
              />
            </View>

            <Select
              name="TURISTA"
              label="Turista"
              prompt="Escolha a opção"
              control={formEnvolvido}
              error={errors.TURISTA}
              rules={{ required: true }}
              defaultValue="N"
            >
              <Picker.Item key="0" label="NÃO" value="N" />
              <Picker.Item key="1" label="SIM" value="S" />
            </Select>
            <Input
              name="NATURALIDADE"
              label="Naturalidade"
              control={formEnvolvido}
              maxLength={30}
              placeholder="ex: Recife"
              error={errors.NATURALIDADE}
              rules={{ required: false }}
            />
            <Select
              name="ID_ESTADO_CIVIL"
              label="Estado Civil"
              prompt="Escolha a opção"
              control={formEnvolvido}
              error={errors.ID_ESTADO_CIVIL}
              rules={{ required: true }}
              defaultValue="0"
            >
              {estadoCivilJson.map((item) => {
                return (
                  <Picker.Item
                    key={item.ID_ESTADO_CIVIL}
                    label={item.NM_ESTADO_CIVIL}
                    value={item.ID_ESTADO_CIVIL}
                  />
                )
              })}
            </Select>
            <Select
              name="ID_ESCOLARIDADE"
              label="Escolaridade"
              prompt="Escolha a opção"
              control={formEnvolvido}
              error={errors.ID_ESCOLARIDADE}
              rules={{ required: true }}
              defaultValue="0"
            >
              {escolaridadeJson.map((item) => {
                return (
                  <Picker.Item
                    key={item.ID_ESCOLARIDADE}
                    label={item.NM_ESCOLARIDADE}
                    value={item.ID_ESCOLARIDADE}
                  />
                )
              })}
            </Select>
            <ContainerExtraOptions>
              <ButtonTextExtraOptions>Características</ButtonTextExtraOptions>
              <ContainerButtonExtraOptions>
                {!caracteristicas && (
                  <ButtonExtraOptions onPress={() => addCaracteristicas()}>
                    <Icon name="plus-circle" size={25} color="#25b825" />
                  </ButtonExtraOptions>
                )}
                {caracteristicas && (
                  <ButtonExtraOptions
                    onPress={() => editarCaracteristicas()}
                    style={{ marginRight: 10 }}
                  >
                    <Icon name="edit-2" size={20} color="#555" />
                  </ButtonExtraOptions>
                )}
                {caracteristicas && (
                  <ButtonExtraOptions onPress={() => excluirCaracteristicas()}>
                    <Icon name="trash-2" size={20} color="#f00" />
                  </ButtonExtraOptions>
                )}
              </ContainerButtonExtraOptions>
            </ContainerExtraOptions>
            <ContainerExtraOptions>
              <ButtonTextExtraOptions>Endereço</ButtonTextExtraOptions>
              <ContainerButtonExtraOptions>
                {!enderecoResidencial && (
                  <ButtonExtraOptions onPress={() => addEndereco()}>
                    <Icon name="plus-circle" size={25} color="#25b825" />
                  </ButtonExtraOptions>
                )}
                {enderecoResidencial && (
                  <ButtonExtraOptions
                    onPress={() => editarEndereco()}
                    style={{ marginRight: 10 }}
                  >
                    <Icon name="edit-2" size={20} color="#555" />
                  </ButtonExtraOptions>
                )}
                {enderecoResidencial && (
                  <ButtonExtraOptions onPress={() => excluirEndereco()}>
                    <Icon name="trash-2" size={20} color="#f00" />
                  </ButtonExtraOptions>
                )}
              </ContainerButtonExtraOptions>
            </ContainerExtraOptions>
            <ContainerExtraOptions>
              <ButtonTextExtraOptions>
                Dados Profissionais
              </ButtonTextExtraOptions>
              <ContainerButtonExtraOptions>
                {!dadosProfissionais && (
                  <ButtonExtraOptions onPress={() => addDadosProfissionais()}>
                    <Icon name="plus-circle" size={25} color="#25b825" />
                  </ButtonExtraOptions>
                )}
                {dadosProfissionais && (
                  <ButtonExtraOptions
                    onPress={() => editarDadosProfissionais()}
                    style={{ marginRight: 10 }}
                  >
                    <Icon name="edit-2" size={20} color="#555" />
                  </ButtonExtraOptions>
                )}
                {dadosProfissionais && (
                  <ButtonExtraOptions
                    onPress={() => excluirDadosProfissionais()}
                  >
                    <Icon name="trash-2" size={20} color="#f00" />
                  </ButtonExtraOptions>
                )}
              </ContainerButtonExtraOptions>
            </ContainerExtraOptions>
          </Content>
          <ButtomContainer>
            <ButtonVoltar onPress={() => navigation.navigate('Envolvidos')}>
              <BtnText>Voltar</BtnText>
            </ButtonVoltar>
            <ButtonSeguir onPress={handleSubmit(handleAddEnvolvido)}>
              <BtnText>
                {route.params.action === 'editar' ? 'Editar' : 'Adicionar'}
              </BtnText>
            </ButtonSeguir>
          </ButtomContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AdicionarEnvolvido
