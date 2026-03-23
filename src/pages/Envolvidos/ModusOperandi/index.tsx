import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import { useForm } from 'react-hook-form'
import Select from '../../../components/Select'
import FotoModusOp from '../../../assets/images/modus_operandi.png'
import modusOperandiJson from '../../../utils/data/modusOperandi.json'
import { IModusOperandi } from '../../../interfaces/bo'

import {
  Container,
  FotoHome,
  Titulo,
  SubTitulo,
  ScrollViewContent,
  // Select,
  Negrito,
  ButtomContainer,
  ButtonSeguir,
  ButtonVoltar,
  BtnText,
} from './styles'
import useStoreGlobal from '../../../store/global'

interface IModusOperandiOpcoes {
  ID_MODUS_OPERANDI: string
  NM_MODUS_OPERANDI: string
  ID_TIPO_MODUS_OPERANDI: string
}

export default function ModusOperandi(): JSX.Element {
  const { data, setData } = useStoreGlobal()
  // const [envolvido] = useState<IEnvolvido | null>(route.params.envolvido)
  const {
    control: formModusOperandi,
    handleSubmit,
    errors,
  } = useForm({
    defaultValues: data.MODUS_OPERANDI ? data.MODUS_OPERANDI : {},
  })
  const navigation = useNavigation()

  const [modusOperandiOpcoes, setModusOperandiOpcoes] = useState<
    IModusOperandiOpcoes[]
  >([])

  useEffect(() => {
    setModusOperandiOpcoes(modusOperandiJson)
  }, [])

  const addModusOperandi = async (dataForm: IModusOperandi) => {
    const modusOperandi = { ...dataForm }

    let nm = null
    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_FORMA_APROXIMACAO,
    )
    modusOperandi.NM_FORMA_APROXIMACAO = nm?.NM_MODUS_OPERANDI

    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_FORMA_ACAO_ABORDAGEM,
    )
    modusOperandi.NM_FORMA_ACAO_ABORDAGEM = nm?.NM_MODUS_OPERANDI

    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_LOCAL_ENTRADA,
    )
    modusOperandi.NM_LOCAL_ENTRADA = nm?.NM_MODUS_OPERANDI

    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_FORMA_ENTRADA,
    )
    modusOperandi.NM_FORMA_ENTRADA = nm?.NM_MODUS_OPERANDI

    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_FORMA_DE_EVASAO,
    )
    modusOperandi.NM_FORMA_DE_EVASAO = nm?.NM_MODUS_OPERANDI

    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_ALTERACOES_NO_LOCAL,
    )
    modusOperandi.NM_ALTERACOES_NO_LOCAL = nm?.NM_MODUS_OPERANDI

    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_CRIMES_SEXUAIS,
    )
    modusOperandi.NM_CRIMES_SEXUAIS = nm?.NM_MODUS_OPERANDI

    nm = modusOperandiJson.find(
      item => item.ID_MODUS_OPERANDI === dataForm.ID_ESTELIONATO,
    )
    modusOperandi.NM_ESTELIONATO = nm?.NM_MODUS_OPERANDI
    setData({
      MODUS_OPERANDI: modusOperandi,
    })
    navigation.goBack()
  }

  return (
    <>
      <ScrollViewContent keyboardShouldPersistTaps="handled">
        <Container>
          <FotoHome source={FotoModusOp} />
          <Titulo>Modus Operandi</Titulo>

          <SubTitulo>
            Explique de que forma o indivíduo agiu para cometer o
            <Negrito> crime.</Negrito>
          </SubTitulo>
          <Select
            name="ID_FORMA_APROXIMACAO"
            label="Forma de Aproximação"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_FORMA_APROXIMACAO}
            defaultValue="3001"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '3000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>
          <Select
            name="ID_FORMA_ACAO_ABORDAGEM"
            label="Forma de ação da Abordagem"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_FORMA_ACAO_ABORDAGEM}
            defaultValue="7001"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '7000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>
          <Select
            name="ID_LOCAL_ENTRADA"
            label="Local de Entrada"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_LOCAL_ENTRADA}
            defaultValue="6001"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '6000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>
          <Select
            name="ID_FORMA_ENTRADA"
            label="Forma de Entrada"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_FORMA_ENTRADA}
            defaultValue="4001"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '4000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>
          <Select
            name="ID_FORMA_DE_EVASAO"
            label="Forma de Evasão"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_FORMA_DE_EVASAO}
            defaultValue="5001"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '5000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>
          <Select
            name="ID_ALTERACOES_NO_LOCAL"
            label="Alterações no Local"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_ALTERACOES_NO_LOCAL}
            defaultValue="8000"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '8000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>
          <Select
            name="ID_CRIMES_SEXUAIS"
            label="Crimes Sexuais"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_CRIMES_SEXUAIS}
            defaultValue="9000"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '9000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>
          <Select
            name="ID_ESTELIONATO"
            label="Estelionato"
            prompt="Escolha a opção"
            control={formModusOperandi}
            error={errors.ID_ESTELIONATO}
            defaultValue="10000"
          >
            {modusOperandiOpcoes
              .filter(item => item.ID_TIPO_MODUS_OPERANDI === '10000')
              .map(modus => {
                return (
                  <Picker.Item
                    key={modus.ID_MODUS_OPERANDI}
                    label={modus.NM_MODUS_OPERANDI}
                    value={modus.ID_MODUS_OPERANDI}
                  />
                )
              })}
          </Select>

          <ButtomContainer>
            <ButtonVoltar onPress={() => navigation.goBack()}>
              <BtnText>Voltar</BtnText>
            </ButtonVoltar>
            <ButtonSeguir onPress={handleSubmit(addModusOperandi)}>
              <BtnText>{data.MODUS_OPERANDI ? 'Editar' : 'Salvar'}</BtnText>
            </ButtonSeguir>
          </ButtomContainer>
        </Container>
      </ScrollViewContent>
    </>
  )
}
