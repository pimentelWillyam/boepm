/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import Icon from 'react-native-vector-icons/Feather'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
} from 'react-native'
// import { WebView } from 'react-native-webview'
// import DeviceInfo from 'react-native-device-info'

// import MapView, {
//   Callout,
//   Marker,
//   PROVIDER_GOOGLE,
//   Region,
// } from 'react-native-maps'
// import Signature from 'react-native-signature-canvas'
// import Share from 'react-native-share'
// import sha512 from 'js-sha512'

// import RNFS from 'react-native-fs'
// import InstallApk from 'react-native-install-apk';

import { useStallionUpdate, sync, restart } from 'react-native-stallion'

import { useForm, Controller } from 'react-hook-form'
import { SignatureViewRef } from 'react-native-signature-canvas'
import Geolocation from 'react-native-geolocation-service'
import { InputLoginData } from '../../services/auth'

import logo from '../../assets/logos/pm.png'
import InputLogin from '../../components/InputLogin'

import AuthContext from '../../contexts/auth'
import Config from '../../config'
import Loading from '../../components/Loading'

import {
  Container,
  ImageLogo,
  Titulo,
  Subtitulo,
  Warning,
  ButtonAcessar,
  ButtonTextAcessar,
  Footer,
  TextGTI,
  TextVersao,
  ButtonLogin,
  UpdateButton,
  DuvidasButton,
  Header,
  Form,
} from './styles'
import requestPermission from '../../utils/request-permission'
import useStoreGlobal from '../../store/global'
import useStoreUsuario from '../../core/data/repositories/usuario'
import { ModalAtualizacao } from '../../components/Modais/ModalAtualizacao'

