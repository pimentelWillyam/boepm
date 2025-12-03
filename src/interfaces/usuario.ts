import { IResponsavel } from './responsavel'

export default interface IUsuario extends IResponsavel {
  PRIMEIRO_ACESSO: boolean
  STATS?: {
    TOTAL: number
    LOCAL: number
    DELEGACIA: number
    TCO_LOCAL: number
  }
}
