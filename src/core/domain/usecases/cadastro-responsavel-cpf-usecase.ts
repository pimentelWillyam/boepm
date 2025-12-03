import { BuscaResponsavelResponse } from './protocols/responsavel-response'

export interface BuscaResponsavelCPFUsecase {
  execute: (cpf: string) => Promise<BuscaResponsavelResponse>
}
