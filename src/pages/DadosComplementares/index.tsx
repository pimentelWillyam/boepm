/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react'
import { Keyboard, Alert, Text } from 'react-native'
import { useForm } from 'react-hook-form'
import moment from 'moment'

import { responsiveHeight } from 'react-native-responsive-dimensions'
import InputScrollView from 'react-native-input-scroll-view'
import { HeaderHome } from '../../components/Header'

import ImagemTopo from '../../assets/images/dados_complementares.png'
import Input from '../../components/Input'

import {
  Container,
  Titulo,
  ImgTopo,
  ImgTopoView,
  SubTitulo,
  ButtonVoltar,
  ButtonVoltarText,
  ButtomContainer,
  ButtonSeguir,
  ButtonSeguirText,
} from './styles'
import { IResponsavel } from '../../interfaces/responsavel'
import useStore from '../../store/bo'
import useStoreGlobal from '../../store/global'

const DadosComplementares = (props: any) => {
  const { bos, editar } = useStore()
  const { bo } = useStoreGlobal()
  const {
    control: formDadosComplementares,
    handleSubmit,
    errors,
  } = useForm({
    defaultValues: {
      DADOS_COMPLEMENTARES: bo === 0 ? bos[bo].DADOS_COMPLEMENTARES : '',
    },
  })
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [dadosComplementares, setDadosComplementares] = useState('')

  useEffect(() => {
    setDadosComplementares(bos[0].DADOS_COMPLEMENTARES)
    // setCount(formDadosComplementares.getValues('DADOS_COMPLEMENTARES').length)
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      },
    )
    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [formDadosComplementares, setDadosComplementares, bos])

  const handleProsseguir = useCallback(
    async (data: { DADOS_COMPLEMENTARES: string }) => {
      Keyboard.dismiss()

      if (bo === 0) {
        const status = bos[bo].BO_STATUS
        const responsaveis = bos[0].RESPONSAVEIS as []

        // if (
        //   responsaveis.find(
        //     (resp: IResponsavel) => resp.CD_TIPO_ENVOLVIMENTO === 1,
        //   )
        // ) {
        //   if (status[status.length - 1].ID_STATUS === 0) {
        //     if (dadosComplementares) {
        //       status.push({
        //         ID_STATUS: 1,
        //         DH_STATUS: moment().format('DD/MM/YYYY HH:mm'),
        //       })
        //     } else {
        //       status.pop()
        //     }
        //   }
        // }

        if (
          // Se Existe Patrulheiro
          responsaveis.find(
            (resp: IResponsavel) => resp.CD_TIPO_ENVOLVIMENTO === 1,
          ) &&
          // Se o BO está incompleto
          status[status.length - 1].ID_STATUS === 0 &&
          // Se existe texto em dados complementares
          dadosComplementares
        ) {
          status.push({
            ID_STATUS: 1,
            DH_STATUS: moment().format('DD/MM/YYYY HH:mm'),
          })
        }
        if (!dadosComplementares && status[status.length - 1].ID_STATUS === 1)
          status.pop()
        editar({
          ...bos[0],
          BO_STATUS: status,
          DADOS_COMPLEMENTARES: dadosComplementares.toUpperCase(),
        })

        props.navigation.navigate('Responsáveis')
      } else {
        Alert.alert(
          'Atenção',
          'Não se pode ajustar Dados Complementares de BO Nulo',
        )
      }
    },
    // eslint-disable-next-line react/destructuring-assignment
    [bo, bos, dadosComplementares, editar, props.navigation],
  )

  const printS = (times: number): string => {
    let str = ''
    for (let i = 0; i < times; i++) str = str.concat('S')
    return str
  }
  function ascii(): String[] {
    const arr: String[] = []
    for (let i = 65; i < 91; i++) {
      arr.push(String.fromCharCode(i))
    }
    for (let i = 97; i < 97 + 26; i++) {
      arr.push(String.fromCharCode(i))
    }
    for (let i = 0; i < 10; i++) {
      arr.push(String(i))
    }
    arr.push(' ')
    arr.push('.')
    arr.push(',')
    arr.push('á')
    arr.push('à')
    arr.push('ã')
    arr.push('â')
    arr.push('Á')
    arr.push('À')
    arr.push('Ã')
    arr.push('Â')
    arr.push('é')
    arr.push('ê')
    arr.push('É')
    arr.push('Ê')
    arr.push('ó')
    arr.push('ô')
    arr.push('õ')
    arr.push('Ó')
    arr.push('Õ')
    arr.push('Ô')
    arr.push('ç')
    arr.push('Ç')
    arr.push('-')
    arr.push('(')
    arr.push(')')
    arr.push('í')
    arr.push('Í')
    arr.push('ú')
    arr.push('Ú')
    arr.push(':')
    arr.push('/')
    arr.push(';')
    arr.push(String.fromCharCode(10))
    return arr
  }

  return (
    <>
      <HeaderHome
        drawerHome={() => {
          props.navigation.openDrawer()
        }}
      />

      <Container
        style={{
          marginTop: isKeyboardVisible ? -160 : 0,
        }}
      >
        <ImgTopoView>
          <ImgTopo source={ImagemTopo} />
        </ImgTopoView>

        <Titulo>DADOS COMPLEMENTARES</Titulo>

        <SubTitulo>Relato do Fato</SubTitulo>
        <Text style={{ fontSize: 10 }}>Para salvar, toque em "Prosseguir"</Text>
        <InputScrollView>
          <Input
            name="DADOS_COMPLEMENTARES"
            label=""
            control={formDadosComplementares}
            autoCorrect={false}
            autoCompleteType="off"
            error={errors.DADOS_COMPLEMENTARES}
            maxLength={4000}
            multiline
            numberOfLines={15}
            onChangeText={text => setDadosComplementares(text)}
            value={dadosComplementares}
            scrollEnabled
            textAlignVertical="top"
            rules={{ required: true }}
            style={{
              height: responsiveHeight(45),
              marginBottom: 0,
            }}
            mtype="custom"
            options={{
              mask: printS(4000),
              translation: {
                // eslint-disable-next-line prettier/prettier
                // eslint-disable-next-line func-names
                S(val) {
                  return ascii().indexOf(val) >= 0 ? val : ''
                },
              },
            }}
          />
        </InputScrollView>
      </Container>
      <ButtomContainer>
        <ButtonVoltar
          onPress={() => {
            Keyboard.dismiss()
            props.navigation.goBack()
          }}
        >
          <ButtonVoltarText>Voltar</ButtonVoltarText>
        </ButtonVoltar>
        <ButtonSeguir
          onPress={() =>
            handleProsseguir({
              DADOS_COMPLEMENTARES: dadosComplementares,
            })
          }
        >
          <ButtonSeguirText>Prosseguir</ButtonSeguirText>
        </ButtonSeguir>
      </ButtomContainer>
    </>
  )
}

export default DadosComplementares
