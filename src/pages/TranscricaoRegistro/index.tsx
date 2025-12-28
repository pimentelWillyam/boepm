/* eslint-disable no-lonely-if */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import { Picker } from '@react-native-picker/picker'
import Geolocation from 'react-native-geolocation-service'
import DateTimePicker from '@react-native-community/datetimepicker'

import moment from 'moment'
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  TextInput,
  Modal,
  Keyboard,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import uuid from 'react-native-uuid'

import { ScrollView } from 'react-native-gesture-handler'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import axios, { CancelTokenSource } from 'axios'
import naturezasJson from '../../utils/data/naturezas.json'
import localPrincipalJson from '../../utils/data/localOcorrencia.json'
import pontoReferenciaJson from '../../utils/data/pontoReferencia.json'
import unidadesJson from '../../utils/data/unidades.json'
import ufJson from './uf.json'
import municipiosJson from './municipios.json'
import packagejson from '../../../package.json'
import ImgTranscFato from '../../assets/images/transcricao-fato.png'
import api from '../../services/api'

import Input from '../../components/Input'
import Select from '../../components/Select'

import { HeaderHome } from '../../components/Header'

import Storage from '../../utils/storage'
import BO, { IEndereco } from '../../interfaces/bo'

import {
  Container,
  Img,
  Titulo,
  SubTitulo,
  ButtomContainer,
  ButtonSeguir,
  BtnText,
  Texto,
} from './styles'

import Config from '../../config'
import {
  IEnderecoMap,
  ILocalOcorrencia,
  IMunicipio,
  INaturezaFato,
  IPontoReferencia,
  IUF,
  IUnidadeOperacional,
  NaturezasEscolhidas,
} from './interfaces'
import useStore from '../../store/bo'
import useStoreResponsaveis from '../../store/responsaveis'
import useStoreUsuario from '../../store/usuario'
import useStoreGlobal from '../../store/global'

