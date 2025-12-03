/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import IUsuario from '../interfaces/usuario'

interface State {
  usuario: IUsuario | null
  setUsuario: (u: IUsuario) => void
  clearUsuario: () => void
}

const useStoreUsuario = create<State>(
  persist(
    (set, _get) => ({
      usuario: null,
      clearUsuario: () => set(() => ({ usuario: null })),
      setUsuario: (u: IUsuario) => set((state) => ({ usuario: u })),
    }),

    {
      name: '@BOEPM:usuario',
      getStorage: () => AsyncStorage,
    },
  ),
)

export default useStoreUsuario
