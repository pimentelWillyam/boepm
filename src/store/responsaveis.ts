/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { IResponsavel } from '../interfaces/responsavel'

interface State {
  responsaveis: IResponsavel[]
  setResponsaveis: (r: IResponsavel) => void
  delResponsaveis: (r: IResponsavel) => void
  clearResponsaveis: () => void
}

const useStoreResponsaveis = create<State>(
  persist(
    (set, _get) => ({
      responsaveis: [],
      clearResponsaveis: () => set(() => ({ responsaveis: [] })),
      setResponsaveis: (r: IResponsavel) =>
        set(state => ({ responsaveis: [...state.responsaveis, r] })),
      delResponsaveis: (r: IResponsavel) =>
        set(state => {
          return {
            responsaveis: [
              ...state.responsaveis.filter(
                resp => resp.ID_USUARIO !== r.ID_USUARIO,
              ),
            ],
          }
        }),
    }),
    {
      name: '@BOEPM:efetivo',
      getStorage: () => AsyncStorage,
    },
  ),
)

export default useStoreResponsaveis
