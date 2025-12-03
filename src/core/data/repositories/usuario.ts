/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import Usuario from '../../domain/models/usuario'
import UsuarioRepository from '../../domain/repositories/usuario-repository'

const useStoreUsuario = create<UsuarioRepository>(
  persist(
    (set, _) => ({
      usuario: null,
      clearUsuario: () => set(() => ({ usuario: null })),
      setUsuario: (u: Usuario) => set((state) => ({ usuario: u })),
    }),
    {
      name: '@BOEPM:usuario',
      getStorage: () => AsyncStorage,
    },
  ),
)

export default useStoreUsuario