const Login = () => {
  const sign = useRef<SignatureViewRef>(null)
  const { control, handleSubmit, errors } = useForm()
  const { login } = useContext(AuthContext)
  const [show, setShow] = useState(false)

  const [loading, setLoading] = useState(false)
  const [updateStatus, setUpdateStatus] = useState('')
  const [showBoxLoading, setShowBoxLoading] = useState(false)
  const [isAtualizado, setIsAtualizado] = useState(false)
  const [mounted, setMounted] = useState(true)
  const [lat, setLat] = useState('0')
  const [lon, setLon] = useState('0')
  const { username } = useStoreGlobal()
  const storageUsuario = useStoreUsuario()

  useEffect(() => {
    setMounted(true)
    async function loadPermissions() {
      await requestPermission('READ_EXTERNAL_STORAGE')
      await requestPermission('READ_PHONE_STATE')
      await requestPermission('WRITE_EXTERNAL_STORAGE')
      await requestPermission('ACCESS_COARSE_LOCATION')
      await requestPermission('ACCESS_BACKGROUND_LOCATION')
      await requestPermission('ACCESS_FINE_LOCATION')
      // const userNameStorage = await Storage.get('@BOEPM:username')
      if (username) {
        control.setValue('user', username)
      }
    }
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
    loadPermissions()
    // searchUpdates()
    return () => setMounted(false)
  }, [control, mounted, username])

  const comoAcessar = async () => {
    Alert.alert(
      'Como acessar?',
      `Utilize seu Usuário e Senha do Expresso(Mesmo do SEI).`,
    )

    // const res = await loginPresenter('marlon.castro', '16scm4mC#')

    //     Alert.alert(
    //       'Notas de Atualização',
    //       `* Correção do Bug na página de visualização. \n
    // * Implementação da busca de endereços`,
    //     )
    // Share.open.toString()

    // const sistema = DeviceInfo.getSystemName()
    // const ver = DeviceInfo.getSystemVersion()
    // DeviceInfo.getManufacturer().then((data) => {
    // })
    // const modelo = DeviceInfo.getModel()
    // const id = DeviceInfo.getUniqueId()

    // Signature.toString()

    // WebView.toString()
    // setModalVisible(!isModalVisible)
    // ################### Social Share ############################
    // const shareOptions = {
    //   title: 'Share via',
    //   message: 'some message',
    //   social: Share.Social.WHATSAPP,
    // }
    // Share.shareSingle(shareOptions)
    //   .then((res) => {
    //   })
    //   .catch((err) => {
    //   })
    // #################################################################
  }

  const previousLogin = async (data: InputLoginData) => {
    setLoading(true)
    if (data.user && data.senha) {
      const message = await login(data)
      if (message) {
        setLoading(false)
        if (
          message ===
          'Atenção: O App do BOEPM que você está utilizando está desatualizado. A Versão minima deve ser 1.9.12!\n\nAtualize pressionando o Número da versão abaixo!'
        ) {
        }
        if (Config.ENVIRONMENT === Config.HML)
          Alert.alert('Erro de Login', message)
        else Alert.alert('Não Autorizado', message)
      }
    }
  }

  async function handleLogin(data: InputLoginData) {
    if (Config.ENVIRONMENT !== Config.PROD) {
      Alert.alert(
        'APP DE TREINAMENTO!',
        'Você NÃO DEVE registrar BOs reais aqui. App exclusivo para TREINAMENTO!\n\nDúvidas\nInforme-se no Grupo de Suporte!',
        [
          {
            text: 'NÃO ENTRAR',
            onPress: () => {
              // BackHandler.exitApp()
            },
          },
          {
            text: 'CIENTE',
            onPress: async () => {
              previousLogin({ ...data, lat, lon })
            },
          },
        ],
      )
    } else {
      previousLogin({ ...data, lat, lon })
    }
  }

  const showPassword = () => setShow(!show)

  //   const installApk = async (filePath: string) => {
  //     try {
  //         await InstallApk.install(filePath);
  //     } catch (error) {
  //         console.error('Falha na instalação:', error);
  //     }
  // };

  const updateApk = async () => {
    Alert.alert(
      'Atenção',
      'Tem certeza que deseja forçar uma atualização do BOEPM?',
      [
        {
          text: 'AGORA NÃO',
        },
        {
          text: 'SIM',
          onPress: () => {
            sync()
            restart()
            // const urlApk = Config.urlEnvironments[Config.ENVIRONMENT].apkUrl

            // const filePath = `${RNFS.DocumentDirectoryPath}/policiaagil-sds.apk`
            // const download = RNFS.downloadFile({
            //   fromUrl: urlApk,
            //   toFile: filePath,
            //   progress: (res) => {
            //     setShowBoxLoading(true)
            //     setUpdateStatus(
            //       `Baixando: ${(
            //         (res.bytesWritten / res.contentLength) *
            //         100
            //       ).toFixed(2)}%`,
            //     )
            //   },
            //   progressDivider: 1,
            // })

            // download.promise.then(async (result) => {
            //   if (result.statusCode === 200) {
            //     setShowBoxLoading(false)
            //     // RNApkInstallerN.install(filePath)
            //     await InstallApk.install(filePath);
            //   }
            // })
          },
        },
      ],
    )
  }

  const style = `.m-signature-pad--footer
  .save {
      display: none;
  }
  .clear {
      display: none;
  }
`

  const handleClear = () => {
    sign.current?.clearSignature()
  }
  const handleConfirm = () => {
    sign.current?.readSignature()
  }
  const handleOK = (signature: string) => {}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 250,
      padding: 10,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    },
  })

  const hadleDuvidas = () => {
    Alert.alert(
      'Atenção',
      'Você será redirecionado para o Grupo de Suporte para tirar suas dúvidas.',
      [
        {
          text: 'NÃO',
        },
        {
          text: 'IR',
          onPress: () => {
            const linkWhatsAppGroupSupport =
              'https://chat.whatsapp.com/DgnbeK6AXav0AJoTk9YZ8s'

            Linking.openURL(linkWhatsAppGroupSupport)
          },
        },
      ],
    )
  }

  return (
    <>
      <>
        <ModalAtualizacao />
      </>
      {/* <Loading animating={loadingReq} text="Carregando..." /> */}
      <Container>
        <Header>
          <ImageLogo source={logo} />
          {/* <Titulo>BIDS - BOEPM</Titulo>
          <Subtitulo>Boletim Integrado de Defesa Social</Subtitulo> */}
          <Titulo>BOEPM</Titulo>
          <Subtitulo>Boletim de Ocorrências Eletrônico</Subtitulo>
          {Config.ENVIRONMENT === Config.HML && (
            <Warning>NÃO REGISTRE BO's REAIS. Versão de Treinamento!</Warning>
          )}
        </Header>
        <Form>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <InputLogin
                onBlur={onBlur}
                onChangeText={(text) => onChange(text)}
                value={value}
                icon="user"
                error={errors.user}
                placeholder="Login"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
            name="user"
            rules={{ required: true }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <InputLogin
                onBlur={onBlur}
                onChangeText={(text) => onChange(text)}
                value={value}
                icon="lock"
                error={errors.senha}
                onTouchStart={() => {}}
                placeholder="Senha"
                secureTextEntry={!show}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                handleShow={showPassword}
                iconPassword={show ? 'eye' : 'eye-off'}
              />
            )}
            name="senha"
            rules={{ required: true }}
            defaultValue=""
          />
          <ButtonLogin onPress={handleSubmit(handleLogin)}>
            {loading ? (
              <ActivityIndicator size="large" color="#ccc" />
            ) : (
              'Entrar'
            )}
          </ButtonLogin>
          <ButtonAcessar onPress={() => comoAcessar()}>
            <ButtonTextAcessar>Como acessar?</ButtonTextAcessar>
          </ButtonAcessar>
        </Form>
        <Footer>
          <DuvidasButton onPress={() => hadleDuvidas()}>
            <Icon name="alert-triangle" size={18} color="#f00" />
            <TextGTI>Dúvidas</TextGTI>
          </DuvidasButton>
          <UpdateButton onLongPress={() => updateApk()}>
            <TextVersao>
              {`${Config.APP_VERSION}`}
              {/* {isAtualizado ? (
                `${packagejson.version}${Config.ENVIRONMENT < 2 ? 'b' : ''}`
              ) : (
                <ActivityIndicator size="small" color="#ccc" />
              )} */}
            </TextVersao>
          </UpdateButton>
        </Footer>
        <Modal
          transparent
          visible={showBoxLoading}
          statusBarTranslucent
          hardwareAccelerated
        >
          <Loading animating text={updateStatus} />
        </Modal>
      </Container>
    </>
  )
}

export default Login
