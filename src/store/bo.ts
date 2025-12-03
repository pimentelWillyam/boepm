/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-community/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import BO from '../interfaces/bo'
import { IResponsavel } from '../interfaces/responsavel'
import changeUUID from '../utils/changeUUID'
import IUsuario from '../interfaces/usuario'

interface State {
  bos: BO[]
  inicial: (state: BO[]) => void
  limparBos: (state: BO) => void
  adicionar: (state: BO) => void
  editar: (state: BO) => void
  complementar: (state: BO) => void
  editarComplementado: (state: BO) => void
  excluir: (state: BO) => void
  atualizarContador: (state: BO) => void
  responsaveis: IUsuario[]
  usuario: IResponsavel | null
}

const useStore = create<State>(
  persist(
    (set, _get) => ({
      bos: [],
      limparBos: (bo: BO) => set(() => ({ bos: [] })),
      // Operação de Await para buscar os bos
      inicial: (bos: BO[]) => set(() => ({ bos: [...bos] })),
      adicionar: (bo: BO) => set((state) => ({ bos: [bo, ...state.bos] })),
      editar: (bo: BO) =>
        set((state) => ({
          bos: [
            ...state.bos.map((b) => {
              if (b.ID_BO === bo.ID_BO) return bo
              return b
            }),
          ],
        })),
      complementar: (bo: BO) =>
        set((state) => ({ bos: [changeUUID(bo), ...state.bos] })),
      editarComplementado: (bo: BO) =>
        set((state) => {
          if (bo.ID_BO_COMPLEMENTAR) {
            const boComplementado = state.bos.find(
              (b) => b.ID_BO === bo.ID_BO_COMPLEMENTAR,
            )
            if (boComplementado) {
              return {
                bos: [
                  bo,
                  { ...boComplementado, COMPLEMENTADO: 1 },
                  ...state.bos.filter(
                    (b) =>
                      b.ID_BO !== bo.ID_BO && b.ID_BO !== bo.ID_BO_COMPLEMENTAR,
                  ),
                ],
              }
            }
          }

          return {
            bos: [bo, ...state.bos.filter((b) => b.ID_BO !== bo.ID_BO)],
          }
        }),
      excluir: (bo: BO) =>
        set((state) => ({
          bos: [...state.bos.filter((i) => i.ID_BO !== bo.ID_BO)],
        })),
      atualizarContador: (bo: BO) =>
        set((state) => ({ bos: [...state.bos, bo] })),
      responsaveis: [],
      usuario: null,
    }),

    {
      name: '@BOEPM:bos',
      getStorage: () => AsyncStorage,
    },
  ),
)

export default useStore
