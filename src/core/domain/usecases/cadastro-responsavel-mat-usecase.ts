/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BuscaResponsavelResponse } from './protocols/responsavel-response'

export interface BuscaResponsavelMatriculaUseCase {
  execute: (matricula: string) => Promise<BuscaResponsavelResponse>
}
