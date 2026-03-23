import React, { useRef, useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Modalize } from 'react-native-modalize'
import axios from 'axios'
import { Picker } from '@react-native-picker/picker'
import uuid from 'react-native-uuid'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import Select from '../../../components/Select'
import Input from '../../../components/Input'
import ufJson from '../../../utils/data/uf.json'

import { IEndereco } from '../../../interfaces/bo'
// import municipios from './municipios.json'
import municipiosNovos from './municipiosNovos.json'
import Config from '../../../config/index'
import {
  Container,
  Titulo,
  SubTitulo,
  ScrollViewContent,
  ModalHeader,
  ModalHeaderText,
  ModalItem,
  ModalItemText,
  Negrito,
  ButtomContainer,
  ButtonSeguir,
  ButtonVoltar,
  BtnText,
} from './styles'

import { IMunicipio } from '../../TranscricaoRegistro/interfaces'
import useStoreGlobal from '../../../store/global'

axios.defaults.validateStatus = () => true

interface IEnderecoInfopol {
  idLogradouro: number
  logradouro: string
  idBairro: number
  bairro: string
  idMunicipio: number
  municipio: string
  idTrecho: number
  idUf: number
  siglaUf: string
}

export default function Endereco(): JSX.Element {
  const listaEndereco = useRef<Modalize>(null)
  const route = useRoute()
  const [enderecos, setEnderecos] = useState<IEnderecoInfopol[] | null>(null)
  const [loading, setLoading] = useState(false)

  const [municipios, setMunicipios] = useState<IMunicipio[]>([])
  const [idTrecho, setIdTrecho] = useState('0')
  const { data, setData } = useStoreGlobal()
  const [ufSelecionada, setUfSelecionada] = useState('1')
  const navigation = useNavigation()
  const {
    control: formEndereco,
    handleSubmit,
    errors,
  } = useForm({
    defaultValues: data.ENDERECO ? data.ENDERECO : {},
  })

  useEffect(() => {
    if (!route.params) {
      Alert.alert(
        'Atenção!',
        'Sempre tente utilizar a busca para preencher o Endereço. Isso garante que os dados serão enviados corretamente para o Infopol caso a Ocorrência seja encaminhada para a DP.',
      )
      setPrevUf('1')
    } else if (data.ENDERECO) setPrevUf(data.ENDERECO.ID_UF)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const voltar = () => {
    navigation.goBack()
  }

  const addEndereco = async (dataForm: IEndereco) => {
    const endereco = { ...dataForm }

    endereco.ID_ENDERECO = uuid.v4().toString()
    let dadosEndereco = null

    dadosEndereco = ufJson.find(item => item.ID_UF === dataForm.ID_UF)
    if (dadosEndereco) endereco.NM_UF = dadosEndereco.SIGLA_UF as string

    // dadosEndereco = pontoReferenciaJson.find(
    //   (item) => item.ID_TP_PT_REF === dataForm.ID_TP_PT_REF,
    // )
    // if (dadosEndereco)
    //   endereco.NM_TP_PT_REF = dadosEndereco.NM_TP_PT_REF as string

    const municipio = municipiosNovos.find(
      m => m.MUNICIPIO === dataForm.MUNICIPIO,
    )

    const uf = ufJson.find(u => u.ID_UF === ufSelecionada)

    const novoEndereco: { ENDERECO: IEndereco } = {
      ENDERECO: {
        ...endereco,
        ID_TRECHO: idTrecho || '0',
        ID_TP_PT_REF: '0',
        NM_TP_PT_REF: dataForm.PONTO_REFERENCIA,
        ID_UF: ufSelecionada,
        NM_UF: uf?.SIGLA_UF ? uf?.SIGLA_UF : '1',
        ID_MUNICIPIO: municipio?.ID_MUNICIPIO
          ? String(municipio.ID_MUNICIPIO)
          : '1',
      },
    }
    setData(novoEndereco)
    navigation.goBack()
  }

  const buscarEndereco = async () => {
    Keyboard.dismiss()
    if (formEndereco.getValues('LOGRADOURO').length < 3) {
      Alert.alert(
        'Desculpe',
        'Você precisa digitar mais que 3 caracteres para buscar o endereço!',
      )
      return
    }
    try {
      setLoading(true)
      const logradouroFiltrado = formEndereco
        .getValues()
        .LOGRADOURO.replace(/(RUA |AV |AVENIDA |R. |AV. )/g, '')
      const response = await axios.get<IEnderecoInfopol[]>(
        `${
          Config.urlEnvironments[Config.ENVIRONMENT].urlInfopol
        }/endereco/${logradouroFiltrado}/${formEndereco.getValues().MUNICIPIO}`,
      )
      setLoading(false)
      if (response.status === 200) {
        setEnderecos(response.data.slice(0, 10))
        listaEndereco.current?.open()
        return
      }

      if (response.status === 404) {
        setEnderecos(null)
        Alert.alert(
          'Desculpe',
          'Não foi encontrado nenhum endereço de acordo com a sua consulta!',
        )
        return
      }
      Alert.alert(
        'Desculpe',
        'No momento não foi possivel buscar o endereço desejado!',
      )
    } catch (error) {
      Alert.alert(
        'Atenção',
        'Não foi possivel buscar o endereço solicitado. Verifique a sua VPN!',
      )
      setLoading(false)
    }
  }

  const selecionarEndereco = (end: IEnderecoInfopol) => {
    listaEndereco.current?.close()
    formEndereco.setValue('LOGRADOURO', end.logradouro || '')
    formEndereco.setValue('BAIRRO', end.bairro || '')
    formEndereco.setValue('ID_UF', end.idUf.toString() || '1')
    setIdTrecho(end.idTrecho.toString())
  }

  const setPrevUf = (ufStr: string) => {
    setUfSelecionada(ufStr)
    const listaMunicipios = municipiosNovos.filter(
      item => item.ID_UF.toString() === ufStr,
    )
    setMunicipios(listaMunicipios)
  }

  return (
    <>
      <ScrollViewContent keyboardShouldPersistTaps="handled">
        <Container>
          {/* <FotoHome source={FotoModusOp} /> */}
          <Titulo>Endereço Residencial</Titulo>

          <SubTitulo>
            Preencha os dados do Endereço do
            <Negrito> Envolvido.</Negrito>
          </SubTitulo>
          <Select
            name="ID_UF"
            label="UF"
            prompt="Escolha o Estado"
            control={formEndereco}
            error={errors.ID_UF}
            rules={{ required: true }}
            defaultValue="1"
            selectedValue={ufSelecionada}
            onValueChange={(itemValue: any) => setPrevUf(itemValue.toString())}
          >
            {ufJson.map(item => {
              if (item.ID_PAIS === '34')
                return (
                  <Picker.Item
                    key={item.ID_UF}
                    label={item.NM_UF}
                    value={item.ID_UF}
                  />
                )
            })}
          </Select>

          <Select
            name="MUNICIPIO"
            label="Municipio"
            prompt="Escolha o Município"
            control={formEndereco}
            error={errors.MUNICIPIO}
            rules={{ required: true }}
            defaultValue="RECIFE"
          >
            {municipios.map(municipio => {
              return (
                <Picker.Item
                  key={municipio.MUNICIPIO}
                  label={municipio.MUNICIPIO}
                  value={municipio.MUNICIPIO}
                />
              )
            })}
          </Select>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Input
              name="LOGRADOURO"
              label="Logradouro"
              control={formEndereco}
              placeholder="ex: Rua do futuro"
              error={errors.LOGRADOURO}
              maxLength={64}
              rules={{ required: false }}
              style={{ width: responsiveWidth(82) }}
            />
            <TouchableOpacity onPress={() => buscarEndereco()}>
              {!loading ? (
                <Icon
                  name="search"
                  size={25}
                  color="#aaa"
                  style={{
                    marginLeft: 5,
                    marginTop: 10,
                  }}
                />
              ) : (
                <ActivityIndicator size="large" color="#ccc" />
              )}
            </TouchableOpacity>
          </View>

          <Input
            name="NUMERO"
            label="Número"
            control={formEndereco}
            type="numeric"
            placeholder="ex: 138"
            error={errors.NUMERO}
            maxLength={5}
            rules={{ required: false }}
          />

          <Input
            name="COMPLEMENTO"
            label="Complemento"
            control={formEndereco}
            placeholder="ex: Casa A"
            error={errors.COMPLEMENTO}
            maxLength={50}
            rules={{ required: false }}
          />

          <Input
            name="BAIRRO"
            label="Bairro"
            control={formEndereco}
            placeholder="ex: Boa vista"
            error={errors.BAIRRO}
            maxLength={64}
            rules={{ required: false }}
          />

          <Input
            name="CEP"
            label="Cep"
            control={formEndereco}
            type="numeric"
            placeholder="ex: 52081-590"
            error={errors.CEP}
            maxLength={9}
            rules={{ required: false }}
            mtype="zip-code"
          />

          {/* <Select
            name="ID_TP_PT_REF"
            label="Ponto de Referência"
            prompt="Escolha a opção"
            control={formEndereco}
            error={errors.ID_TP_PT_REF}
            rules={{ required: true }}
            defaultValue="0"
          >
            {pontoReferenciaJson.map((item) => {
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
            name="PONTO_REFERENCIA"
            label="Ponto de Referência"
            control={formEndereco}
            placeholder="ex: SUPERMERCADO X"
            error={errors.PONTO_REFERENCIA}
            maxLength={80}
            rules={{ required: false }}
          />

          <ButtomContainer>
            <ButtonVoltar onPress={() => voltar()}>
              <BtnText>Voltar</BtnText>
            </ButtonVoltar>
            <ButtonSeguir onPress={handleSubmit(addEndereco)}>
              <BtnText>{data.ENDERECO ? 'Editar' : 'Salvar'}</BtnText>
            </ButtonSeguir>
          </ButtomContainer>
        </Container>
      </ScrollViewContent>
      <Modalize
        ref={listaEndereco}
        snapPoint={500}
        modalTopOffset={100}
        HeaderComponent={() => (
          <ModalHeader>
            <ModalHeaderText>Escolha um Endereço</ModalHeaderText>
          </ModalHeader>
        )}
      >
        <View>
          {enderecos &&
            enderecos.map(endereco => {
              return (
                <ModalItem
                  key={endereco.idTrecho}
                  onPress={() => selecionarEndereco(endereco)}
                >
                  <Icon name="map-pin" size={20} color="#777" />
                  <ModalItemText>
                    {`${endereco.logradouro}, ${endereco.bairro}, ${endereco.siglaUf}`}
                  </ModalItemText>
                </ModalItem>
              )
            })}
        </View>
      </Modalize>
    </>
  )
}
