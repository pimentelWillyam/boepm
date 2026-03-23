/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useCallback, useContext, useState } from 'react'
import { Alert, Keyboard } from 'react-native'
import AuthContext from '../../contexts/auth'
import { IResponsavel } from '../../interfaces/responsavel'
import useStoreResponsaveis from '../../store/responsaveis'
import useStoreUsuario from '../../store/usuario'
import { buscarPMPorCPF, buscarPMPorMatricula } from './helper'

const useCadastroEfetivo = () => {
  const { logout } = useContext(AuthContext)
  const [showBoxLoading, setShowBoxLoading] = useState(false)
  const [showBoxInput, setShowBoxInput] = useState(false)
  const { usuario } = useStoreUsuario()
  const { responsaveis, setResponsaveis, delResponsaveis } =
    useStoreResponsaveis()

  // Remover Responsável da lista de PMs do Efetivo
  const removeResponsavel = useCallback(
    async (usuarioExcluir: IResponsavel) => {
      if (usuario) {
        Alert.alert(
          'Deletar Patrulheiro?',
          'Tem certeza que deseja deletar esse Usuário?',
          [
            {
              text: 'NÃO',
            },
            {
              text: 'SIM',
              onPress: async () => {
                if (usuarioExcluir.ID_USUARIO === usuario.ID_USUARIO) {
                  Alert.alert(
                    'Exclusão de Responsável',
                    'Você não pode se excluir do pré-cadastro do Efetivo',
                  )
                } else delResponsaveis(usuarioExcluir)
              },
            },
          ],
        )
      }
    },
    [delResponsaveis, usuario],
  )

  // Adicionar Responsável na lista de PMs
  const addResponsavel = useCallback(
    async (data: IResponsavel) => {
      setShowBoxLoading(true)

      Keyboard.dismiss()

      // Na entrada na Tela o usuario logado já é adicionado na lista
      if (usuario) {
        if (data.MATRICULA === usuario.MATRICULA && responsaveis.length === 0) {
          setResponsaveis({ ...data, CD_TIPO_ENVOLVIMENTO: 0 })
          setShowBoxLoading(false)
        } else {
          const respJaExiste = responsaveis.find(
            (item) => item.MATRICULA === data.MATRICULA,
          )
          if (respJaExiste) {
            Alert.alert('Informação', 'Responsável já adicionado(a)!')
            setShowBoxLoading(false)
          } else {
            const res = await buscarPMPorMatricula(data.MATRICULA)
            setShowBoxLoading(false)
            if (!res.error) {
              if (res.responsavel) setResponsaveis(res.responsavel)
              return
            }
            if (res.status) {
              if (res.status === 404) {
                setShowBoxInput(true)
                return
              }
              if (res.status === 401) {
                Alert.alert('Atenção', 'Sua sessão expirou!')
                logout()
                return
              }
            }
            Alert.alert('Atenção', res.error)
          }
        }
      }
    },
    [logout, responsaveis, setResponsaveis, usuario],
  )

  const buscacpf = useCallback(
    async (data: { CPF: string }) => {
      setShowBoxLoading(true)
      const cpf: string = data.CPF.replace(/\D/gim, '')
      const respJaExiste = responsaveis.find((item) => item.CPF === cpf)
      if (respJaExiste) {
        Alert.alert('Informação', 'Responsável já adicionado(a)!')
        setShowBoxLoading(false)
      } else {
        const res = await buscarPMPorCPF(cpf)
        setShowBoxLoading(false)
        setShowBoxInput(false)
        if (!res.error) {
          if (res.responsavel) setResponsaveis(res.responsavel)
          return
        }
        Alert.alert('Atenção', res.error)
      }
    },
    [responsaveis, setResponsaveis],
  )

  return {
    usuario,
    removeResponsavel,
    responsaveis,
    setResponsaveis,
    showBoxLoading,
    showBoxInput,
    setShowBoxInput,
    addResponsavel,
    buscacpf,
  }
}

export default useCadastroEfetivo
