/* eslint-disable camelcase */
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

import { Picker } from '@react-native-picker/picker'
import { KeyboardAvoidingView, Platform, Alert } from 'react-native'

import { ScrollView } from 'react-native-gesture-handler'
import { useForm } from 'react-hook-form'
import uuid from 'react-native-uuid'
import tipoEnvolvimentoObjetoJson from '../../../utils/data/tipoEnvolvimentoObjeto.json'
import corObjetoJson from '../../../utils/data/corObjeto.json'
import tipoObjetoJson from '../../../utils/data/tipoObjeto.json'
import categoriaJson from '../../../utils/data/categoria.json'
import marcaJson from '../../../utils/data/marca.json'
import modeloJson from '../../../utils/data/modelo.json'
import moedaJson from '../../../utils/data/moeda.json'
import unidadeMedidaJson from '../../../utils/data/unidadeMedida.json'
import combustivelJson from '../../../utils/data/combustivel.json'
import dimensaoArmaJson from '../../../utils/data/dimensaoArma.json'
import acabamentoArmaJson from '../../../utils/data/acabamentoArma.json'
import coronhaArmaJson from '../../../utils/data/coronhaArma.json'
import sistemaArmaJson from '../../../utils/data/sistemaArma.json'

import { IObjeto } from '../../../interfaces/bo'
import Select from '../../../components/Select'
import Input from '../../../components/Input'
import Loading from '../../../components/Loading'

import {
  Container,
  Titulo,
  Content,
  ButtomContainer,
  ButtonSeguir,
  ButtonVoltar,
  BtnText,
} from './styles'
import useStore from '../../../store/bo'
import useStoreGlobal from '../../../store/global'

interface ICategoria {
  ID_CATEGORIA: string
  NM_CATEGORIA: string
  ID_TIPO_OBJETO: string
}

interface IMarca {
  ID_MARCA: string
  NM_MARCA: string
  ID_CATEGORIA: string
}

interface IModelo {
  ID: string
  ID_CATEGORIA: string
  ID_MARCA: string
  ID_MODELO: string
  NM_MODELO: string
}

