/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import Responsavel from '../../domain/models/responsavel'
import ResponsavelRepository from '../../domain/repositories/responsavel-respository'

const useStoreResponsaveis = create<ResponsavelRepository>(
  persist(
    (set, _get) => ({
      responsaveis: [],
      clearResponsaveis: () => set(() => ({ responsaveis: [] })),
      setResponsaveis: (r: Responsavel) =>
        set(state => ({ responsaveis: [...state.responsaveis, r] })),
      delResponsaveis: (r: Responsavel) =>
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
