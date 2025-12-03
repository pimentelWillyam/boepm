import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import uuid from 'react-native-uuid'
import { useForm } from 'react-hook-form'
import { defineLocale } from 'moment'
import Select from '../../../components/Select'
import Input from '../../../components/Input'

import corCabeloJson from '../../../utils/data/corCabelo.json'
import tipoCabeloJson from '../../../utils/data/tipoCabelo.json'
import corOlhosJson from '../../../utils/data/corOlhos.json'
import corPeleJson from '../../../utils/data/corPele.json'
import pelagemFacialJson from '../../../utils/data/pelagemFacial.json'
import aparenciaJson from '../../../utils/data/aparencia.json'
import peculiaridades from '../../../utils/data/defeitoFisico.json'
import deficiencias from '../../../utils/data/deficiencia.json'
import { ICaracteristicas } from '../../../interfaces/bo'

import {
  Container,
  Titulo,
  SubTitulo,
  ScrollViewContent,
  Negrito,
  ButtomContainer,
  ButtonSeguir,
  ButtonVoltar,
  BtnText,
} from './styles'
import useStoreGlobal from '../../../store/global'

export default function Caracteristicas(): JSX.Element {
  const { data, setData } = useStoreGlobal()
  const navigation = useNavigation()
  const {
    control: formCaracteristicas,
    handleSubmit,
    errors,
  } = useForm({
    defaultValues: data.CARACTERISTICAS ? data.CARACTERISTICAS : {},
  })

  const voltar = () => {
    navigation.goBack()
  }

  const addCaracteristicas = async (dataForm: ICaracteristicas) => {
    const caracteristicas = { ...dataForm }

    let dadosCaracteristicas = null

    caracteristicas.ID_ENV_CARACTERISTICA = uuid.v4().toString()

    // ************** Busca Descrição para Cor Cabelo *******************
    dadosCaracteristicas = corCabeloJson.find(
      (item) => item.ID_COR_CABELO === caracteristicas.ID_COR_CABELO,
    )
    caracteristicas.NM_COR_CABELO =
      dadosCaracteristicas?.NM_COR_CABELO as string

    // ************** Busca Descrição Pelagem Facial *******************
    dadosCaracteristicas = pelagemFacialJson.find(
      (item) =>
        item.ID_TIPO_PELAGEM_FACIAL === caracteristicas.ID_TIPO_PELAGEM_FACIAL,
    )
    caracteristicas.NM_TIPO_PELAGEM_FACIAL =
      dadosCaracteristicas?.NM_TIPO_PELAGEM_FACIAL as string

    // ************** Busca Descrição Aparencia *******************
    dadosCaracteristicas = aparenciaJson.find(
      (item) => item.ID_TIPO_APARENCIA === caracteristicas.ID_TIPO_APARENCIA,
    )
    caracteristicas.NM_TIPO_APARENCIA =
      dadosCaracteristicas?.NM_TIPO_APARENCIA as string

    // ************** Busca Descrição Tipo Cabelo *******************
    dadosCaracteristicas = tipoCabeloJson.find(
      (item) => item.ID_TIPO_CABELO === caracteristicas.ID_TIPO_CABELO,
    )
    caracteristicas.NM_TIPO_CABELO =
      dadosCaracteristicas?.NM_TIPO_CABELO as string

    // ************** Busca Descrição Cor Pele *******************
    dadosCaracteristicas = corPeleJson.find(
      (item) => item.ID_COR_PELE === caracteristicas.ID_COR_PELE,
    )
    caracteristicas.NM_COR_PELE = dadosCaracteristicas?.NM_COR_PELE as string

    // ************** Busca Descrição Cor Olhos *******************
    dadosCaracteristicas = corOlhosJson.find(
      (item) => item.ID_COR_OLHOS === caracteristicas.ID_COR_OLHOS,
    )
    caracteristicas.NM_COR_OLHOS = dadosCaracteristicas?.NM_COR_OLHOS as string

    // ************** Busca Descrição Defeito Fisico *******************
    dadosCaracteristicas = peculiaridades.find(
      (item) =>
        item.ID_TIPO_DEFEITO_FISICO === caracteristicas.ID_TIPO_DEFEITO_FISICO,
    )
    caracteristicas.NM_TIPO_DEFEITO_FISICO =
      dadosCaracteristicas?.NM_TIPO_DEFEITO_FISICO as string

    // ************** Busca Descrição Deficiencia  *******************
    dadosCaracteristicas = deficiencias.find(
      (item) =>
        item.ID_TIPO_DEFICIENCIA === caracteristicas.ID_TIPO_DEFICIENCIA,
    )
    caracteristicas.NM_TIPO_DEFICIENCIA =
      dadosCaracteristicas?.NM_TIPO_DEFICIENCIA as string

    caracteristicas.ID_TIPO_MARCA_FISICA = '0'
    caracteristicas.NM_TIPO_MARCA_FISICA = 'NÃO INFORMADO'

    setData({
      CARACTERISTICAS: caracteristicas,
    })
    navigation.goBack()
  }

  return (
    <>
      <ScrollViewContent keyboardShouldPersistTaps="handled">
        <Container>
          <Titulo>Caracteristicas</Titulo>

          <SubTitulo>
            Escolha as Caracteristicas do
            <Negrito> Envolvido.</Negrito>
          </SubTitulo>
          <Select
            name="ID_COR_PELE"
            label="Cor da pele"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_COR_PELE}
            rules={{ required: true }}
            defaultValue="0"
          >
            {corPeleJson.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_COR_PELE}
                  label={item.NM_COR_PELE}
                  value={item.ID_COR_PELE}
                />
              )
            })}
          </Select>
          <Select
            name="ID_COR_CABELO"
            label="Cor do Cabelo"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_COR_CABELO}
            rules={{ required: true }}
            defaultValue="0"
          >
            {corCabeloJson.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_COR_CABELO}
                  label={item.NM_COR_CABELO}
                  value={item.ID_COR_CABELO}
                />
              )
            })}
          </Select>
          <Select
            name="ID_TIPO_CABELO"
            label="Tipo do Cabelo"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_TIPO_CABELO}
            rules={{ required: true }}
            defaultValue="0"
          >
            {tipoCabeloJson.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_TIPO_CABELO}
                  label={item.NM_TIPO_CABELO}
                  value={item.ID_TIPO_CABELO}
                />
              )
            })}
          </Select>
          <Select
            name="ID_COR_OLHOS"
            label="Cor dos Olhos"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_COR_OLHOS}
            rules={{ required: true }}
            defaultValue="0"
          >
            {corOlhosJson.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_COR_OLHOS}
                  label={item.NM_COR_OLHOS}
                  value={item.ID_COR_OLHOS}
                />
              )
            })}
          </Select>
          <Select
            name="BIGODE"
            label="Bigode"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.BIGODE}
            rules={{ required: true }}
            defaultValue="0"
          >
            <Picker.Item key="0" label="NÃO" value="0" />
            <Picker.Item key="1" label="SIM" value="1" />
          </Select>
          <Select
            name="ID_TIPO_PELAGEM_FACIAL"
            label="Pelagem Facial"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_TIPO_PELAGEM_FACIAL}
            rules={{ required: true }}
            defaultValue="0"
          >
            {pelagemFacialJson.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_TIPO_PELAGEM_FACIAL}
                  label={item.NM_TIPO_PELAGEM_FACIAL}
                  value={item.ID_TIPO_PELAGEM_FACIAL}
                />
              )
            })}
          </Select>
          <Select
            name="ID_TIPO_APARENCIA"
            label="Aparência"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_TIPO_APARENCIA}
            rules={{ required: true }}
            defaultValue="0"
          >
            {aparenciaJson.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_TIPO_APARENCIA}
                  label={item.NM_TIPO_APARENCIA}
                  value={item.ID_TIPO_APARENCIA}
                />
              )
            })}
          </Select>
          <Input
            name="TATUAGEM"
            label="Tatuagem"
            control={formCaracteristicas}
            maxLength={80}
            placeholder="ex: Carpa no Peito"
            error={errors.TATUAGEM}
            rules={{ required: false }}
          />
          <Input
            name="TIPO_CICATRIZ"
            label="Cicatriz"
            control={formCaracteristicas}
            maxLength={30}
            placeholder="ex: Braço Esquerdo"
            error={errors.TIPO_CICATRIZ}
            rules={{ required: false }}
          />
          <Input
            name="TIPO_DENTES"
            label="Tipo Dentes"
            control={formCaracteristicas}
            maxLength={30}
            placeholder="ex: Brancos"
            error={errors.TIPO_DENTES}
            rules={{ required: false }}
          />
          <Select
            name="ID_TIPO_DEFEITO_FISICO"
            label="Peculiaridades"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_TIPO_DEFEITO_FISICO}
            rules={{ required: true }}
            defaultValue="0"
          >
            {peculiaridades.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_TIPO_DEFEITO_FISICO}
                  label={item.NM_TIPO_DEFEITO_FISICO}
                  value={item.ID_TIPO_DEFEITO_FISICO}
                />
              )
            })}
          </Select>
          <Select
            name="ID_TIPO_DEFICIENCIA"
            label="Pessoa com deficiência"
            prompt="Escolha a opção"
            control={formCaracteristicas}
            error={errors.ID_TIPO_DEFICIENCIA}
            rules={{ required: true }}
            defaultValue="8"
          >
            {deficiencias.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_TIPO_DEFICIENCIA}
                  label={item.NM_TIPO_DEFICIENCIA}
                  value={item.ID_TIPO_DEFICIENCIA}
                />
              )
            })}
          </Select>
          <Input
            name="ALTURA_APARENTE"
            label="Altura Aparente"
            control={formCaracteristicas}
            maxLength={4}
            placeholder="ex: 1,81"
            keyboardType="numeric"
            error={errors.ALTURA_APARENTE}
            rules={{ required: false }}
            mtype="custom"
            options={{
              mask: '9,99',
            }}
          />
          <Input
            name="IDADE_APARENTE"
            label="Idade Aparente"
            control={formCaracteristicas}
            maxLength={5}
            placeholder="ex: 28"
            keyboardType="numeric"
            error={errors.IDADE_APARENTE}
            rules={{ required: false }}
            mtype="only-numbers"
          />
          <Input
            name="PESO"
            label="Peso Aparente"
            control={formCaracteristicas}
            maxLength={3}
            placeholder="ex: 70"
            keyboardType="numeric"
            error={errors.PESO}
            rules={{ required: false }}
            mtype="only-numbers"
          />
          <ButtomContainer>
            <ButtonVoltar onPress={() => voltar()}>
              <BtnText>Voltar</BtnText>
            </ButtonVoltar>
            <ButtonSeguir onPress={handleSubmit(addCaracteristicas)}>
              <BtnText>{data.CARACTERISTICAS ? 'Editar' : 'Salvar'}</BtnText>
            </ButtonSeguir>
          </ButtomContainer>
        </Container>
      </ScrollViewContent>
    </>
  )
}
