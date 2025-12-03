import Responsavel from './responsavel'

export default interface Usuario extends Responsavel {
  PRIMEIRO_ACESSO: boolean
  STATS?: {
    TOTAL: number
    LOCAL: number
    DELEGACIA: number
    TCO_LOCAL: number
  }
}
