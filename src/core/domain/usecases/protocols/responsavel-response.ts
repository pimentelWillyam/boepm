import Responsavel from '../../models/responsavel'

export interface BuscaResponsavelResponse {
  data: Responsavel | string
  error: boolean
}
