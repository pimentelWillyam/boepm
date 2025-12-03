import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import uuid from 'react-native-uuid'
import { useForm } from 'react-hook-form'
import Select from '../../../components/Select'
import Input from '../../../components/Input'
import { IDadosProfissionais } from '../../../interfaces/bo'
import profissaoJson from '../../../utils/data/profissao.json'

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

export default function DadosProfissionais(): JSX.Element {
  const { data, setData } = useStoreGlobal()
  const navigation = useNavigation()
  const {
    control: formDadosProfissionais,
    handleSubmit,
    errors,
  } = useForm({
    defaultValues: data.DADOS_PROFISSIONAIS ? data.DADOS_PROFISSIONAIS : {},
  })

  const voltar = () => {
    navigation.goBack()
  }

  const addDadosProfissionais = async (dataForm: IDadosProfissionais) => {
    const dadosProfissionais = { ...dataForm }

    dadosProfissionais.ID_DADOS_PROF = uuid.v4().toString()
    dadosProfissionais.ID_RAMO_ATIVIDADE = '0'
    dadosProfissionais.NM_RAMO_ATIVIDADE = 'NÃO INFORMADO'

    let nm = null
    // ************** Busca Descrição de Profissão *******************
    nm = profissaoJson.find(
      (item) => item.ID_PROFISSAO === dataForm.ID_PROFISSAO,
    )
    dadosProfissionais.NM_PROFISSAO = nm?.NM_PROFISSAO as string

    dadosProfissionais.ENDERECO_COMERCIAL = null
    setData({
      DADOS_PROFISSIONAIS: dadosProfissionais,
    })
    navigation.goBack()
  }

  return (
    <>
      <ScrollViewContent keyboardShouldPersistTaps="handled">
        <Container>
          <Titulo>Dados Profissionais</Titulo>

          <SubTitulo>
            Preencha os Dados Profissionais do
            <Negrito> Envolvido.</Negrito>
          </SubTitulo>
          <Select
            name="ID_PROFISSAO"
            label="Profissão"
            prompt="Escolha a opção"
            control={formDadosProfissionais}
            error={errors.ID_PROFISSAO}
            rules={{ required: true }}
            defaultValue="0"
          >
            {profissaoJson.map((item) => {
              return (
                <Picker.Item
                  key={item.ID_PROFISSAO}
                  label={item.NM_PROFISSAO}
                  value={item.ID_PROFISSAO}
                />
              )
            })}
          </Select>
          <Input
            name="NOME_EMPRESA"
            label="Nome da Empresa"
            placeholder="Digite o nome da empresa aqui"
            control={formDadosProfissionais}
            error={errors.NOME_EMPRESA}
            maxLength={64}
            rules={{ required: false }}
          />
          <Input
            name="FONE_COMERCIAL"
            label="Telefone da Empresa"
            control={formDadosProfissionais}
            maxLength={15}
            keyboardType="numeric"
            placeholder="ex: 81 94587-9874"
            error={errors.FONE_COMERCIAL}
            rules={{ required: false }}
            mtype="cel-phone"
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) ',
            }}
          />
          <ButtomContainer>
            <ButtonVoltar onPress={() => voltar()}>
              <BtnText>Voltar</BtnText>
            </ButtonVoltar>
            <ButtonSeguir onPress={handleSubmit(addDadosProfissionais)}>
              <BtnText>
                {data.DADOS_PROFISSIONAIS ? 'Editar' : 'Salvar'}
              </BtnText>
            </ButtonSeguir>
          </ButtomContainer>
        </Container>
      </ScrollViewContent>
    </>
  )
}
