import Config from '../../../config'
import ResponsavelRepository from '../../domain/repositories/responsavel-respository'
import { BuscaResponsavelMatriculaUseCase } from '../../domain/usecases/cadastro-responsavel-mat-usecase'
import { BuscaResponsavelResponse } from '../../domain/usecases/protocols/responsavel-response'
import { HttpClient } from '../protocols/http-client'

export default class BuscaResponsavelMatriculaImpl
  implements BuscaResponsavelMatriculaUseCase
{
  private responsavelRepository: ResponsavelRepository | null = null

  private httpClient: HttpClient

  private token = ''

  constructor(
    httpClient: HttpClient,
    token: string,
    responsavelRepository?: ResponsavelRepository,
  ) {
    if (token === '') {
      throw new Error('Token not provided')
    }

    if (responsavelRepository)
      this.responsavelRepository = responsavelRepository
    this.httpClient = httpClient
    this.token = token
  }

  execute = async (matricula: string): Promise<BuscaResponsavelResponse> => {
    const response = await this.httpClient.request({
      method: 'get',
      url: `${
        Config.urlEnvironments[Config.ENVIRONMENT].urlBase
      }/bo/buscarAgente/${matricula}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    if (response.statusCode === 200) {
      if (this.responsavelRepository)
        this.responsavelRepository.setResponsaveis(response.body)
      return {
        data: response.body,
        error: false,
      }
    }
    return {
      data: response.body,
      error: true,
    }
  }
}