export default function AdicionarObjeto() {
  const navigation = useNavigation()
  const route = useRoute()
  const { bo } = useStoreGlobal()
  const { bos, editar } = useStore()
  const [objeto] = useState<IObjeto | null>(
    route.params ? route.params.objeto : null,
  )
  const {
    control: formObjeto,
    handleSubmit,
    errors,
    reset,
  } = useForm({
    defaultValues: route.params ? route.params.objeto : {},
  })
  const [categorias, setCategorias] = useState<ICategoria[]>([])
  const [showLoading, setShowLoading] = useState(false)

  const [tipoObj, setTipoObj] = useState('0')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('0')
  const [marcaSelecionada, setMarcaSelecionada] = useState('')

  useEffect(() => {
    setCategorias(categoriaJson)
    if (route.params) {
      if (objeto) {
        setTipoObj(objeto.ID_TIPO_OBJETO)
        setCategoriaSelecionada(objeto.ID_CATEGORIA)
        setMarcaSelecionada(objeto.ID_MARCA as string)
      }
    }
  }, [objeto, route.params])

  async function addObjeto(data: IObjeto) {
    if (tipoObj === '3' && data.CD_PLACA) {
      const placaValida = /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/.test(data.CD_PLACA)
      if (!placaValida) {
        Alert.alert(
          'Atenção',
          'A placa do veiculo que você digitou está errada!',
        )
        return
      }
    }

    const newData: IObjeto = { ...data }
    if (!route.params) {
      newData.NOME_ENVOLVIDO = ''
      newData.ID_ENVOLVIDO = ''
      newData.FOTO = null
      newData.ID_OBJETO = uuid.v4().toString()
    } else {
      newData.ID_OBJETO = objeto ? objeto.ID_OBJETO : uuid.v4().toString()
      newData.ID_ENVOLVIDO = objeto ? objeto.ID_ENVOLVIDO : ''
      newData.NOME_ENVOLVIDO = objeto ? objeto.NOME_ENVOLVIDO : ''
      newData.FOTO = objeto ? objeto.FOTO : null
      if (
        tipoObj !== '5' &&
        tipoObj !== '6' &&
        tipoObj !== '7' &&
        tipoObj !== '8' &&
        tipoObj !== '9'
      )
        newData.FOTO = null
    }

    const tmp = tipoEnvolvimentoObjetoJson.find(
      item => item.ID_TIPO_ENVOLVIMENTO_OBJETO === newData.ID_TIPO_ENV_OBJETO,
    )
    newData.NM_TIPO_ENV_OBJETO = tmp?.NM_TIPO_ENVOLVIMENTO_OBJETO || ''

    const tmpCor = corObjetoJson.find(
      item => item.ID_COR_OBJETO === newData.ID_COR_OBJETO,
    )
    newData.NM_COR_OBJETO = tmpCor?.NM_COR_OBJETO || ''

    const tipoObjSelecionado = tipoObjetoJson.find(
      item => item.ID_TIPO_OBJETO === tipoObj,
    )
    newData.NM_TIPO_OBJETO = tipoObjSelecionado?.NM_TIPO_OBJETO || ''

    const categoriaSelect = categoriaJson.find(
      item => item.ID_CATEGORIA === categoriaSelecionada,
    )
    newData.NM_CATEGORIA = categoriaSelect?.NM_CATEGORIA || ''

    const tmpMarca = marcaJson.find(item => item.ID_MARCA === marcaSelecionada)
    newData.NM_MARCA = tmpMarca?.NM_MARCA || ''

    const tmpModelo = modeloJson.find(item => item.ID === data.ID_MODELO)
    newData.NM_MODELO = tmpModelo?.NM_MODELO || ''

    if (newData.ID_MODELO === '0') {
      newData.ID_MODELO = ''
    }

    const tmpUni = unidadeMedidaJson.find(
      item => item.ID_UNIDADE_MEDIDA === newData.ID_UNIDADE_MEDIDA,
    )
    newData.NM_UNIDADE_MEDIDA = tmpUni?.NM_UNIDADE_MEDIDA || ''

    const tmpMoeda = moedaJson.find(item => item.ID_MOEDA === newData.ID_MOEDA)
    newData.NM_MOEDA = tmpMoeda?.NM_MOEDA || ''

    newData.ID_TIPO_OBJETO = tipoObj
    newData.ID_CATEGORIA = categoriaSelecionada
    newData.ID_MARCA = marcaSelecionada

    newData.ID_OBJ_ARMA = null
    newData.ID_VEICULO = null
    newData.ID_CELULAR = null

    // Busca das descrições de Veiculo
    if (tipoObj === '3') {
      const veiculo = {
        ID_VEICULO: uuid.v4().toString(),
        FL_SEGURADORA: '',
        DS_SEGURO: '',
        DS_RASTREADOR: '',
        DS_TACOGRAFO: '',
        NM_TIPO_COMBUSTIVEL: '',
        CD_PLACA: data.CD_PLACA,
        CD_CHASSI: data.CD_CHASSI,
        CD_RENAVAM: data.CD_RENAVAM,
        CD_ANO_FABRICACAO: data.CD_ANO_FABRICACAO,
        CD_ANO_MODELO: data.CD_ANO_MODELO,
        ID_TIPO_COMBUSTIVEL: data.ID_TIPO_COMBUSTIVEL,
      }

      const tmpComb = combustivelJson.find(
        item => item.ID_TIPO_COMBUSTIVEL === data.ID_TIPO_COMBUSTIVEL,
      )
      veiculo.NM_TIPO_COMBUSTIVEL = tmpComb?.NM_TIPO_COMBUSTIVEL as string
      newData.ID_VEICULO = { ...veiculo }
    }

    // Busca das descrição de CELULAR
    if (tipoObj === '4') {
      const celular = {
        ID_CELULAR: uuid.v4().toString(),
        CEL_IMEI1: data.CEL_IMEI1,
        CEL_IMEI2: data.CEL_IMEI2,
        CEL_IMEI3: data.CEL_IMEI3,
        CEL_IMEI4: data.CEL_IMEI4,
        CEL_IMEI_JUSTIFICATIVA: data.CEL_IMEI_JUSTIFICATIVA,
      }
      newData.ID_CELULAR = { ...celular }
    }

    // Busca das Descrições de ARMA
    if (tipoObj === '5') {
      const arma = {
        ID_ARMA: uuid.v4().toString(),
        NM_DIMENSAO_ARMA: '',
        NM_ACABAMENTO_ARMA: '',
        NM_SISTEMA_ARMA: '',
        NM_CORONHA_ARMA: '',
        ID_DIMENSAO_ARMA: data.ID_DIMENSAO_ARMA,
        ID_ACABAMENTO_ARMA: data.ID_ACABAMENTO_ARMA,
        ID_SISTEMA_ARMA: data.ID_SISTEMA_ARMA,
        ID_CORONHA_ARMA: data.ID_CORONHA_ARMA,
        CD_IDENT_ARMA: data.CD_IDENT_ARMA,
        VL_CALIBRE: data.VL_CALIBRE,
        VL_QTD_CANOS: data.VL_QTD_CANOS,
        QTD_MUNICAO: data.QTD_MUNICAO,
      }
      const dimArma = dimensaoArmaJson.find(
        item => item.ID_DIMENSAO_ARMA === data.ID_DIMENSAO_ARMA,
      )
      arma.NM_DIMENSAO_ARMA = dimArma?.NM_DIMENSAO_ARMA as string

      const tmp1 = acabamentoArmaJson.find(
        item => item.ID_ACABAMENTO_ARMA === data.ID_ACABAMENTO_ARMA,
      )
      arma.NM_ACABAMENTO_ARMA = tmp1?.NM_ACABAMENTO_ARMA as string

      const tmpSist = sistemaArmaJson.find(
        item => item.ID_SISTEMA_ARMA === data.ID_SISTEMA_ARMA,
      )
      arma.NM_SISTEMA_ARMA = tmpSist?.NM_SISTEMA_ARMA as string

      const tmpCoron = coronhaArmaJson.find(
        item => item.ID_CORONHA_ARMA === data.ID_CORONHA_ARMA,
      )
      arma.NM_CORONHA_ARMA = tmpCoron?.NM_CORONHA_ARMA as string

      newData.ID_OBJ_ARMA = { ...arma }
    }

    let objs = bos[0].OBJETOS as IObjeto[]
    // Se for editar
    if (route.params) {
      if (objeto) {
        const index = objs.findIndex(
          item => item.ID_OBJETO === objeto.ID_OBJETO,
        )
        objs.splice(index, 1, newData)
      }
      // Adicionar Novo Objeto à Lista
    } else {
      objs = [newData, ...objs]
    }
    editar({
      ...bos[0],
      OBJETOS: objs,
    })
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Objetos',
        },
      ],
    })
  }

  const setTipoObjPrev = (value: string) => {
    setTipoObj(value)
    const tmp = categorias.filter(item => item.ID_TIPO_OBJETO === value)
    setCategoriaSelecionada(tmp[0].ID_CATEGORIA || '0')
    setMarcaSelecionada('')
    formObjeto.setValue('ID_MODELO', '')
    if (value === '6' || value === '5' || value === '8') {
      formObjeto.setValue('APREENDIDO', '1')
    }
  }

  return (
    <>
      <Loading animating={showLoading} text="Aguarde..." />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <Container>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Titulo>Adicionar Objeto Envolvido</Titulo>
            <Content>
              <Select
                name="ID_TIPO_ENV_OBJETO"
                label="Envolvimento do Objeto"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_TIPO_ENV_OBJETO}
                rules={{ required: true }}
                defaultValue="1"
              >
                {tipoEnvolvimentoObjetoJson.map(item => {
                  return (
                    <Picker.Item
                      key={item.ID_TIPO_ENVOLVIMENTO_OBJETO}
                      label={item.NM_TIPO_ENVOLVIMENTO_OBJETO}
                      value={item.ID_TIPO_ENVOLVIMENTO_OBJETO}
                    />
                  )
                })}
              </Select>
              <Select
                name="ID_COR_OBJETO"
                label="Cor do Objeto"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_COR_OBJETO}
                rules={{ required: true }}
                defaultValue="0"
              >
                {corObjetoJson.map(item => {
                  return (
                    <Picker.Item
                      key={item.ID_COR_OBJETO}
                      label={item.NM_COR_OBJETO}
                      value={item.ID_COR_OBJETO}
                    />
                  )
                })}
              </Select>
              <Select
                name="ID_TIPO_OBJETO"
                label="Tipo de Objeto"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_TIPO_OBJETO}
                rules={{ required: true }}
                selectedValue={tipoObj}
                defaultValue="0"
                onValueChange={itemIdTipoObj =>
                  setTipoObjPrev(itemIdTipoObj.toString() || '')
                }
              >
                {tipoObjetoJson.map(item => {
                  return (
                    <Picker.Item
                      key={item.ID_TIPO_OBJETO}
                      label={item.NM_TIPO_OBJETO}
                      value={item.ID_TIPO_OBJETO}
                    />
                  )
                })}
              </Select>
              <Select
                name="ID_CATEGORIA"
                label="Categoria do Objeto"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_CATEGORIA}
                rules={{ required: true }}
                selectedValue={categoriaSelecionada}
                onValueChange={itemIdTipoCat =>
                  setCategoriaSelecionada(itemIdTipoCat.toString() || '')
                }
              >
                {categoriaJson
                  .filter(item => item.ID_TIPO_OBJETO === tipoObj)
                  .map(item => {
                    return (
                      <Picker.Item
                        key={item.ID_CATEGORIA}
                        label={item.NM_CATEGORIA}
                        value={item.ID_CATEGORIA}
                      />
                    )
                  })}
              </Select>
              <Select
                name="ID_MARCA"
                label="Marca"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_MARCA}
                rules={{ required: false }}
                selectedValue={marcaSelecionada}
                onValueChange={itemIdMarca =>
                  setMarcaSelecionada(itemIdMarca ? itemIdMarca.toString() : '')
                }
              >
                {marcaJson
                  .filter(item => item.ID_CATEGORIA === categoriaSelecionada)
                  .map(item => {
                    return (
                      <Picker.Item
                        key={item.ID_MARCA}
                        label={item.NM_MARCA}
                        value={item.ID_MARCA}
                      />
                    )
                  })}
              </Select>
              <Select
                name="ID_MODELO"
                label="Modelo"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_MODELO}
                rules={{ required: false }}
              >
                {modeloJson
                  .filter(
                    item =>
                      item.ID_MARCA === marcaSelecionada &&
                      item.ID_CATEGORIA === categoriaSelecionada,
                  )
                  .map(item => {
                    return (
                      <Picker.Item
                        key={item.ID}
                        label={item.NM_MODELO}
                        value={item.ID}
                      />
                    )
                  })}
              </Select>
              {tipoObj === '4' && (
                <>
                  <Input
                    name="CEL_IMEI1"
                    label="Imei 1"
                    control={formObjeto}
                    placeholder="ex: 321445678712345"
                    error={errors.CEL_IMEI1}
                    keyboardType="number-pad"
                    maxLength={15}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Input
                    name="CEL_IMEI2"
                    label="Imei 2 (Se houver)"
                    control={formObjeto}
                    placeholder="ex: 321445678712345"
                    error={errors.CEL_IMEI2}
                    keyboardType="number-pad"
                    maxLength={15}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Input
                    name="CEL_IMEI3"
                    label="Imei 3 (Se houver)"
                    control={formObjeto}
                    placeholder="ex: 321445678712345"
                    error={errors.CEL_IMEI3}
                    keyboardType="number-pad"
                    maxLength={15}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Input
                    name="CEL_IMEI4"
                    label="Imei 4 (Se houver)"
                    control={formObjeto}
                    placeholder="ex: 321445678712345"
                    error={errors.CEL_IMEI4}
                    keyboardType="number-pad"
                    maxLength={15}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Input
                    name="CEL_IMEI_JUSTIFICATIVA"
                    label="Justificativa (Se não houver Imei)"
                    control={formObjeto}
                    placeholder="ex: Impossivel identificar IMEI"
                    error={errors.CEL_IMEI_JUSTIFICATIVA}
                    maxLength={100}
                    rules={{ required: false }}
                  />
                </>
              )}
              {tipoObj === '5' && (
                <>
                  <Select
                    name="ID_DIMENSAO_ARMA"
                    label="Dimensão Arma"
                    prompt="Escolha a opção"
                    control={formObjeto}
                    error={errors.ID_DIMENSAO_ARMA}
                    rules={{ required: false }}
                    defaultValue="2"
                  >
                    {dimensaoArmaJson.map(item => {
                      return (
                        <Picker.Item
                          key={item.ID_DIMENSAO_ARMA}
                          label={item.NM_DIMENSAO_ARMA}
                          value={item.ID_DIMENSAO_ARMA}
                        />
                      )
                    })}
                  </Select>
                  <Select
                    name="ID_ACABAMENTO_ARMA"
                    label="Acabamento Arma"
                    prompt="Escolha a opção"
                    control={formObjeto}
                    error={errors.ID_ACABAMENTO_ARMA}
                    rules={{ required: false }}
                    defaultValue="0"
                  >
                    {acabamentoArmaJson.map(item => {
                      return (
                        <Picker.Item
                          key={item.ID_ACABAMENTO_ARMA}
                          label={item.NM_ACABAMENTO_ARMA}
                          value={item.ID_ACABAMENTO_ARMA}
                        />
                      )
                    })}
                  </Select>
                  <Select
                    name="ID_SISTEMA_ARMA"
                    label="Sistema Arma"
                    prompt="Escolha a opção"
                    control={formObjeto}
                    error={errors.ID_SISTEMA_ARMA}
                    rules={{ required: false }}
                    defaultValue="0"
                  >
                    {sistemaArmaJson.map(item => {
                      return (
                        <Picker.Item
                          key={item.ID_SISTEMA_ARMA}
                          label={item.NM_SISTEMA_ARMA}
                          value={item.ID_SISTEMA_ARMA}
                        />
                      )
                    })}
                  </Select>
                  <Select
                    name="ID_CORONHA_ARMA"
                    label="Coronha Arma"
                    prompt="Escolha a opção"
                    control={formObjeto}
                    error={errors.ID_CORONHA_ARMA}
                    rules={{ required: false }}
                    defaultValue="0"
                  >
                    {coronhaArmaJson.map(item => {
                      return (
                        <Picker.Item
                          key={item.ID_CORONHA_ARMA}
                          label={item.NM_CORONHA_ARMA}
                          value={item.ID_CORONHA_ARMA}
                        />
                      )
                    })}
                  </Select>
                  <Input
                    name="CD_IDENT_ARMA"
                    label="Identificação da Arma"
                    control={formObjeto}
                    placeholder="ex: SDK13254"
                    error={errors.CD_IDENT_ARMA}
                    maxLength={30}
                    rules={{ required: false }}
                  />
                  <Input
                    name="VL_CALIBRE"
                    label="Calibre da Arma"
                    control={formObjeto}
                    placeholder="ex: .40 | .38 | .22 | 380"
                    error={errors.VL_CALIBRE}
                    maxLength={10}
                    rules={{ required: false }}
                  />
                  <Input
                    name="VL_QTD_CANOS"
                    label="Quantidade de canos"
                    control={formObjeto}
                    placeholder="ex: 1"
                    error={errors.VL_QTD_CANOS}
                    defaultValue="1"
                    maxLength={10}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Input
                    name="QTD_MUNICAO"
                    label="Quantidade de munições"
                    control={formObjeto}
                    placeholder="ex: 10"
                    error={errors.QTD_MUNICAO}
                    maxLength={10}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                </>
              )}

              {tipoObj === '3' && (
                <>
                  <Input
                    name="CD_PLACA"
                    label="Placa"
                    control={formObjeto}
                    placeholder="ex: KGE5F90 | GFI4550"
                    error={errors.CD_PLACA}
                    maxLength={8}
                    rules={{ required: true }}
                    mtype="custom"
                    options={{
                      mask: 'SSS9S99',
                    }}
                  />
                  <Input
                    name="CD_CHASSI"
                    label="Chassi"
                    control={formObjeto}
                    error={errors.CD_CHASSI}
                    maxLength={30}
                    rules={{ required: false }}
                  />
                  <Input
                    name="CD_RENAVAM"
                    label="Renavam"
                    control={formObjeto}
                    placeholder="ex: 546798321654"
                    error={errors.CD_RENAVAM}
                    keyboardType="numeric"
                    maxLength={20}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Input
                    name="CD_ANO_FABRICACAO"
                    label="Ano de Fabricação"
                    control={formObjeto}
                    placeholder="ex: 2008"
                    error={errors.CD_ANO_FABRICACAO}
                    keyboardType="numeric"
                    maxLength={4}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Input
                    name="CD_ANO_MODELO"
                    label="Ano do Modelo"
                    control={formObjeto}
                    placeholder="ex: 2008"
                    error={errors.CD_ANO_MODELO}
                    keyboardType="numeric"
                    maxLength={4}
                    rules={{ required: false }}
                    mtype="only-numbers"
                  />
                  <Select
                    name="ID_TIPO_COMBUSTIVEL"
                    label="Tipo de combustivel"
                    prompt="Escolha a opção"
                    control={formObjeto}
                    error={errors.ID_TIPO_COMBUSTIVEL}
                    rules={{ required: true }}
                    defaultValue="0"
                  >
                    {combustivelJson.map(item => {
                      return (
                        <Picker.Item
                          key={item.ID_TIPO_COMBUSTIVEL}
                          label={item.NM_TIPO_COMBUSTIVEL}
                          value={item.ID_TIPO_COMBUSTIVEL}
                        />
                      )
                    })}
                  </Select>
                </>
              )}
              <Input
                name="NUM_SERIE"
                label="Número de Série"
                control={formObjeto}
                placeholder="ex: XF78441SWE96"
                error={errors.NUM_SERIE}
                maxLength={32}
                rules={{ required: false }}
                editable={tipoObj !== '6'}
              />
              <Select
                name="APREENDIDO"
                label="Objeto apreendido?"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.APREENDIDO}
                rules={{ required: true }}
                defaultValue="0"
              >
                <Picker.Item key="0" label="NÃO" value="0" />
                <Picker.Item key="1" label="SIM" value="1" />
              </Select>

              <Select
                name="ID_MOEDA"
                label="Moeda"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_MOEDA}
                rules={{ required: true }}
                defaultValue="129"
              >
                {moedaJson.map(item => {
                  return (
                    <Picker.Item
                      key={item.ID_MOEDA}
                      label={`${item.NM_MOEDA} (${item.NM_SIGLA})`}
                      value={item.ID_MOEDA}
                    />
                  )
                })}
              </Select>
              <Input
                name="VL_VALOR"
                label="Valor"
                control={formObjeto}
                keyboardType="numeric"
                placeholder="ex: 15,00"
                maxLength={10}
                error={errors.VL_VALOR}
                rules={{ required: false }}
                mtype="money"
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: '',
                  suffixUnit: '',
                }}
              />

              <Select
                name="ID_UNIDADE_MEDIDA"
                label="Unidade de Medida"
                prompt="Escolha a opção"
                control={formObjeto}
                error={errors.ID_UNIDADE_MEDIDA}
                rules={{ required: true }}
                defaultValue="10"
              >
                {unidadeMedidaJson.map(item => {
                  return (
                    <Picker.Item
                      key={item.ID_UNIDADE_MEDIDA}
                      label={item.NM_UNIDADE_MEDIDA}
                      value={item.ID_UNIDADE_MEDIDA}
                    />
                  )
                })}
              </Select>
              <Input
                name="QTD_OBJETO"
                label="Quantidade"
                control={formObjeto}
                keyboardType="numeric"
                defaultValue="1"
                placeholder="ex: 5"
                maxLength={10}
                error={errors.QTD_OBJETO}
                rules={{ required: true }}
                mtype="only-numbers"
              />
            </Content>
            <ButtomContainer>
              <ButtonVoltar onPress={() => navigation.navigate('Objetos')}>
                <BtnText>Voltar</BtnText>
              </ButtonVoltar>
              <ButtonSeguir onPress={handleSubmit(addObjeto)}>
                <BtnText>{route.params ? 'Editar' : 'Adicionar'}</BtnText>
              </ButtonSeguir>
            </ButtomContainer>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </>
  )
}
