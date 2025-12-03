/* eslint-disable no-shadow */
/* eslint-disable camelcase */
import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { InputLoginData, onLogin } from '../services/auth'
import api from '../services/api'
import BO, { AuthContextData } from '../interfaces/bo'
import Config from '../config'
import useStore from '../store/bo'
import useStoreResponsaveis from '../store/responsaveis'
import IUsuario from '../interfaces/usuario'
import useStoreUsuario from '../store/usuario'
import useStoreGlobal from '../store/global'

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }: any) => {
  const { inicial, bos: bosStore } = useStore()
  const { username, saveUsername, setPage } = useStoreGlobal()
  const [loading, setLoading] = useState(true)
  const [temResponsaveis, setTemResponsaveis] = useState(false)
  const [loadingReq, setLoadingReq] = useState(false)
  const { responsaveis, clearResponsaveis } = useStoreResponsaveis()
  const { usuario, setUsuario, clearUsuario } = useStoreUsuario()

  useEffect(() => {
    async function loadStorageData() {
      const storageToken = await AsyncStorage.getItem('@BOEPM:token')

      const storageRefreshToken = await AsyncStorage.getItem(
        '@BOEPM:refreshToken',
      )

      if (storageToken)
        api.defaults.headers.Authorization = `Bearer ${storageToken}`

      if (
        storageRefreshToken &&
        storageToken &&
        usuario &&
        responsaveis.length !== 0
      ) {
        setTemResponsaveis(true)
      }
      setLoading(false)
    }

    loadStorageData()
  }, [])

  async function login(data: InputLoginData): Promise<null | string> {
    setPage(0)
    try {
      const response = await onLogin(data)
      if (response.status === 200) {
        await AsyncStorage.setItem('@username', data.user)
        const { usuario, token, refresh_token } = response.data
        setUsuario(usuario)
        await AsyncStorage.setItem('@BOEPM:token', token)
        await AsyncStorage.setItem('@BOEPM:refreshToken', refresh_token)
        api.defaults.headers.Authorization = `Bearer ${token}`
        try {
          const bos = await api.get<BO[]>('/bo/dadosGerais')

          if (bos.status === 200) {
            setTemResponsaveis(false)
            let bosNaoConcluidos: BO[] = []

            if (username === data.user) {
              // Verifica se existe BO não concluido na Lista
              bosNaoConcluidos = bosStore.filter(
                (item: BO) =>
                  !item.BO_STATUS[item.BO_STATUS.length - 1].CRC && !item.ERRO,
              )
            }
            saveUsername(data.user)

            inicial([...bosNaoConcluidos, ...bos.data])
          } else {
            return 'Falha na busca dos seus BOs. Entre em contato com o suporte!'
          }
        } catch (error) {
          return 'O Sistema não pode processar o seu Login. Entre em contato com o suporte!'
        }
        return null
      }
      if (response.status === 401) {
        return response.data
      }

      if (response.status === 503) {
        return 'O Sistema encontra-se indisponível. Entre em contato com o Grupo de Suporte!'
      }
      if (Config.ENVIRONMENT < Config.PROD) {
        if (response.status === 503) {
          return response.data
        }
      }
      if (response.status === 412) {
        return `${response.data}\n\nAtualize pressionando o número da versão abaixo!`
      }
      return `${response.status}: Sistema indisponível!`
    } catch (error) {
      return 'O Servidor demorou para responder. Verifique sua VPN e tente novamente!'
    }
  }

  function logout() {
    setLoadingReq(true)
    clearUsuario()
    AsyncStorage.multiRemove(['@BOEPM:token', '@BOEPM:refreshToken']).then(
      async () => {
        clearResponsaveis()
        setTemResponsaveis(false)
        setLoadingReq(false)
      },
    )
  }

  function setStats(usuario: IUsuario) {
    setUsuario(usuario)
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!usuario,
        temResponsaveis,
        loading,
        login,
        logout,
        loadingReq,
        setStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
