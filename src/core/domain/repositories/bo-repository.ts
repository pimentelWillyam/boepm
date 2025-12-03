import BO from '../models/bo'
import Responsavel from '../models/responsavel'
import Usuario from '../models/usuario'

export default interface BORepository {
  bos: BO[]
  inicial: (state: BO[]) => void
  limparBos: (state: BO) => void
  adicionar: (state: BO) => void
  editar: (state: BO) => void
  complementar: (state: BO) => void
  editarComplementado: (state: BO) => void
  excluir: (state: BO) => void
  atualizarContador: (state: BO) => void
  responsaveis: Usuario[]
  usuario: Responsavel | null
}
