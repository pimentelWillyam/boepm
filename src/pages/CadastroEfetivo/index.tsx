/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import React, { useContext, useEffect } from 'react'
import { responsiveWidth } from 'react-native-responsive-dimensions'

import { Text, Modal, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import Icon from 'react-native-vector-icons/Feather'
import ImgResponsavel from '../../assets/images/responsaveis.png'
import Input from '../../components/Input'
import BoxInput from '../../components/BoxInput'
import Storage from '../../utils/storage'
import ItemCard from '../../components/CardResponsaveis'

import {
  Imagem,
  Titulo,
  SubTitulo,
  ButtonResposavel,
  ButtonResposavelText,
  IconAdd,
  ButtomContainer,
  ButtomSeguir,
  ButtonSair,
  ButtomSeguirText,
  ContainerButton,
  Lista,
  Container,
  ContainerBoxInput,
  ButtonSairBox,
  ButtonSetValue,
  Header,
} from './styles'
import Loading from '../../components/Loading'
import useCadastroEfetivo from './useCadastroEfetivo'
import AuthContext from '../../contexts/auth'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CadastroEfetivo = () => {
  const navigation = useNavigation()
  const { logout } = useContext(AuthContext)
  const { control: formViatura, handleSubmit, errors } = useForm()
  const {
    usuario,
    removeResponsavel,
    responsaveis,
    addResponsavel,
    showBoxLoading,
    buscacpf,
    showBoxInput,
    setShowBoxInput,
  } = useCadastroEfetivo()

  const {
    control: formMatricula,
    handleSubmit: handleSubmit2,
    errors: errors2,
  } = useForm()
  const {
    control: formCpf,
    handleSubmit: handleSubmitCpf,
    errors: errorsCpf,
  } = useForm()

  useEffect(() => {
    async function loadResponsaveis() {
      if (usuario) {
        if (responsaveis.length === 0)
          await addResponsavel({ ...usuario, CD_TIPO_ENVOLVIMENTO: 0 })
      }
    }
    loadResponsaveis()
    formMatricula.setValue('MATRICULA', '')
  }, [responsaveis])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleProsseguir(data: any) {
    if (responsaveis.length < 2) {
      Alert.alert('Atenção', 'Você tem que cadastrar a sua equipe!')
      return
    }
    await Storage.set('@BOEPM:viatura', data.DS_VIATURA)
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
        },
      ],
    })
  }

  return (
    <Container>
      <ButtonSair onPress={() => logout()}>
        <Icon name="log-out" color="#666" size={22} />
      </ButtonSair>
      <Header>
        <Imagem source={ImgResponsavel} />

        <Titulo>Cadastro de Efetivo</Titulo>
        <SubTitulo>
          Informe o Efetivo Operacional que irá compor a Viatura.
        </SubTitulo>
      </Header>
      <Input
        name="DS_VIATURA"
        style={{ fontWeight: 'bold', fontSize: 16 }}
        label="Prefixo da Viatura ou 'POG'"
        control={formViatura}
        placeholder="ex: GT16500"
        error={errors.DS_VIATURA}
        rules={{ required: true }}
        maxLength={8}
        mtype="custom"
        options={{
          mask: 'SSSSSSSS',
        }}
      />
      <ContainerButton>
        <Input
          name="MATRICULA"
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            width: responsiveWidth(60),
          }}
          label="Matrícula"
          control={formMatricula}
          maxLength={7}
          keyboardType="numeric"
          placeholder="ex: 1137886"
          error={errors2.MATRICULA}
          rules={{ required: true }}
          mtype="custom"
          options={{
            mask: '9999999',
          }}
        />

        <ButtonResposavel onPress={handleSubmit2(addResponsavel)}>
          <ButtonResposavelText>Adicionar</ButtonResposavelText>
          <IconAdd name="plus-circle" />
        </ButtonResposavel>
      </ContainerButton>
      <Lista
        data={responsaveis}
        keyExtractor={(item) => String(item.ID_USUARIO)}
        renderItem={({ item }) => {
          return (
            <ItemCard
              data={item}
              key={item.ID_USUARIO}
              handleRight={async () => {
                await removeResponsavel(item)
              }}
            />
          )
        }}
      />
      <ButtomContainer>
        <ButtomSeguir onPress={handleSubmit(handleProsseguir)}>
          <ButtomSeguirText>Prosseguir</ButtomSeguirText>
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
          control={formCpf}
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
    </Container>
  )
}

export default CadastroEfetivo