Icon.loadFont()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TranscricaoRegistro: React.FC = (props: any) => {
  const { bo, setBO } = useStoreGlobal()
  const { bos } = useStore()
  const { adicionar, editar } = useStore()
  const {
    control: formTranscricao,
    handleSubmit,
    errors,
  } = useForm<BO>({
    defaultValues: bo === 0 ? bos[0] : {},
  })
  const { usuario } = useStoreUsuario()
  const [unidadeOperacional, setUnidadeOperacional] = useState<
    IUnidadeOperacional[]
  >([])
  const [naturezasFato, setNaturezasFato] = useState<INaturezaFato[]>([])
  const [localOcorrenciaItems, setLocalOcorrenciaItems] = useState<
    ILocalOcorrencia[]
  >([])
  const [uf, setUf] = useState<IUF[]>([])
  const [municipios, setMunicipios] = useState<IMunicipio[]>([])
  const [ufSelecionada, setUfSelecionada] = useState('1')
  const [ptref, setPtRef] = useState<IPontoReferencia[]>([])
  const [ome, setOme] = useState('0')
  const [naturezasEscolhidas, setNaturezasEscolhidas] = useState<
    NaturezasEscolhidas[]
  >([])

  const [show, setShow] = useState(false)
  const [modeDatePicker, setModeDatePicker] = useState('date')
  const [dataFato] = useState(new Date())
  const [dataFatoSelecionada, setDataFatoSelecionada] = useState('')
  const [horaFato] = useState(new Date())

  const [lat, setLat] = useState('0')
  const [lon, setLon] = useState('0')
  const [loading, setLoading] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [naturezasFiltradas, setNaturezasFiltradas] =
    useState<INaturezaFato[]>(naturezasJson)
  const [axiosSource, setAxiosSource] = useState<CancelTokenSource>(
    axios.CancelToken.source(),
  )
  const { responsaveis } = useStoreResponsaveis()

  const intensao = [
    {
      key: '0',
      label: 'NÃO INFORMADO',
      value: '0',
    },
    {
      key: '1',
      label: 'CULPOSO',
      value: '1',
    },
    {
      key: '2',
      label: 'DOLOSO',
      value: '2',
    },
  ]

  const autoria = [
    {
      key: '0',
      label: 'DESCONHECIDA',
      value: '0',
    },
    {
      key: '1',
      label: 'CONHECIDA',
      value: '1',
    },
  ]

  const crime = [
    {
      key: '0',
      label: 'TENTADO',
      value: '0',
    },
    {
      key: '1',
      label: 'CONSUMADO',
      value: '1',
    },
  ]

  const flagrante = [
    {
      key: '0',
      label: 'NÃO INFORMADO',
      value: '0',
    },
  ]

  // const wait = (timeout: number) => {
  //   return new Promise((resolve) => setTimeout(resolve, timeout))
  // }

  useEffect(() => {
    setUnidadeOperacional(unidadesJson)
    setNaturezasFato(naturezasJson)
    setLocalOcorrenciaItems(localPrincipalJson)
    setUf(ufJson)
    setPtRef(pontoReferenciaJson)

    async function getPos() {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )

      if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
        Alert.alert('Atenção', 'Você está no Local da ocorrência ? ', [
          {
            text: 'NÃO',
          },
          {
            text: 'SIM, Usar a minha localização',
            onPress: async () => {
              Geolocation.getCurrentPosition(
                async (position) => {
                  setLat(String(position.coords.latitude))
                  setLon(String(position.coords.longitude))

                  try {
                    const { data } = await api.get<IEnderecoMap>(
                      `https://mapas.pe.gov.br/nominatim/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
                      {
                        cancelToken: axiosSource.token,
                      },
                    )
                    formTranscricao.setValue('ENDERECO', {
                      LOGRADOURO: data.address?.road?.toUpperCase() || '',
                      NUMERO: data.address?.house_number || '0',
                      BAIRRO: data.address?.suburb?.toUpperCase() || '',
                      CEP: data.address?.postcode?.toUpperCase() || '',
                    })
                  } catch (error) {}
                },
                (error) => {
                  if (Config.ENVIRONMENT === Config.HML) {
                    Alert.alert('Erro', JSON.stringify(error))
                  }
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
              )
            },
          },
        ])
      }
    }

    // Se for o Primeiro Acesso - BO NOVO
    if (bo !== 0) {
      getPos()
      loadVT()
      setUfSelecionada('1')
      setPrevUf('1')
      formTranscricao.setValue('ENDERECO', {
        ID_MUNICIPIO: '261160',
      })
    } else {
      setNaturezasEscolhidas(bos[bo].NATUREZAS)
      setOme(bos[bo].ID_UNID_OPERACIONAL)
      setUfSelecionada(bos[bo].ENDERECO.ID_UF)
      setPrevUf(bos[bo].ENDERECO.ID_UF)
    }

    async function loadVT() {
      const gt = await Storage.get('@BOEPM:viatura')
      formTranscricao.setValue('DS_VIATURA', gt)
      if (usuario) {
        setOme('0')
        formTranscricao.setValue('ENDERECO', {
          ID_MUNICIPIO: '0',
        })
      }
    }

    return () => {
      axiosSource.cancel('Cancelando requisições pendentes...')
    }
  }, [])

  function showDataFato() {
    setShow(true)
  }

  const onChangeDate = (event: {
    type: string
    nativeEvent: { timestamp: number }
  }) => {
    if (event.type === 'dismissed') {
      setShow(false)
    } else {
      setDataFatoSelecionada(
        moment(event.nativeEvent.timestamp).format('DD/MM/YYYY'),
      )
      setModeDatePicker('time')
    }
  }

  const onChangeHora = (event: { type: string }, selectedDate: string) => {
    if (event.type === 'set') {
      formTranscricao.setValue(
        'DH_FATO',
        `${dataFatoSelecionada} ${moment(selectedDate).format('HH:mm')}`,
      )
    }
    setShow(false)
    setModeDatePicker('date')
  }

  const deletarNaturezas = (id: string) => {
    setNaturezasEscolhidas(
      naturezasEscolhidas.filter((item) => item.ID_NATUREZA !== id),
    )
  }

  async function handleTranscricaoRegistro(data: BO) {
    if (data.DH_REGISTRO) {
      const dataValida = moment(
        data.DH_REGISTRO,
        'DD/MM/YYYY HH:mm',
        true,
      ).isValid()
      if (!dataValida) {
        Alert.alert(
          'Atenção',
          `A Data de Registro "${data.DH_REGISTRO}" é inválida, digite a data no formato abaixo: \n\nDD/MM/YYYY HH:mm`,
        )
        return
      }

      if (
        moment(data.DH_REGISTRO, 'DD/MM/YYYY HH:mm').diff(
          moment(data.DH_FATO, 'DD/MM/YYYY HH:mm'),
        ) < 0
      ) {
        Alert.alert('Atenção', 'Data do Registro é menor que a Data do Fato')
        return
      }
    } else {
      Alert.alert('Atenção', 'Preencha a Data de Registro corretamente!')
      return
    }

    if (formTranscricao.getValues().ENDERECO.ID_MUNICIPIO === '0') {
      Alert.alert('Atenção', 'Informe o municipio para prosseguir!')
      return
    }

    if (formTranscricao.getValues().ID_LOCAL_OCORRENCIA === '114') {
      Alert.alert(
        'Atenção',
        'Você deve escolher o "LOCAL PRINCIPAL" para prosseguir!',
      )
      return
    }
    // verifica se escolheu a OME
    if (ome === '0') {
      Alert.alert(
        'Atenção',
        'Você deve escolher uma Unidade Operacional para prosseguir!',
      )
      return
    }
    if (naturezasEscolhidas.length === 0) {
      Alert.alert(
        'Atenção',
        'Você tem que adicionar ao menos 01 (uma) Natureza do Fato!',
      )
      return
    }
    setLoading(true)

    formTranscricao.setValue('DS_VIATURA', data.DS_VIATURA.toUpperCase())

    let newData: BO = {} as BO
    if (bo === 0) {
      newData = {
        ...bos[bo],
        ...data,
        DS_VIATURA: data.DS_VIATURA.toUpperCase(),
      }
    } else {
      newData = { ...data }
      newData.ID_BO = uuid.v4().toString()
      newData.VERSION = Config.APP_VERSION || ''
      newData.ID_BO_COMPLEMENTAR = ''
      newData.COMPLEMENTADO = 0
      newData.DS_VIATURA = data.DS_VIATURA.toUpperCase()
      newData.OBJETOS = []
      newData.ENVOLVIDOS = []
      newData.BO_STATUS = [
        {
          ID_STATUS: 0,
          DH_STATUS: moment().format('DD/MM/YYYY HH:mm'),
        },
      ]
    }
    newData.ERRO = false
    newData.NATUREZAS = []
    newData.ID_UNID_OPERACIONAL = ome
    const unid = unidadeOperacional.find((item) => item.UNI_ID === ome)
    newData.NM_UNID_OPERACIONAL = unid?.UNI_DESCRICAO
    const localOcor = localOcorrenciaItems.find(
      (item) => item.ID_LOCAL_OCORRENCIA === newData.ID_LOCAL_OCORRENCIA,
    )
    newData.NM_LOCAL_OCORRENCIA = localOcor?.NM_LOCAL_OCORRENCIA
    // const ptRefnm = ptref.find(
    //   (item) => item.ID_TP_PT_REF === newData.ENDERECO.ID_TP_PT_REF,
    // )

    naturezasEscolhidas.forEach((item) => {
      newData.NATUREZAS.push({
        ID_NATUREZA: item.ID_NATUREZA as string,
        NATUREZA: item.NATUREZA as string,
        CRIME_CONSUMADO: newData.CRIME_CONSUMADO as string,
        CRIME_CULPOSO: newData.CRIME_CULPOSO as string,
      })
    })

    const municipioFind = municipiosJson.find(
      (m) => m.ID_MUNICIPIO.toString() === data.ENDERECO.ID_MUNICIPIO,
    )

    const municipioNome = municipioFind ? municipioFind.MUNICIPIO : 'RECIFE'

    const ufFind = uf.find((item) => item.ID_UF === ufSelecionada)

    newData.ENDERECO = {
      ...data.ENDERECO,
      ID_ENDERECO: uuid.v4().toString(),
      ID_UF: ufSelecionada,
      NM_UF: ufFind ? ufFind.SIGLA_UF : 'PE',
      MUNICIPIO: municipioNome,
      ID_TRECHO: '0',
      ID_TP_PT_REF: '0',
      NM_TP_PT_REF: data.PONTO_REFERENCIA,
      LAT: lat,
      LON: lon,
    } as IEndereco

    if (naturezasEscolhidas.length === 0) {
      const idNat = formTranscricao.getValues().NATUREZA1
      const naturezaUnica = naturezasFato.find(
        (nat) => nat.DES_NATUREZA_ID === idNat,
      )
      newData.NATUREZAS.push({
        ID_NATUREZA: naturezaUnica?.DES_NATUREZA_ID || '340',
        NATUREZA: naturezaUnica?.DES_DESCRICAO || 'AVERIGUAÇÃO',
        CRIME_CONSUMADO: '0',
        CRIME_CULPOSO: '0',
      })
    }
    delete newData.NATUREZA1
    if (bo !== 0) {
      newData.ID_TIPO_DESFECHO = ''
      newData.NM_TIPO_DESFECHO = ''
      newData.RESPONSAVEIS = []
      newData.ENVOLVIDOS = []
      newData.DADOS_COMPLEMENTARES = ''
      newData.RESPONSAVEIS = responsaveis
      newData.CD_TIPO_ENVOLVIMENTO = responsaveis[0].CD_TIPO_ENVOLVIMENTO
      adicionar(newData)
      setBO(0)
    } else editar(newData)
    setLoading(false)
    props.navigation.navigate('Envolvidos')
  }

  const checkOcorrencia = useCallback(async () => {
    const boExisteOffline = bos.find(
      (item) =>
        item.CD_OCORRENCIA === formTranscricao.getValues('CD_OCORRENCIA'),
    )
    if (!boExisteOffline) {
      // Então verifica online
      try {
        const response = await api.get(
          `/checkOcorrencia/${formTranscricao.getValues('CD_OCORRENCIA')}`,
          {
            cancelToken: axiosSource.token,
          },
        )
        if (response.status === 200 && response.data.status === true) {
          formTranscricao.setValue('CD_OCORRENCIA', '')
          Alert.alert(
            'Ocorrencia já existe!',
            `O Número de Ocorrencia que você inseriu já está cadastrado no Sistema. \n
Contacte o CIODS/COPOM para gerar novo Mike!\n
Dados de quem cadastrou ? \n
Matricula: ${response.data.USUARIO.MATRICULA}
Graduação: ${response.data.USUARIO.SIGLA_CARGO}
Nome: ${response.data.USUARIO.NOME}
OME: ${response.data.USUARIO.CD_OPERACIONAL}
`,
          )
        }
      } catch (error) {}
    } else {
      formTranscricao.setValue('CD_OCORRENCIA', '')
      Alert.alert(
        'Ocorrencia já existe!',
        'Você já registrou esse numero de Ocorrência!',
      )
    }
  }, [])

  const setPrevOME = (omeStr: string) => {
    if (omeStr !== '0') {
      if (usuario) {
        if (usuario.ID_ORGANIZACAO.toString() !== omeStr) {
          const nm_ome = unidadesJson.find((item) => item.UNI_ID === omeStr)
          if (nm_ome) {
            Alert.alert(
              'Atenção',
              `Tem certeza que quer selecionar "${nm_ome?.UNI_DESCRICAO}" ?`,
              [
                {
                  text: 'NÃO',
                },
                {
                  text: 'SIM',
                  onPress: () => setOme(omeStr),
                },
              ],
            )
          }
        } else setOme(omeStr)
      }
    }
  }

  const setPrevUf = (ufStr: string) => {
    setUfSelecionada(ufStr)
    const listaMunicipios = municipiosJson.filter(
      (item) => item.ID_UF.toString() === ufStr,
    )
    setMunicipios(listaMunicipios)
  }

  const onTouchStart = () => {
    Keyboard.dismiss()
    setNaturezasFiltradas(naturezasJson)
    setSearchVisible(true)
  }

  const closeSearchSelect = () => {
    setSearchVisible(false)
  }

  const filterText = (value: string) => {
    const nats = naturezasJson.filter((item) =>
      item.DES_DESCRICAO.includes(value.toUpperCase()),
    )
    setNaturezasFiltradas(nats)
  }

  const onSelectItem = (item: INaturezaFato) => {
    setSearchVisible(false)
    Alert.alert(
      'Informação',
      `Você deseja adicionar a Natureza "${item.DES_DESCRICAO}" às naturezas desta Ocorrência ?`,
      [
        {
          text: 'NÃO',
        },
        {
          text: 'SIM',
          onPress: () => {
            formTranscricao.setValue('NATUREZA1', item.DES_DESCRICAO)

            const naturezaAdicionada = naturezasEscolhidas.find(
              (n) => n.ID_NATUREZA === item.DES_NATUREZA_ID,
            )
            if (!naturezaAdicionada) {
              setNaturezasEscolhidas([
                ...naturezasEscolhidas,
                {
                  ID_NATUREZA: item.DES_NATUREZA_ID,
                  NATUREZA: item.DES_DESCRICAO,
                },
              ])
            }
          },
        },
      ],
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <HeaderHome
        drawerHome={() => {
          props.navigation.openDrawer()
        }}
      />

      <ScrollView keyboardShouldPersistTaps="handled">
        <Container>
          <Img source={ImgTranscFato} />
          <Titulo>TRANSCRIÇÃO DO REGISTRO (FATO)</Titulo>
          <SubTitulo>
            Descreva os dados referentes ao acontecimento da
            <Texto> Ocorrência</Texto>
          </SubTitulo>

          <Input
            name="CD_OCORRENCIA"
            style={{ fontWeight: 'bold', fontSize: 16 }}
            label="Número da Ocorrência"
            control={formTranscricao}
            maxLength={19}
            type="numeric"
            placeholder="ex: 123456789"
            error={errors.CD_OCORRENCIA}
            rules={{ required: true }}
            onBlur={() => checkOcorrencia()}
            mtype="custom"
            options={{
              mask: '9999999999999999999',
            }}
          />

          <Select
            name="ID_UNID_OPERACIONAL"
            label="Unidade Operacional do Serviço"
            prompt="Escolha a Unidade"
            control={formTranscricao}
            error={errors.ID_UNID_OPERACIONAL}
            rules={{ required: true }}
            selectedValue={ome}
            onValueChange={(itemValue: any) => setPrevOME(itemValue.toString())}
          >
            {unidadeOperacional.map((unidade) => {
              return (
                <Picker.Item
                  key={unidade.UNI_ID}
                  label={unidade.CD_OPERACIONAL}
                  value={unidade.UNI_ID}
                />
              )
            })}
          </Select>
          <Text
            style={{
              color: '#2f80ed',
              marginBottom: 5,
              marginTop: -10,
              fontWeight: 'bold',
            }}
          >
            Se PJES, Unidade que está tirando o PJES.
          </Text>

          <Input
            name="DS_VIATURA"
            label="Prefixo da Viatura"
            autoCapitalize="characters"
            control={formTranscricao}
            placeholder="ex: GT 16302"
            maxLength={8}
            error={errors.DS_VIATURA}
            rules={{ required: true }}
            defaultValue=""
            mtype="custom"
            options={{
              mask: 'SSSSSSSS',
            }}
          />
          <Input
            name="DH_REGISTRO"
            label="Data do Registro"
            control={formTranscricao}
            placeholder="ex: 16/11/2021 09:39"
            error={errors.DH_REGISTRO}
            rules={{ required: true }}
            // editable={false}
            defaultValue={moment().format('DD/MM/YYYY HH:mm')}
            mtype="custom"
            options={{
              mask: '99/99/9999 99:99',
            }}
          />

          <View>
            <Text style={{ color: '#aaa', marginBottom: 3 }}>
              Naturezas do Fato
{' '}
              <Text style={{ fontSize: 10, color: '#f00' }}>(Obrigatório)</Text>
            </Text>
            <View
              style={{
                width: responsiveWidth(90),
                height: 40,
                paddingLeft: 10,
                paddingRight: 0,
                marginBottom: 10,
                backgroundColor: '#fff',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#ddd',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Controller
                control={formTranscricao}
                render={({ onChange, value }) => (
                  <TextInput
                    style={{ width: '90%' }}
                    onTouchStart={() => onTouchStart()}
                    editable={false}
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    maxLength={25}
                  />
                )}
                name="NATUREZA1"
                rules={{ required: true }}
                defaultValue="Clique ao lado e escolha ->"
              />
              <TouchableOpacity
                onPress={() => onTouchStart()}
                style={{
                  padding: 0,
                  margin: 0,
                  width: responsiveWidth(8),
                  height: '100%',
                  backgroundColor: '#f2f2f2',
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="search" color="#555" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={searchVisible}
            statusBarTranslucent={false}
            transparent
            hardwareAccelerated
          >
            <View
              style={{
                backgroundColor: '#0000007f',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: '90%',
                  height: '80%',
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  alignItems: 'center',
                }}
              >
                <Text style={{ marginTop: 10, marginBottom: 10 }}>
                  Escolha a Natureza
                </Text>
                <TextInput
                  placeholder="Busque aqui..."
                  style={{
                    width: '90%',
                    height: 40,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ededed',
                  }}
                  onChangeText={(text) => filterText(text)}
                />
                <ScrollView>
                  {naturezasFiltradas.map((n) => {
                    return (
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          borderBottomColor: '#ccc',
                          borderBottomWidth: 1,
                          width: responsiveWidth(85),
                        }}
                        key={n.DES_NATUREZA_ID}
                        onPress={() => onSelectItem(n)}
                      >
                        <Text>{n.DES_DESCRICAO}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>

                <TouchableOpacity
                  onPress={() => closeSearchSelect()}
                  style={{
                    borderTopColor: '#aaa',
                    borderTopWidth: 1,
                    backgroundColor: '#efefef',
                    width: '100%',
                    height: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                >
                  <Text style={{ color: '#000' }}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {naturezasEscolhidas.map((nat) => {
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
                <Text style={{ width: '80%' }}>{nat.NATUREZA}</Text>
                <TouchableOpacity
                  style={{
                    width: 20,
                    borderRadius: 5,
                  }}
                  onPress={() => deletarNaturezas(nat.ID_NATUREZA)}
                >
                  <Text>
                    <Icon name="x-circle" size={20} color="#f00" />
                  </Text>
                </TouchableOpacity>
              </View>
            )
          })}
          {naturezasEscolhidas.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                padding: 6,
                width: responsiveWidth(90),
                paddingLeft: 10,
                borderRadius: 5,
                marginBottom: 10,
                backgroundColor: '#ff979749',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              key={uuid.v4().toString()}
            >
              <Text style={{ width: '80%', color: '#f00' }}>
                Nenhuma Natureza Selecionada!
              </Text>
              <TouchableOpacity
                style={{
                  width: 20,
                  borderRadius: 5,
                }}
              />
            </View>
          )}

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Input
              name="DH_FATO"
              label="Data do Fato"
              control={formTranscricao}
              placeholder="ex: 18/03/2021"
              error={errors.DH_FATO}
              rules={{ required: true }}
              style={{ width: responsiveWidth(82) }}
              editable={false}
              mtype="custom"
              options={{
                mask: '99/99/9999 99:99',
              }}
              defaultValue={moment()
                .subtract(30, 'minutes')
                .format('DD/MM/YYYY HH:mm')}
            />
            <TouchableOpacity onPress={showDataFato}>
              <Icon
                name="edit-2"
                size={25}
                color="#aaa"
                style={{
                  marginLeft: 5,
                  marginTop: 6,
                }}
              />
            </TouchableOpacity>
          </View>
          {show && modeDatePicker === 'date' && (
            <DateTimePicker
              testID="dateTimePicker"
              mode="date"
              value={dataFato}
              is24Hour
              display="spinner"
              dateFormat="longdate"
              onChange={onChangeDate}
              maximumDate={moment().toDate()}
              minimumDate={moment().subtract(8, 'days').toDate()}
            />
          )}

          {show && modeDatePicker === 'time' && (
            <DateTimePicker
              testID="dateTimePicker"
              mode="time"
              value={horaFato}
              is24Hour
              display="spinner"
              onChange={onChangeHora}
              maximumDate={moment().toDate()}
              minimumDate={moment().subtract(24, 'hours').toDate()}
            />
          )}

          <Select
            name="AUTORIA_CONHECIDA"
            label="Autoria do Fato"
            prompt="Escolha a opção"
            control={formTranscricao}
            error={errors.AUTORIA_CONHECIDA}
            rules={{ required: true }}
            defaultValue="1"
          >
            {autoria.map((item) => {
              return (
                <Picker.Item
                  key={item.key}
                  label={item.label}
                  value={item.value}
                />
              )
            })}
          </Select>

          <Select
            name="CRIME_CONSUMADO"
            label="Crime"
            prompt="Escolha a opção"
            control={formTranscricao}
            error={errors.CRIME_CONSUMADO}
            rules={{ required: true }}
            defaultValue="1"
          >
            {crime.map((item) => {
              return (
                <Picker.Item
                  key={item.key}
                  label={item.label}
                  value={item.value}
                />
              )
            })}
          </Select>

          <Select
            name="CRIME_CULPOSO"
            label="Intensão"
            prompt="Escolha a opção"
            control={formTranscricao}
            error={errors.CRIME_CULPOSO}
            rules={{ required: true }}
            defaultValue="2"
          >
            {intensao.map((int) => {
              return (
                <Picker.Item
                  key={int.key}
                  label={int.label}
                  value={int.value}
                />
              )
            })}
          </Select>

          <Select
            name="FLAGRANTE"
            label="Flagrante"
            prompt="Escolha a opção"
            control={formTranscricao}
            error={errors.FLAGRANTE}
            rules={{ required: true }}
            defaultValue="0"
          >
            {flagrante.map((item) => {
              return (
                <Picker.Item
                  key={item.key}
                  label={item.label}
                  value={item.value}
                />
              )
            })}
          </Select>

          <Select
            name="ID_LOCAL_OCORRENCIA"
            label="Local Principal *"
            prompt="Escolha o Local"
            control={formTranscricao}
            error={errors.ID_LOCAL_OCORRENCIA}
            rules={{ required: true }}
            defaultValue="114"
          >
            {localOcorrenciaItems.map((localOcor) => {
              return (
                <Picker.Item
                  key={localOcor.ID_LOCAL_OCORRENCIA}
                  label={localOcor.NM_LOCAL_OCORRENCIA}
                  value={localOcor.ID_LOCAL_OCORRENCIA}
                />
              )
            })}
          </Select>
          <Input
            name="ENDERECO.LOGRADOURO"
            label="Logradouro"
            control={formTranscricao}
            placeholder="ex: Rua do Futuro"
            error={errors.LOGRADOURO}
            maxLength={64}
            rules={{ required: true }}
          />

          <Input
            name="ENDERECO.NUMERO"
            label="Número"
            control={formTranscricao}
            type="numeric"
            autoCorrect={false}
            autoCompleteType="off"
            placeholder="se não tiver, coloque '0'"
            defaultValue="0"
            error={errors.NUMERO}
            maxLength={5}
            rules={{ required: true }}
            mtype="only-numbers"
          />

          <Input
            name="ENDERECO.COMPLEMENTO"
            label="Complemento"
            control={formTranscricao}
            autoCorrect={false}
            autoCompleteType="off"
            placeholder="ex: Casa A"
            error={errors.COMPLEMENTO}
            maxLength={50}
            rules={{ required: false }}
          />

          <Input
            name="ENDERECO.BAIRRO"
            label="Bairro"
            control={formTranscricao}
            autoCorrect={false}
            autoCompleteType="off"
            placeholder="ex: Boa vista"
            error={errors.BAIRRO}
            maxLength={64}
            rules={{ required: true }}
          />

          <Input
            name="ENDERECO.CEP"
            label="Cep"
            control={formTranscricao}
            type="numeric"
            placeholder="ex: 99999-999"
            error={errors.CEP}
            maxLength={9}
            rules={{ required: false }}
            mtype="zip-code"
          />
          <Select
            name="ENDERECO.ID_MUNICIPIO"
            label="Município"
            prompt="Escolha o Município"
            control={formTranscricao}
            error={errors.ID_MUNICIPIO}
            rules={{ required: true }}
            defaultValue="0"
          >
            {municipios.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_MUNICIPIO}
                  label={item.MUNICIPIO}
                  value={item.ID_MUNICIPIO.toString()}
                />
              )
            })}
          </Select>

          <Select
            name="ENDERECO.ID_UF"
            label="UF"
            prompt="Escolha o Estado"
            control={formTranscricao}
            error={errors.ID_UF}
            rules={{ required: true }}
            defaultValue="0"
            selectedValue={ufSelecionada}
            onValueChange={(itemValue: any) => setPrevUf(itemValue.toString())}
          >
            {uf.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_UF}
                  label={item.NM_UF}
                  value={item.ID_UF}
                />
              )
            })}
          </Select>

          {/* <Select
            name="ENDERECO.ID_TP_PT_REF"
            label="Ponto de Referência"
            prompt="Escolha a opção"
            control={formTranscricao}
            error={errors.ID_TP_PT_REF}
            rules={{ required: true }}
            defaultValue="0"
          >
            {ptref.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_TP_PT_REF}
                  label={item.NM_TP_PT_REF}
                  value={item.ID_TP_PT_REF}
                />
              )
            })}
          </Select> */}
          <Input
            name="ENDERECO.PONTO_REFERENCIA"
            label="Ponto de Referência"
            control={formTranscricao}
            placeholder="ex: BAR DO CARANGUEIJO"
            error={errors.PONTO_REFERENCIA}
            maxLength={80}
            rules={{ required: false }}
          />

          <ButtomContainer>
            <ButtonSeguir
              onPress={handleSubmit(handleTranscricaoRegistro)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <BtnText>{bo === 0 ? 'Editar' : 'Prosseguir'}</BtnText>
              )}
            </ButtonSeguir>
          </ButtomContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default TranscricaoRegistro
