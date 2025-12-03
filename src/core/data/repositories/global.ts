/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import GlobalRepository from '../../domain/models/global'

const useStoreGlobal = create<GlobalRepository>(
  persist(
    (set, _get) => ({
      username: null,
      saveUsername: (u: string) => set(() => ({ username: u })),
    }),
    {
      name: '@BOEPM:global',
      getStorage: () => AsyncStorage,
    },
  ),
)

export default useStoreGlobal
