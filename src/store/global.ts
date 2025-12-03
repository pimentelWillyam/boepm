/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ICaracteristicas,
  IDadosProfissionais,
  IEndereco,
  IModusOperandi,
} from '../interfaces/bo'

interface IDadosTemporarios {
  MODUS_OPERANDI?: IModusOperandi | null
  CARACTERISTICAS?: ICaracteristicas | null
  ENDERECO?: IEndereco | null
  DADOS_PROFISSIONAIS?: IDadosProfissionais | null
}
interface State {
  username: string | null
  saveUsername: (u: string) => void
  bo: number | null
  setBO(index: number | null): void
  page: number
  setPage(n: number): void
  data: IDadosTemporarios
  setData(data: IDadosTemporarios): void
}

const useStoreGlobal = create<State>(
  persist(
    (set, _get) => ({
      username: null,
      saveUsername: (u: string) => set(() => ({ username: u })),
      bo: null,
      setBO: (index: number | null) => set(() => ({ bo: index })),
      page: 0,
      setPage: (n: number) => set(() => ({ page: n })),
      data: {} as IDadosTemporarios,
      setData: (d: IDadosTemporarios) => set(() => ({ data: d })),
    }),
    {
      name: '@BOEPM:global',
      getStorage: () => AsyncStorage,
    },
  ),
)

export default useStoreGlobal
