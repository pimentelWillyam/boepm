/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState, useRef, memo } from 'react'
import { StyleSheet, Animated, ActivityIndicator } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import { IBOStatus } from '../../interfaces/bo'
import {
  Container,
  Info,
  ItemText,
  Negrito,
  ContainerButtonEditar,
  ButtonIcon,
  IconMoreOption,
  StatusText,
  BODP,
  Status,
  ContainerInfo,
  Mike,
  Header,
  DateText,
  Content,
  DataECloud,
  TextDP,
  ComplementadoText,
  DisparaContateSuporte,
} from './styles'

interface PropsCardBO {
  data: any
  handleRight: any
  handleBOComplementar: any
  handleFinalizar: any
  handleEditar: any
  uploadBO: any
  loading: any
  encaminharDP: any
  selectedIdBo: any
  handleCompartilhar: any
  contateOSuporte: any
}

function CardBO(props: PropsCardBO) {
  const {
    data,
    handleRight,
    handleBOComplementar,
    handleFinalizar,
    handleEditar,
    uploadBO,
    loading,
    encaminharDP,
    selectedIdBo,
    handleCompartilhar,
    contateOSuporte,
  } = props

  const [status, setStatus] = useState(0)
  const [statusDesc, setStatusDesc] = useState('Não definido')
  const [naturezas, setNaturezas] = useState('')
  const [crc, setCrc] = useState('')
  const [online, setOnline] = useState(false)
  const [dataHora, setDataHora] = useState('')
  const [envolvimento, setEnvolvimento] = useState('')
  const [BO_DP, setBO_DP] = useState<string | null>(null)
  const swipeable = useRef<Swipeable>(null)

  useEffect(() => {
    const status_id = data.BO_STATUS[data.BO_STATUS.length - 1] as IBOStatus
    const st = status_id.ID_STATUS
    setDataHora(status_id.DH_STATUS)

    if (status_id.HASH && status_id.CRC) {
      setOnline(true)
      setCrc(status_id.CRC)
      setBO_DP(status_id.BO_DP || null)
    } else {
      setOnline(false)
    }

    switch (data.CD_TIPO_ENVOLVIMENTO) {
      case 0:
        setEnvolvimento('Condutor')
        break
      case 1:
        setEnvolvimento('Patrulheiro')
        break
      default:
        setEnvolvimento('Apoio')
        break
    }

    setStatus(st)
    switch (st) {
      case 0:
        setStatusDesc('Incompleto')
        break
      case 1:
        setStatusDesc('Pronto')
        break
      case 2:
        setStatusDesc('Concluido no Local')
        break
      case 3:
        setStatusDesc('Encaminhado para DP')
        break
      case 4:
        setStatusDesc('Concluido na DP')
        break
      default:
        setStatusDesc('Outro')
        break
    }
    setNaturezas(
      `${data.NATUREZAS[0].NATUREZA.substr(0, 50)} ${
        data.NATUREZAS.length > 1 ? ` ... (+${data.NATUREZAS.length - 1})` : ''
      }`,
    )
  }, [])

  const closeModal = () => {
    swipeable.current?.close()
    handleBOComplementar()
  }

  function rightActions() {
    if (status === 1 || status === 0) {
      return (
        <RectButton style={styles.excluir} onPress={handleRight}>
          <Animated.Text style={[styles.text]}>
            <Icon name="trash" size={20} color="#fff" />
          </Animated.Text>
        </RectButton>
      )
    }
    if ((status === 2 || status === 3) && online) {
      return (
        <RectButton style={styles.complementar} onPress={closeModal}>
          <Animated.Text style={[styles.text]}>
            <Icon name="copy" size={20} color="#fff" />
          </Animated.Text>
        </RectButton>
      )
    }
    return null
  }

  function leftActions() {
    return null
  }

  return (
    <Swipeable
      renderRightActions={rightActions}
      renderLeftActions={leftActions}
      ref={swipeable}
    >
      <Container>
        <ContainerInfo>
          <Header>
            {!data.ERRO && status >= 1 && !online ? (
              <DisparaContateSuporte onLongPress={contateOSuporte}>
                <Mike>
                  M-
                  {data.CD_OCORRENCIA}
                </Mike>
              </DisparaContateSuporte>
            ) : (
              <Mike>
                M-
                {data.CD_OCORRENCIA}
              </Mike>
            )}
            <DataECloud>
              <DateText>{dataHora}</DateText>
              {!online ? (
                status >= 2 &&
                selectedIdBo === data.ID_BO &&
                (loading === true ? (
                  <ActivityIndicator
                    style={{ marginLeft: 9 }}
                    size="small"
                    color="#aaa"
                  />
                ) : (
                  !data.ERRO && (
                    <TouchableOpacity onPress={uploadBO}>
                      <Icon
                        name="upload-cloud"
                        size={17}
                        color="#ff531a"
                        style={{ marginLeft: 10 }}
                      />
                    </TouchableOpacity>
                  )
                ))
              ) : (
                <Icon
                  name="cloud"
                  size={18}
                  color="#2fc117"
                  style={{ marginLeft: 10 }}
                />
              )}
              {status === 3 &&
                online &&
                // eslint-disable-next-line no-nested-ternary
                (BO_DP ? (
                  <TextDP style={{ color: '#2fc117', marginLeft: 5 }}>DP</TextDP>
                ) : loading ? (
                  <ActivityIndicator
                    style={{ marginLeft: 9 }}
                    size="small"
                    color="#aaa"
                  />
                ) : envolvimento === 'Condutor' ? (
                  <TouchableOpacity onPress={encaminharDP}>
                    <TextDP style={{ color: '#ff531a' }}>DP</TextDP>
                  </TouchableOpacity>
                ) : (
                  <TextDP style={{ color: '#aaaaaa' }}>DP</TextDP>
                ))}
            </DataECloud>
          </Header>
          <Content>
            {data.ERRO && (
              <ComplementadoText>Contate o suporte</ComplementadoText>
            )}
            {data.COMPLEMENTADO === 1 && (
              <ComplementadoText>Complementado</ComplementadoText>
            )}
            <Info onPress={handleEditar}>
              <ItemText>
                Natureza:
                <Negrito>{` ${naturezas}`}</Negrito>
              </ItemText>
              <ItemText>
                Viatura:
                {` ${data.DS_VIATURA} `}
                <Negrito>
{` - ${envolvimento}`}
{' '}
 </Negrito>
              </ItemText>
              <ItemText>
                Desfecho:
                {data.NM_TIPO_DESFECHO
                  ? ` ${
                      status === 4 ? '*CONCLUIDO NA DP' : data.NM_TIPO_DESFECHO
                    }`
                  : ' Em Andamento'}
              </ItemText>
              <ItemText>
                Verificador:
                {crc ? ` ${crc}` : ' Não disponivel'}
              </ItemText>
            </Info>
            <ContainerButtonEditar>
              {(status === 0 || status === 1) && (
                <ButtonIcon onPress={handleFinalizar}>
                  <IconMoreOption name="file-text" />
                </ButtonIcon>
              )}
              {status > 1 && !data.ERRO && !data.COMPLEMENTADO && online && (
                <ButtonIcon onPress={handleCompartilhar}>
                  <IconMoreOption name="share" />
                </ButtonIcon>
              )}
            </ContainerButtonEditar>
          </Content>
        </ContainerInfo>
        <Status>
          <BODP>
            <Negrito style={{ color: '#555' }}>{BO_DP}</Negrito>
          </BODP>

          <StatusText status={status}>{statusDesc}</StatusText>
        </Status>
      </Container>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  excluir: {
    backgroundColor: '#f00',
    justifyContent: 'center',
    margin: 5,
    height: 125,
    marginTop: 0,
    borderRadius: 5,
  },
  complementar: {
    backgroundColor: '#3e88fa',
    justifyContent: 'center',
    margin: 5,
    height: 125,
    marginTop: 0,
    borderRadius: 5,
  },
  text: {
    fontSize: 17,
    color: '#fff',
    padding: 20,
  },
})

export default memo(CardBO)
